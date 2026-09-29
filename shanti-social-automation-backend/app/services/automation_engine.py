import datetime
import re
from typing import Dict, Any, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from loguru import logger

from app.models.instagram import InstagramAccount, CommentEvent
from app.models.facebook import FacebookAccount, FacebookCommentEvent
from app.models.automation import AutomationFlow, FlowNode, FlowEdge
from app.models.log import AutomationLog
from app.db.repository import automation_log_repo, comment_repo, facebook_comment_repo
from app.integrations.meta.client import meta_client, MetaAPIError
from app.utils.text import contains_keyword

class AutomationEngine:
    def __init__(self, db: AsyncSession, account: Any, comment_event: Any):
        self.db = db
        self.account = account
        self.comment_event = comment_event
        self.tags: List[str] = []
        self.is_facebook = hasattr(account, "facebook_page_id")

    async def _replace_placeholders(self, text: str) -> str:
        """Replace placeholders like {{username}}, {{post_title}}, and {{comment_text}} in templates."""
        if not text:
            return ""
        
        post_title = ""
        if self.comment_event.media_id:
            try:
                from sqlalchemy import select
                if self.is_facebook:
                    from app.models.facebook import FacebookPost
                    stmt = select(FacebookPost).filter(FacebookPost.id == self.comment_event.media_id)
                    res = await self.db.execute(stmt)
                    post_obj = res.scalar_one_or_none()
                    if post_obj:
                        post_title = post_obj.caption or ""
                else:
                    from app.models.instagram import Post
                    stmt = select(Post).filter(Post.id == self.comment_event.media_id)
                    res = await self.db.execute(stmt)
                    post_obj = res.scalar_one_or_none()
                    if post_obj:
                        post_title = post_obj.caption or ""
            except Exception as e:
                logger.warning(f"Failed to fetch post title for placeholder replacement: {str(e)}")

        replacements = {
            "username": self.comment_event.username or "",
            "comment_text": self.comment_event.text or "",
            "post_id": self.comment_event.media_id or "",
            "comment_id": self.comment_event.comment_id or "",
            "post_title": post_title
        }

        def replace_in_obj(obj):
            if isinstance(obj, str):
                for k, v in replacements.items():
                    escaped_key = re.escape(k)
                    pattern = r'(?i)\{\{\s*' + escaped_key + r'\s*\}\}'
                    obj = re.sub(pattern, str(v), obj)
                return obj
            elif isinstance(obj, dict):
                return {k: replace_in_obj(v) for k, v in obj.items()}
            elif isinstance(obj, list):
                return [replace_in_obj(item) for item in obj]
            return obj

        import json
        try:
            stripped = text.strip()
            if stripped.startswith("{") and stripped.endswith("}"):
                data = json.loads(stripped)
                data = replace_in_obj(data)
                return json.dumps(data)
        except Exception as e:
            logger.warning(f"Failed JSON-aware placeholder replacement: {str(e)}")

        for k, v in replacements.items():
            escaped_key = re.escape(k)
            pattern = r'(?i)\{\{\s*' + escaped_key + r'\s*\}\}'
            text = re.sub(pattern, str(v), text)
        return text

    async def log_step(self, flow_id: str, action_type: str, status: str, details: Dict[str, Any]):
        """Write execution step details to the database logs."""
        try:
            if self.comment_event and getattr(self.comment_event, "media_id", None):
                details["media_id"] = self.comment_event.media_id
            log_data = {
                "flow_id": flow_id,
                "comment_id": self.comment_event.comment_id,
                "action_type": action_type,
                "status": status,
                "details": details
            }
            await automation_log_repo.create(self.db, obj_in=log_data)
        except Exception as e:
            logger.error(f"Failed to save automation log: {str(e)}")

    async def run_flow(self, flow: AutomationFlow):
        """Execute the automation flow starting from the matched keyword trigger."""
        logger.info(f"Running flow '{flow.name}' (ID: {flow.id}) for comment {self.comment_event.comment_id}")
        
        # Load nodes and edges mapping
        nodes_map = {node.id: node for node in flow.nodes}
        
        # Check if this flow is a post-specific flow
        is_post_specific = bool(flow.instagram_post_id or flow.facebook_post_id or (flow.name and flow.name.startswith("Post Flow:")))

        # Find trigger node that matched
        trigger_node = None
        matched_kws = []
        for node in flow.nodes:
            if node.type == "trigger":
                keywords = node.config.get("keywords", [])
                exact_word = node.config.get("exact_word", True)

                # For post-specific flows, only match "price"
                if is_post_specific and any(k.lower() == "price" for k in keywords):
                    keywords = ["price"]

                for kw in keywords:
                    if contains_keyword(self.comment_event.text, kw, exact_word=exact_word):
                        if not trigger_node:
                            trigger_node = node
                        if kw not in matched_kws:
                            matched_kws.append(kw)
            if trigger_node:
                break
                
        if not trigger_node:
            logger.warning(f"Could not locate matching trigger node in flow {flow.id}")
            return
            
        # Log trigger match success with only actually matched keyword(s)
        await self.log_step(
            flow_id=flow.id,
            action_type="trigger_match",
            status="success",
            details={
                "trigger_node_id": trigger_node.id,
                "comment_id": getattr(self.comment_event, "comment_id", None),
                "comment_text": self.comment_event.text,
                "matched_keywords": matched_kws if matched_kws else [keywords[0]] if keywords else []
            }
        )
        
        # Start BFS/DFS traversal from trigger node
        visited = set()
        queue = [(trigger_node.id, None)]  # list of (node_id, incoming_condition_value)
        
        while queue:
            node_id, incoming_cond = queue.pop(0)
            if node_id in visited:
                continue
                
            node = nodes_map.get(node_id)
            if not node:
                continue
                
            visited.add(node_id)
            
            # Execute node logic (skip trigger node execution, as it is just the starting point)
            next_condition_val = None
            success = True
            
            if node.type == "action_reply":
                raw_msg = (node.config.get("message") or "").strip()
                template = raw_msg or "@{{username}} Thanks for your comment! Check your DMs 📩"
                reply_text = await self._replace_placeholders(template)
                try:
                    from sqlalchemy import select
                    from app.models.instagram import Comment
                    from app.models.facebook import FacebookComment
                    
                    Model = FacebookComment if self.is_facebook else Comment
                    stmt = select(Model).filter(Model.parent_id == self.comment_event.comment_id)
                    res = await self.db.execute(stmt)
                    existing_reply = res.scalars().first()
                    
                    if existing_reply:
                        logger.info(f"Comment {self.comment_event.comment_id} has already been replied to (reply id {existing_reply.id}). Skipping API reply call.")
                        reply_id = existing_reply.id
                    else:
                        logger.info(f"[FlowExecution] Posting public comment reply to comment {self.comment_event.comment_id}: {reply_text!r}")
                        reply_id = await meta_client.reply_to_comment(
                            page_access_token=self.account.page_access_token,
                            comment_id=self.comment_event.comment_id,
                            message=reply_text
                        )
                        logger.info(f"[FlowExecution] Public comment reply posted successfully (reply_id={reply_id}): {reply_text!r}")
                        try:
                            repo_to_use = facebook_comment_repo if self.is_facebook else comment_repo
                            await repo_to_use.create(self.db, obj_in={
                                "id": reply_id or f"bot_reply_{int(datetime.datetime.utcnow().timestamp())}",
                                "media_id": self.comment_event.media_id,
                                "text": reply_text,
                                "username": self.account.username,
                                "timestamp": datetime.datetime.utcnow(),
                                "parent_id": self.comment_event.comment_id
                            })
                            await self.db.commit()
                        except Exception as ex:
                            logger.warning(f"Could not cache automated reply in comments table: {str(ex)}")

                    await self.log_step(
                        flow_id=flow.id,
                        action_type="reply_sent",
                        status="success",
                        details={"reply_id": reply_id, "text": reply_text}
                    )
                except MetaAPIError as e:
                    success = False
                    await self.log_step(
                        flow_id=flow.id,
                        action_type="reply_sent",
                        status="failed",
                        details={"error": str(e), "status_code": e.status_code, "text": reply_text}
                    )
                    
            elif node.type == "action_dm":
                template = None
                
                # Priority 1: If node is linked to a specific DM automation rule, always fetch live from DB
                dm_automation_id = node.config.get("dm_automation_id")
                if dm_automation_id and dm_automation_id != "custom":
                    from app.models.instagram import DMAutomation
                    from sqlalchemy import select
                    stmt = select(DMAutomation).filter(DMAutomation.id == str(dm_automation_id))
                    res = await self.db.execute(stmt)
                    linked_dm = res.scalar_one_or_none()
                    if linked_dm and linked_dm.reply_text:
                        template = linked_dm.reply_text
                        logger.info(f"Retrieved live linked DM template '{linked_dm.name}' (ID: {linked_dm.id}) for action_dm node")

                # Priority 2: If node directly configured with a JSON message template
                if not template:
                    node_message = (node.config.get("message") or "").strip()
                    if node_message.startswith("{") and node_message.endswith("}"):
                        template = node_message

                # Priority 3: If not resolved yet, retrieve active DM template from DMAutomation table
                if not template and not self.is_facebook:
                    from app.models.instagram import DMAutomation
                    from sqlalchemy import select
                    
                    stmt = select(DMAutomation).filter(
                        DMAutomation.instagram_account_id == self.account.id,
                        DMAutomation.is_active == True
                    ).order_by(DMAutomation.created_at.desc())
                    res = await self.db.execute(stmt)
                    automations = res.scalars().all()
                    
                    # First check if any template has matching keyword with trigger
                    trigger_keywords = []
                    for n in flow.nodes:
                        if n.type == "trigger":
                            trigger_keywords.extend([kw.lower() for kw in n.config.get("keywords", [])])
                    
                    if trigger_keywords:
                        for aut in automations:
                            if aut.keyword and aut.keyword.lower() in trigger_keywords:
                                template = aut.reply_text
                                logger.info(f"Retrieved user-defined DM template by keyword(s) {trigger_keywords}: {template[:50]}")
                                break
                    
                    # If still not matched, use the latest active DM automation template
                    if not template and automations:
                        template = automations[0].reply_text
                        logger.info(f"Using default active DM template '{automations[0].name}' for account {self.account.username}")

                # Fallback to the configured node config message
                if not template:
                    template = node.config.get("message", "Hello!")

                # Automatically rewrite any localhost URLs in template to PUBLIC_BASE_URL if configured
                from app.core.config import settings
                if settings.PUBLIC_BASE_URL and template:
                    public_base = settings.PUBLIC_BASE_URL.rstrip("/")
                    for local_origin in ["http://localhost:8000", "http://127.0.0.1:8000", "http://localhost:5173", "http://localhost:3000"]:
                        if local_origin in template:
                            template = template.replace(local_origin, public_base)

                import json
                template_data = {}
                is_json_template = False
                try:
                    stripped_tmpl = (template or "").strip()
                    if stripped_tmpl.startswith("{") and stripped_tmpl.endswith("}"):
                        template_data = json.loads(stripped_tmpl)
                        is_json_template = True
                except Exception:
                    pass

                rule_id = dm_automation_id if (dm_automation_id and dm_automation_id != "custom") else (automations[0].id if automations else None)

                # Extract and format the configured Link DM and Entry parameters
                default_entry_msg = "👋 Thanks for the comment.\n\nTap the button below and I'll send you the link right away!\nReply STOP to opt-out"
                default_entry_btn = "➡️ Send me the Link!"

                if is_json_template:
                    entry_msg_raw = template_data.get("entry_message") or template_data.get("step1_text") or template_data.get("text") or default_entry_msg
                    entry_btn_raw = template_data.get("entry_button_text") or template_data.get("step1_button_text") or template_data.get("button_text") or default_entry_btn
                    msg_text_raw = template_data.get("message_text") or template_data.get("text") or template_data.get("reply_text") or "Here is the link you requested 👇"
                    button_text_raw = template_data.get("button_text") or template_data.get("link_button_text") or "Open Link"
                    link_url_raw = template_data.get("link_url") or template_data.get("button_url") or ""
                    image_url_raw = template_data.get("image_url") or ""
                else:
                    entry_msg_raw = default_entry_msg
                    entry_btn_raw = default_entry_btn
                    msg_text_raw = template or "Here is the link you requested 👇"
                    button_text_raw = "Open Link"
                    link_url_raw = ""
                    image_url_raw = ""

                # Perform placeholder replacement on texts
                entry_msg = await self._replace_placeholders(entry_msg_raw)
                msg_text = await self._replace_placeholders(msg_text_raw)

                is_fg = bool(template_data.get("require_follow") or template_data.get("dm_type") == "follow_gate")
                link_config = {
                    "dm_type": "follow_gate" if is_fg else template_data.get("dm_type", "link_dm"),
                    "require_follow": is_fg,
                    "follow_username": template_data.get("follow_username") or "rish.jain89",
                    "follow_intro_text": template_data.get("follow_intro_text") or "Follow me here ➡️ @rish.jain89",
                    "follow_url": template_data.get("follow_url") or "https://instagram.com/rish.jain89",
                    "follow_button_text": template_data.get("follow_button_text") or "Follow me here",
                    "confirm_button_text": template_data.get("confirm_button_text") or "✅ Send me the DM",
                    "title": template_data.get("title") or "➡️ You need to be following me to unlock this DM",
                    "subtitle": template_data.get("subtitle") or "Once you’re following, click the button below to get the DM!",
                    "entry_message": entry_msg,
                    "entry_button_text": entry_btn_raw,
                    "message_text": msg_text,
                    "button_text": button_text_raw,
                    "link_url": link_url_raw,
                    "image_url": image_url_raw
                }

                # Persist InstagramConversationContext (Meta-compliant interaction tracking)
                context_id = None
                if not self.is_facebook:
                    try:
                        from app.db.repository import conversation_context_repo
                        context = await conversation_context_repo.create(self.db, obj_in={
                            "instagram_account_id": self.account.id,
                            "comment_id": self.comment_event.comment_id,
                            "media_id": self.comment_event.media_id,
                            "commenter_username": self.comment_event.username,
                            "commenter_id": getattr(self.comment_event, "commenter_id", None),
                            "flow_id": flow.id,
                            "dm_automation_id": rule_id,
                            "status": "entry_sent",
                            "link_config": link_config
                        })
                        await self.db.commit()
                        context_id = context.id
                    except Exception as e_ctx:
                        logger.warning(f"Could not persist conversation context: {e_ctx}")

                # Prepare the Private Reply DM Entry payload
                entry_payload = dict(link_config)
                entry_payload["context_id"] = context_id or ""
                entry_payload["is_link_dm_entry"] = True

                try:
                    # Step 1: Send Private Reply DM Entry via comment_id with 'Send Me the Link' button
                    dm_id = await meta_client.send_dm_by_comment(
                        page_access_token=self.account.page_access_token,
                        comment_id=self.comment_event.comment_id,
                        message_text=json.dumps(entry_payload),
                        account_username=self.account.username
                    )

                    log_details = {
                        "message_id": dm_id,
                        "context_id": context_id,
                        "entry_message": entry_msg,
                        "entry_button": entry_btn_raw,
                        "link_url": link_url_raw
                    }
                    logger.info(f"[FlowExecution] Direct Message sent successfully to commenter of comment {self.comment_event.comment_id} (dm_id={dm_id})")
                    await self.log_step(
                        flow_id=flow.id,
                        action_type="dm_entry_sent",
                        status="success",
                        details=log_details
                    )

                    # Log Rule Execution
                    if not self.is_facebook and rule_id:
                        try:
                            from app.db.repository import dm_automation_execution_repo
                            now = datetime.datetime.utcnow()
                            recorded_msg_id = dm_id or f"msg_flow_{int(now.timestamp())}_{self.comment_event.comment_id[:8]}"
                            await dm_automation_execution_repo.create(self.db, obj_in={
                                "automation_id": rule_id,
                                "message_id": recorded_msg_id,
                                "status": "success",
                                "executed_at": now
                            })
                            await self.db.commit()
                        except Exception as e_hist:
                            logger.warning(f"Could not record DM execution in personal DM tables: {e_hist}")
                except MetaAPIError as e:
                    # Handle Meta platform limits on private replies:
                    # 1. Subcode 2534025: Comment already received a private reply
                    # 2. Subcode 2534024: Comment is older than Meta's 7-day limit for private replies
                    is_platform_limit = (
                        (e.error_code in (100, -1) and e.error_subcode in (2534025, 2534024)) or
                        e.error_subcode in (2534025, 2534024) or
                        "invalid for a private reply" in str(e).lower() or
                        "already has a reply" in str(e).lower() or
                        "too old" in str(e).lower()
                    )

                    if is_platform_limit:
                        reason_text = (
                            "Meta platform limit: Comment is older than 7 days, or user has already received a private reply on this post."
                            if (e.error_subcode == 2534024 or "too old" in str(e).lower())
                            else "Meta platform limit: Comment already replied to, or user has already received a private reply on this post."
                        )
                        logger.info(f"Private reply skipped due to Meta platform limit: {str(e)}")
                        await self.log_step(
                            flow_id=flow.id,
                            action_type="dm_sent",
                            status="skipped",
                            details={
                                "reason": reason_text,
                                "error": str(e)
                            }
                        )
                        # Do not halt path traversal for Meta platform limitations
                        success = True
                    else:
                        success = False
                        await self.log_step(
                            flow_id=flow.id,
                            action_type="dm_sent",
                            status="failed",
                            details={"error": str(e), "status_code": e.status_code, "text": dm_text}
                        )
                    
            elif node.type == "action_tag":
                tag_name = node.config.get("tag", "new_tag")
                self.tags.append(tag_name)
                await self.log_step(
                    flow_id=flow.id,
                    action_type="tag_added",
                    status="success",
                    details={"tag": tag_name}
                )
                
            elif node.type == "condition":
                # Evaluate condition based on configurations
                # Example: check if commenter's username is in list, or text length > value
                field = node.config.get("field", "text")
                operator = node.config.get("operator", "contains")
                value = node.config.get("value", "")
                
                check_val = ""
                if field == "text":
                    check_val = self.comment_event.text.lower()
                elif field == "username":
                    check_val = self.comment_event.username.lower()
                    
                match = False
                if operator == "contains":
                    match = value.lower() in check_val
                elif operator == "equals":
                    match = value.lower() == check_val
                elif operator == "starts_with":
                    match = check_val.startswith(value.lower())
                    
                next_condition_val = "yes" if match else "no"
                
                await self.log_step(
                    flow_id=flow.id,
                    action_type="condition_check",
                    status="success",
                    details={"field": field, "operator": operator, "expected": value, "matched": match}
                )

            # If node execution failed, halt path traversal
            if not success:
                logger.error(f"Node {node_id} ({node.type}) failed execution. Halting this path.")
                continue

            # Queue next nodes from outgoing edges
            for edge in flow.edges:
                if edge.source_node_id == node_id:
                    # If it's a condition node, verify the condition value matching the edge criteria
                    if node.type == "condition":
                        if edge.condition_value == next_condition_val:
                            queue.append((edge.target_node_id, edge.condition_value))
                    else:
                        # Standard sequence transition
                        queue.append((edge.target_node_id, None))
                        
        logger.info(f"Finished executing flow {flow.id}")
