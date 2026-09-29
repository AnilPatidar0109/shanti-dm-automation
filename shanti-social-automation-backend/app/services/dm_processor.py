import datetime
from typing import Dict, Any, Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from loguru import logger

from app.db.repository import (
    instagram_account_repo,
    dm_automation_repo, 
    dm_automation_execution_repo,
    conversation_context_repo,
    automation_flow_repo,
    automation_log_repo
)
from app.models.instagram import DMAutomationExecution
from app.integrations.meta.client import meta_client, MetaAPIError
from app.utils.text import contains_keyword, normalize_text

class DMProcessorService:
    async def process_dm(
        self,
        db: AsyncSession,
        instagram_business_account_id: str,
        sender_id: str,
        recipient_id: str,
        message_id: str,
        text: str,
        timestamp: datetime.datetime,
        payload: Optional[str] = None,
        sender_username: Optional[str] = None
    ) -> Optional[Dict]:
        """
        Process an incoming DM message:
        1. Identify connected Instagram account.
        2. Ignore messages sent by the account itself.
        3. Match active InstagramConversationContext (Comment -> Link DM interaction).
           - Tapping 'Send Me the Link' / replying officially opens the Meta 24-hour window!
           - Delivers the rich Link DM with [Open Link] button.
        4. If not a Link DM context, match keyword/default DM automations.
        """
        import json

        logger.info(f"Processing incoming DM {message_id} from {sender_username or sender_id} (id={sender_id}) to {recipient_id} (text={text[:30]!r}, payload={payload!r})")

        # 1. Get Instagram Account connected
        account = await instagram_account_repo.get_by_instagram_id(db, instagram_business_account_id)
        if not account:
            logger.error(f"No registered Instagram Account found for ID: {instagram_business_account_id}")
            return None

        # 2. Ignore messages sent by the account itself
        if (
            sender_id == instagram_business_account_id or
            sender_id == account.username or
            (account.username and sender_id.lower() == account.username.lower()) or
            (sender_username and account.username and sender_username.lower() == account.username.lower())
        ):
            logger.info(f"Ignoring message {message_id} sent by the account itself ({sender_id})")
            return None

        normalized_text = normalize_text(text)
        payload_str = str(payload or "").strip()

        # 3. Check for matching Comment -> Link DM interaction
        context = None
        if payload_str.startswith("LINK_DM:"):
            context_id = payload_str.split("LINK_DM:")[1].strip()
            if context_id:
                context = await conversation_context_repo.get(db, context_id)

        is_link_request = (
            payload_str == "LINK_DM" or
            "SEND_LINK" in payload_str or
            "send me the link" in text.lower() or
            "send me the link" in normalized_text or
            "send me link" in normalized_text or
            normalized_text in ("link", "guide", "info")
        )

        if not context:
            # Look up pending context for this account and user (checks both numeric IGSID and username)
            lookup_id = sender_id if (sender_id and sender_id.isdigit()) else None
            lookup_uname = sender_username or (sender_id if (sender_id and not sender_id.isdigit()) else None)
            context = await conversation_context_repo.get_pending_entry(
                db=db,
                instagram_account_id=account.id,
                commenter_id=lookup_id,
                commenter_username=lookup_uname
            )
            if not context and is_link_request:
                from sqlalchemy import select
                from app.models.instagram import InstagramConversationContext
                stmt = select(InstagramConversationContext).filter(
                    InstagramConversationContext.instagram_account_id == account.id,
                    InstagramConversationContext.status.in_(["entry_sent", "follow_gate_sent"])
                ).order_by(InstagramConversationContext.created_at.desc())
                res = await db.execute(stmt)
                context = res.scalars().first()
                if context:
                    logger.info(f"Matched recent pending conversation context {context.id} for sender {sender_id} ({sender_username})")

        if context and (context.status in ("entry_sent", "follow_gate_sent") or is_link_request):
            # Ensure sender_id is numeric messaging IGSID (Meta requires numeric IGSID in recipient[id])
            if sender_id and str(sender_id).isdigit():
                context.commenter_id = str(sender_id)
            elif (not sender_id or not str(sender_id).isdigit()) and context.commenter_id and context.commenter_id.isdigit():
                sender_id = context.commenter_id

            link_config = context.link_config or {}
            is_follow_gate = bool(link_config.get("require_follow") or link_config.get("dm_type") == "follow_gate")

            # Check if this is the confirmation step (user tapped "✅ Send me the DM")
            is_confirm_step = (
                context.status == "follow_gate_sent" or
                payload_str in ("CONFIRM_FOLLOW_AND_SEND_LINK", "USER_CONFIRMED_FOLLOW") or
                "send me the dm" in text.lower() or
                "send me dm" in normalized_text
            )

            now = datetime.datetime.utcnow()
            context.commenter_id = str(sender_id)
            if sender_username and not context.commenter_username:
                context.commenter_username = sender_username
            context.window_expires_at = now + datetime.timedelta(hours=24)

            # STEP 2: If follow gate is required
            if is_follow_gate:
                follow_handle = link_config.get("follow_username") or "rish.jain89"
                follow_intro = link_config.get("follow_intro_text") or f"Follow me here ➡️ @{follow_handle}"
                follow_title = link_config.get("title") or "➡️ You need to be following me to unlock this DM"
                follow_sub = link_config.get("subtitle") or "Once you’re following, click the button below to get the DM!"
                follow_btn = link_config.get("follow_button_text") or "Follow me here"
                follow_url = link_config.get("follow_url") or f"https://instagram.com/{follow_handle}"
                confirm_btn = link_config.get("confirm_button_text") or "✅ Send me the DM"

                # Check actual follow status via Meta Graph API
                is_following = None
                if is_confirm_step and sender_id and str(sender_id).isdigit():
                    is_following = await meta_client.check_user_follows_business(
                        page_access_token=account.page_access_token,
                        user_id=sender_id
                    )

                # If user tapped entry button ("➡️ Send me the Link!") OR user clicked confirm but is NOT following yet (is_following is False):
                # This matches Image 2 (initial prompt) and Image 3 (re-prompting until followed)
                if not is_confirm_step or is_following is False:
                    logger.info(f"[FollowGate Flow] Sending Follow Gate to {sender_username or sender_id} for @{follow_handle} (is_confirm_step={is_confirm_step}, is_following={is_following})")

                    follow_payload = json.dumps({
                        "dm_type": "follow_gate",
                        "require_follow": True,
                        "follow_intro_text": follow_intro,
                        "follow_url": follow_url,
                        "follow_button_text": follow_btn,
                        "confirm_button_text": confirm_btn,
                        "title": follow_title,
                        "subtitle": follow_sub,
                        "account_username": follow_handle
                    })

                    try:
                        await meta_client.send_direct_dm(
                            page_access_token=account.page_access_token,
                            recipient_id=sender_id,
                            message_text=follow_payload,
                            page_id=account.page_id,
                            account_username=account.username
                        )
                        context.status = "follow_gate_sent"
                        db.add(context)
                        await db.commit()
                        return {"status": "processed", "flow": "follow_gate_sent"}
                    except Exception as ex_fg:
                        logger.warning(f"Error delivering follow gate: {ex_fg}")
                        return {"status": "failed", "error": str(ex_fg)}

            # STEP 3: Deliver the final link
            dest_url = link_config.get("link_url") or link_config.get("button_url") or ""
            dest_btn = link_config.get("button_text") or link_config.get("link_button_text") or "Open Link"
            msg_text = link_config.get("message_text") or "Here is the link you requested 👇"
            img_url = link_config.get("image_url") or ""

            logger.info(f"[LinkDM Flow] User {sender_username or sender_id} (IGSID={sender_id}) unlocked Link DM for account {account.username}. Delivering destination link to {dest_url}")

            context.status = "link_delivered"
            db.add(context)
            await db.commit()

            link_payload = json.dumps({
                "dm_type": "link_dm",
                "message_text": msg_text,
                "button_text": dest_btn,
                "link_url": dest_url,
                "image_url": img_url,
                "account_username": account.username
            })

            execution_status = "success"
            error_msg = None
            try:
                await meta_client.send_direct_dm(
                    page_access_token=account.page_access_token,
                    recipient_id=sender_id,
                    message_text=link_payload,
                    page_id=account.page_id,
                    account_username=account.username
                )
            except MetaAPIError as e:
                if getattr(e, "error_code", None) == 10 or "outside of allowed window" in str(e).lower():
                    execution_status = "outside_window"
                    error_msg = "Meta Policy: Message sent outside allowed 24-hour window. User must send an active message or accept conversation on Instagram."
                    logger.warning(f"[LinkDM Flow] User {sender_username or sender_id} is outside the allowed 24-hour messaging window.")
                    context.status = "outside_window"
                    db.add(context)
                    await db.commit()
                else:
                    execution_status = "failed"
                    error_msg = f"Meta API Error: {e.message} (status: {e.status_code})"
                    logger.error(f"Failed to deliver Link DM: {error_msg}")
            except Exception as e:
                execution_status = "failed"
                error_msg = f"Unexpected Error: {str(e)}"
                logger.error(f"Failed to deliver Link DM: {error_msg}")

            # Record logs
            if context.flow_id:
                try:
                    await automation_log_repo.create(db, obj_in={
                        "flow_id": context.flow_id,
                        "comment_id": context.comment_id,
                        "action_type": "link_dm_delivered",
                        "status": execution_status,
                        "details": {
                            "sender_id": sender_id,
                            "link_url": dest_url,
                            "button_text": dest_btn,
                            "error": error_msg
                        }
                    })
                    await db.commit()
                except Exception as ex_log:
                    logger.warning(f"Could not log link delivery in automation_log: {ex_log}")

            if context.dm_automation_id:
                try:
                    await dm_automation_execution_repo.create(db, obj_in={
                        "automation_id": context.dm_automation_id,
                        "message_id": message_id,
                        "status": execution_status,
                        "error_message": error_msg,
                        "executed_at": now
                    })
                    await db.commit()
                except Exception as ex_hist:
                    logger.warning(f"Could not log execution in dm_automation_execution: {ex_hist}")

            return {"status": "processed", "flow": "link_dm_delivered"}

        # 4. Standard Keyword / Default DM Automation Matching
        active_automations = await dm_automation_repo.get_active_by_instagram_account_id(db, account.id)
        matched_automation = None
        reply_to_send = None

        # 4.1 Exact Keyword match
        for aut in active_automations:
            if aut.trigger_type == "exact_keyword" and aut.keyword:
                if normalized_text == normalize_text(aut.keyword):
                    matched_automation = aut
                    reply_to_send = aut.reply_text
                    break

        # 4.2 Contains Keyword match
        if not reply_to_send and not matched_automation:
            for aut in active_automations:
                if aut.trigger_type == "contains_keyword" and aut.keyword:
                    if normalize_text(aut.keyword) in normalized_text:
                        matched_automation = aut
                        reply_to_send = aut.reply_text
                        break

        # 4.3 Any Message / Default response
        if not reply_to_send and not matched_automation:
            for aut in active_automations:
                if aut.trigger_type == "any_message":
                    matched_automation = aut
                    reply_to_send = aut.reply_text
                    break

        if not reply_to_send:
            logger.info(f"No active DM automation matched for message {message_id}: '{text[:30]}'")
            return None

        # Ensure sender_id is numeric IGSID for standard reply
        if sender_id and not sender_id.isdigit():
            ctx_match = await conversation_context_repo.get_pending_entry(
                db=db,
                instagram_account_id=account.id,
                commenter_username=sender_username or sender_id
            )
            if ctx_match and ctx_match.commenter_id and ctx_match.commenter_id.isdigit():
                sender_id = ctx_match.commenter_id

        logger.info(f"Sending standard automated reply to {sender_username or sender_id} (IGSID={sender_id}) for message {message_id}")

        execution_status = "success"
        error_msg = None

        try:
            await meta_client.send_direct_dm(
                page_access_token=account.page_access_token,
                recipient_id=sender_id,
                message_text=reply_to_send,
                page_id=account.page_id,
                account_username=account.username
            )
        except MetaAPIError as e:
            if getattr(e, "error_code", None) == 10 or "outside of allowed window" in str(e).lower():
                execution_status = "outside_window"
                error_msg = "Meta Policy: Message sent outside allowed 24-hour window. User must send an active message or accept conversation on Instagram."
                logger.warning(f"[DM Automation] User {sender_username or sender_id} is outside the allowed 24-hour messaging window.")
            else:
                execution_status = "failed"
                error_msg = f"Meta API Error: {e.message} (status: {e.status_code})"
                logger.error(f"Failed to send automatic DM reply: {error_msg}")
        except Exception as e:
            execution_status = "failed"
            error_msg = f"Unexpected Error: {str(e)}"
            logger.error(f"Failed to send automatic DM reply: {error_msg}")

        if matched_automation:
            execution_in = {
                "automation_id": matched_automation.id,
                "message_id": message_id,
                "status": execution_status,
                "error_message": error_msg,
                "executed_at": datetime.datetime.utcnow()
            }
            await dm_automation_execution_repo.create(db, obj_in=execution_in)
            await db.commit()

        logger.info(f"Finished processing message {message_id}. Status: {execution_status}")
        return {"status": "processed" if execution_status == "success" else "failed"}

    async def scan_and_process_pending_dms(self, db: AsyncSession, since_timestamp: Optional[datetime.datetime] = None) -> Dict[str, Any]:
        """
        Periodically polls active Instagram Business Accounts for incoming DMs,
        handling button clicks (e.g. '➡️ Send me the Link!', '✅ Send me the DM')
        even when webhooks are not delivered via localhost.
        """
        from typing import Optional
        from app.db.repository import instagram_account_repo
        accounts = await instagram_account_repo.get_multi(db, limit=500)
        processed_count = 0

        for account in accounts:
            if not account.page_access_token or not account.page_id:
                continue

            # Only scan conversations for accounts with active DM automations or active flows
            active_dms = await dm_automation_repo.get_active_by_instagram_account_id(db, account.id)
            active_flows = await automation_flow_repo.get_active_by_instagram_account_id(db, account.id)
            if not active_dms and not active_flows:
                continue
            
            try:
                conversations = await meta_client.get_instagram_conversations(
                    page_id=account.page_id or "me",
                    page_access_token=account.page_access_token,
                    max_items=25
                )
                
                account_identifiers = {
                    str(account.instagram_business_account_id),
                    str(account.page_id),
                    str(account.username).lower() if account.username else ""
                }

                for conv in conversations:
                    # Sync active conversation thread
                    parts = conv.get("participants", {}).get("data", [])
                    other_participant_id = None
                    other_participant_uname = None
                    for p in parts:
                        pid = str(p.get("id", "")).strip()
                        puname = str(p.get("username", "")).strip()
                        if pid and pid not in account_identifiers and puname.lower() != (account.username or "").lower():
                            other_participant_id = pid
                            other_participant_uname = puname
                            break
                    if not other_participant_id and parts:
                        for p in parts:
                            pid = str(p.get("id", "")).strip()
                            puname = str(p.get("username", "")).strip()
                            if pid not in account_identifiers:
                                other_participant_id = pid
                                other_participant_uname = puname
                                break

                    raw_updated = conv.get("updated_time")
                    conv_ts = datetime.datetime.utcnow()
                    if raw_updated:
                        try:
                            conv_ts = datetime.datetime.fromisoformat(raw_updated.replace("Z", "+00:00")).astimezone(datetime.timezone.utc).replace(tzinfo=None)
                        except Exception:
                            pass

                    # Save / update IGConversation logic removed since table was dropped

                    messages = conv.get("messages", {}).get("data", [])
                    # Process chronological order (oldest to newest)
                    for msg in reversed(messages):
                        msg_id = msg.get("id")
                        if not msg_id:
                            continue
                        
                        # Skip if message was already processed/recorded
                        existing_exec = await dm_automation_execution_repo.get_by_message_id(db, msg_id)
                        if existing_exec:
                            continue

                        from_user = msg.get("from") or {}
                        from_id = str(from_user.get("id", "")).strip()
                        from_uname = str(from_user.get("username", "")).strip()

                        raw_created = msg.get("created_time")
                        ts = conv_ts
                        if raw_created:
                            try:
                                ts = datetime.datetime.fromisoformat(raw_created.replace("Z", "+00:00")).astimezone(datetime.timezone.utc).replace(tzinfo=None)
                            except Exception:
                                pass

                        msg_text = msg.get("message", "") or "🖼️ [Automated Card / Media Delivered]"

                        # Skip messages that predate when this account was connected to ShantiDM
                        if account.connected_at and ts < account.connected_at:
                            logger.debug(
                                f"[DMScanner] Skipping message {msg_id} (ts={ts}) — predates "
                                f"account connected_at={account.connected_at}"
                            )
                            continue

                        # Check if outbound message sent by the business account itself
                        is_outbound = (
                            (from_id and from_id in account_identifiers) or
                            (from_uname and account.username and from_uname.lower() == account.username.lower())
                        )
                        if is_outbound:
                            continue

                        # Inbound message from external user
                        # The Meta Graph API strictly requires recipient[id] to be the numeric IGSID (e.g. "2079035929665930"), never a username handle.
                        sender_id = from_id if (from_id and from_id.isdigit()) else (other_participant_id if (other_participant_id and other_participant_id.isdigit()) else (from_id or other_participant_id or from_uname))
                        sender_username = from_uname or other_participant_uname or ""

                        logger.info(f"[DMScanner] Found incoming DM {msg_id} from {sender_username or sender_id} (IGSID={sender_id}): {msg_text[:30]!r}")
                        await self.process_dm(
                            db=db,
                            instagram_business_account_id=account.instagram_business_account_id,
                            sender_id=sender_id,
                            recipient_id=account.instagram_business_account_id,
                            message_id=msg_id,
                            text=msg_text,
                            timestamp=ts,
                            sender_username=sender_username
                        )
                        processed_count += 1
            except Exception as e_acc:
                logger.warning(f"[DMScanner] Error scanning DMs for account {account.username}: {e_acc}")

        return {"processed_count": processed_count}

dm_processor = DMProcessorService()
