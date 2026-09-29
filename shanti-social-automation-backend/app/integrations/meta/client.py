import logging
import re
from typing import Dict, Any, List, Optional
import httpx
from loguru import logger
from app.core.config import settings

class MetaAPIError(Exception):
    def __init__(self, message: str, status_code: int = 500, error_code: Optional[int] = None, error_subcode: Optional[int] = None):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.error_code = error_code
        self.error_subcode = error_subcode

class MetaRateLimitError(MetaAPIError):
    pass

class MetaTokenExpiredError(MetaAPIError):
    pass

class MetaPermissionError(MetaAPIError):
    pass


class MetaClient:
    def __init__(self):
        self.base_url = "https://graph.facebook.com/v19.0"
        self.app_id = settings.META_APP_ID
        self.app_secret = settings.META_APP_SECRET

    async def _request(
        self,
        method: str,
        path: str,
        params: Optional[Dict[str, Any]] = None,
        json: Optional[Dict[str, Any]] = None,
        retries: int = 3
    ) -> Dict[str, Any]:
        """Perform HTTP requests to Meta Graph API with retry logic and error parsing."""
        # Check for mock token to bypass real network calls during testing/sandbox mode
        access_token = None
        if params and "access_token" in params:
            access_token = params["access_token"]
        elif json and "access_token" in json:
            access_token = json["access_token"]
            
        if access_token and (access_token == "mock_page_token" or str(access_token).startswith("mock")):
            logger.info(f"Bypassing Meta API call to {path} in Mock/Sandbox mode.")
            if "replies" in path:
                import time
                return {"id": f"mock_reply_{int(time.time())}"}
            elif "messages" in path or "message" in path:
                return {"message_id": "mock_message_ok"}
            elif "posts" in path:
                return {"data": []}
            return {"status": "success", "mock": True}

        url = f"{self.base_url}/{path.lstrip('/')}"
        
        # Build client
        async with httpx.AsyncClient(timeout=15.0) as client:
            for attempt in range(retries):
                try:
                    response = await client.request(method, url, params=params, json=json)
                    
                    # Parse error if status is not successful
                    if response.status_code != 200:
                        err_json = response.json()
                        error_details = err_json.get("error", {})
                        message = error_details.get("message", "Unknown Meta API error")
                        error_code = error_details.get("code")
                        error_subcode = error_details.get("error_subcode")
                        
                        # Detect permission restriction (Code 10 or 200-299)
                        is_permission_error = False
                        try:
                            code_val = int(error_code) if error_code is not None else None
                            if code_val == 10 or (code_val is not None and 200 <= code_val <= 299):
                                is_permission_error = True
                        except (ValueError, TypeError):
                            pass

                        if error_code == 10 or str(error_code) == "10":
                            logger.info(
                                f"Meta permission restriction on {method} {path} (Attempt {attempt+1}/{retries}). "
                                f"Code: {error_code}, Message: {message} (Will use local cache/mock data fallback)."
                            )
                        elif is_permission_error:
                            logger.warning(
                                f"Meta permission restriction on {method} {path} (Attempt {attempt+1}/{retries}). "
                                f"Code: {error_code}, Subcode: {error_subcode}, Message: {message}"
                            )
                        else:
                            logger.error(
                                f"Meta API error on {method} {path} (Attempt {attempt+1}/{retries}). "
                                f"Code: {error_code}, Subcode: {error_subcode}, Message: {message}"
                            )
                        
                        # Detect Token Expiration (Error code 190)
                        if error_code == 190:
                            raise MetaTokenExpiredError(message, response.status_code, error_code, error_subcode)
                            
                        # Detect Rate Limit (Error code 4, 17, 32, 613, or HTTP 429)
                        if response.status_code == 429 or error_code in [4, 17, 32, 613]:
                            raise MetaRateLimitError(message, response.status_code, error_code, error_subcode)
                            
                        # Detect Permission Restriction (Error code 10 or 200-299)
                        if is_permission_error:
                            raise MetaPermissionError(message, response.status_code, error_code, error_subcode)

                        # Other API Errors
                        raise MetaAPIError(message, response.status_code, error_code, error_subcode)
                        
                    return response.json()
                    
                except (httpx.RequestError, httpx.TimeoutException) as e:
                    logger.warning(f"Connection to Meta API failed (Attempt {attempt+1}/{retries}): {str(e)}")
                    if attempt == retries - 1:
                        raise MetaAPIError(f"Failed connecting to Meta Graph API: {str(e)}") from e
                    # Exponential backoff
                    import asyncio
                    await asyncio.sleep(2 ** attempt)

        raise MetaAPIError("Unknown error occurred during Meta API execution")

    async def get_long_lived_user_token(self, short_lived_token: str) -> str:
        """Exchange short-lived user token for a 60-day long-lived token."""
        logger.info("Exchanging short-lived user access token for a long-lived access token")
        params = {
            "grant_type": "fb_exchange_token",
            "client_id": self.app_id,
            "client_secret": self.app_secret,
            "fb_exchange_token": short_lived_token
        }
        res = await self._request("GET", "/oauth/access_token", params=params)
        return res.get("access_token", "")

    async def debug_token(self, input_token: str) -> Dict[str, Any]:
        """Inspect access token and return token metadata including granular_scopes."""
        if not input_token or input_token.startswith("mock"):
            return {}
        params = {
            "input_token": input_token,
            "access_token": f"{self.app_id}|{self.app_secret}"
        }
        try:
            res = await self._request("GET", "/debug_token", params=params)
            return res.get("data", {})
        except Exception as e:
            logger.warning(f"Failed to debug token: {e}")
            return {}

    async def get_authorized_page_ids(self, user_access_token: str) -> Optional[set]:
        """
        Extract target Page IDs explicitly selected and granted by the user in granular_scopes.
        Returns a set of page ID strings if specific pages were selected,
        or None if granular_scopes does not restrict by target_ids (all authorized).
        """
        token_info = await self.debug_token(user_access_token)
        granular_scopes = token_info.get("granular_scopes", [])
        if not granular_scopes:
            return None

        page_target_ids = set()
        has_page_target_restriction = False

        for item in granular_scopes:
            scope = item.get("scope", "")
            target_ids = item.get("target_ids", [])
            if scope in ["pages_show_list", "pages_read_engagement", "pages_manage_posts", "pages_manage_metadata", "pages_messaging"]:
                if target_ids:
                    has_page_target_restriction = True
                    for tid in target_ids:
                        page_target_ids.add(str(tid))

        if has_page_target_restriction:
            logger.info(f"Granular scopes restrict pages to target_ids: {page_target_ids}")
            return page_target_ids

        return None

    async def discover_accounts(self, long_lived_user_token: str) -> List[Dict[str, Any]]:
        """
        Discover Facebook Pages and connected Instagram Business Accounts,
        respecting the user's granular page selection.
        """
        logger.info("Discovering Facebook Pages and connected Instagram Business Accounts")
        params = {
            "fields": "id,name,access_token,instagram_business_account{id,username,name,profile_picture_url}",
            "access_token": long_lived_user_token
        }
        
        authorized_page_ids = await self.get_authorized_page_ids(long_lived_user_token)

        res = await self._request("GET", "/me/accounts", params=params)
        pages_data = res.get("data", [])
        
        discovered_accounts = []
        for page in pages_data:
            page_id = str(page["id"])
            if authorized_page_ids is not None and page_id not in authorized_page_ids:
                logger.info(f"Skipping Instagram discovery for Page {page.get('name')} ({page_id}) - not in selected pages {authorized_page_ids}")
                continue

            page_token = page.get("access_token")
            # Verify page token has valid permissions
            try:
                await self._request("GET", f"/{page_id}", params={"fields": "id", "access_token": page_token})
            except Exception as e:
                logger.warning(f"Page {page.get('name')} ({page_id}) token validation failed ({e}), skipping.")
                continue

            insta_data = page.get("instagram_business_account")
            if insta_data:
                discovered_accounts.append({
                    "page_id": page_id,
                    "page_name": page["name"],
                    "page_access_token": page_token,
                    "instagram_business_account_id": insta_data["id"],
                    "instagram_username": insta_data.get("username", ""),
                    "instagram_name": insta_data.get("name", ""),
                    "instagram_profile_pic": insta_data.get("profile_picture_url", "")
                })
        
        logger.info(f"Discovered {len(discovered_accounts)} Instagram Business Accounts connected to pages")
        return discovered_accounts

    async def reply_to_comment(self, page_access_token: str, comment_id: str, message: str) -> str:
        """Reply publicly to an Instagram comment."""
        logger.info(f"Replying to Instagram comment {comment_id} with text: {message!r}")
        params = {
            "message": message,
            "access_token": page_access_token
        }
        res = await self._request("POST", f"/{comment_id}/replies", params=params)
        reply_id = res.get("id", "")
        logger.info(f"Successfully posted public reply to comment {comment_id} (reply_id: {reply_id}): {message!r}")
        return reply_id

    @staticmethod
    def _resolve_public_url(url: Optional[str]) -> Optional[str]:
        """
        Automatically converts localhost or relative URLs to public HTTPS URLs
        using settings.PUBLIC_BASE_URL (e.g. ngrok tunnel) so Meta's servers can
        download images and load attachments.
        """
        if not url:
            return url
        url_str = str(url).strip()
        public_base = (settings.PUBLIC_BASE_URL or "").rstrip("/")
        if not public_base:
            return url_str

        # 1. Relative paths starting with / (e.g. /uploads/xyz.jpeg)
        if url_str.startswith("/"):
            resolved = f"{public_base}{url_str}"
            logger.info(f"Resolved relative URL to public URL: {resolved}")
            return resolved

        # 2. Localhost or 127.0.0.1 origins
        local_origins = [
            "http://localhost:8000",
            "http://127.0.0.1:8000",
            "https://localhost:8000",
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:3000",
            "http://127.0.0.1:3000",
        ]
        for origin in local_origins:
            if url_str.startswith(origin):
                resolved = url_str.replace(origin, public_base, 1)
                logger.info(f"Automatically converted local URL '{origin}' to public tunnel URL: '{resolved}'")
                return resolved

        return url_str

    @staticmethod
    def _format_card_title_and_subtitle(
        payload_data: dict,
        default_title: str = "Welcome! Click the link below to get started."
    ) -> tuple[str, str]:
        """
        Formats card title and subtitle for Meta Generic Template elements.
        Meta restricts generic template element 'title' to 80 chars and 'subtitle' to 80 chars.
        If a user entered a multiline or long description, intelligently split across
        'title' and 'subtitle' so the full description is displayed completely without truncation.
        """
        raw_text = (payload_data.get("text") or payload_data.get("reply_text") or "").strip()
        raw_title = (payload_data.get("title") or "").strip()
        raw_subtitle = (payload_data.get("subtitle") or payload_data.get("description") or "").strip()
        button_url = payload_data.get("button_url") or ""

        # If subtitle is explicitly provided and differs from button_url
        if raw_subtitle and raw_subtitle != button_url:
            card_title = (raw_title or raw_text or default_title)[:80]
            card_subtitle = raw_subtitle[:80]
            return card_title, card_subtitle

        full_text = raw_text or raw_title or default_title

        # Check for multiline card description (e.g. line 1 title, subsequent lines subtitle)
        if "\n" in full_text:
            lines = [l.strip() for l in full_text.split("\n") if l.strip()]
            if len(lines) >= 2:
                card_title = lines[0][:80]
                card_subtitle = "\n".join(lines[1:])[:80]
                return card_title, card_subtitle
            elif lines:
                full_text = lines[0]

        # Single line text: if longer than 80 chars, cleanly split at word boundary
        if len(full_text) > 80:
            split_idx = full_text[:80].rfind(" ")
            if split_idx > 20:
                card_title = full_text[:split_idx].strip()
                card_subtitle = full_text[split_idx:].strip()[:80]
            else:
                card_title = full_text[:80]
                card_subtitle = full_text[80:160]
        else:
            card_title = full_text[:80]
            card_subtitle = ""

        if not card_title:
            card_title = default_title[:80]

        return card_title, card_subtitle

    async def send_dm_by_comment(
        self,
        page_access_token: str,
        comment_id: str,
        message_text: str,
        account_username: Optional[str] = None
    ) -> str:
        """
        Send a Private Reply DM directly to the author of a specific Instagram comment.
        Private replies require the original `comment_id` in the `recipient` parameter.
        Supports rich interactive Button Templates (Generic Template) if message_text is JSON.
        """
        payload_data = None
        is_template = False
        try:
            stripped = (message_text or "").strip()
            if stripped.startswith("{") and stripped.endswith("}"):
                import json
                payload_data = json.loads(stripped)
                is_template = True
        except Exception:
            payload_data = None

        logger.info(f"Sending Direct Message to commenter of comment {comment_id}")
        params = {
            "access_token": page_access_token
        }

        if is_template and payload_data:
            dm_type = payload_data.get("dm_type", "button_template")

            # 1. Link DM / Direct Delivery: If link_url or button_url is provided and follow is not required, deliver directly!
            target_link = self._resolve_public_url(payload_data.get("link_url") or payload_data.get("button_url") or "")
            if (dm_type == "link_dm" or payload_data.get("is_link_dm_entry")) and target_link and not payload_data.get("require_follow") and dm_type != "follow_gate":
                btn_title = (payload_data.get("button_text") or payload_data.get("link_button_text") or "Open Link").strip()[:20] or "Open Link"
                main_msg = (
                    payload_data.get("message_text") or
                    payload_data.get("text") or
                    payload_data.get("entry_message") or
                    "Here is the link you requested 👇"
                ).strip()
                
                element = {
                    "title": (payload_data.get("title") or main_msg)[:80],
                    "buttons": [{
                        "type": "web_url",
                        "url": target_link,
                        "title": btn_title
                    }]
                }
                subtitle = payload_data.get("subtitle")
                if subtitle and subtitle != target_link:
                    element["subtitle"] = subtitle[:80]
                img_url = self._resolve_public_url(payload_data.get("image_url") or "")
                if img_url and "localhost" not in img_url and "127.0.0.1" not in img_url:
                    element["image_url"] = img_url

                message_payload = {
                    "attachment": {
                        "type": "template",
                        "payload": {
                            "template_type": "generic",
                            "elements": [element]
                        }
                    }
                }
            elif dm_type in ("link_dm", "follow_gate") or payload_data.get("is_link_dm_entry") or payload_data.get("entry_message") or payload_data.get("require_follow"):
                entry_msg = (
                    payload_data.get("entry_message") or
                    payload_data.get("step1_text") or
                    payload_data.get("text") or
                    "👋 Thanks for the comment.\n\nTap the button below and I'll send you the link right away!\nReply STOP to opt-out"
                ).strip()
                entry_btn = (
                    payload_data.get("entry_button_text") or
                    payload_data.get("step1_button_text") or
                    payload_data.get("button_text") or
                    "➡️ Send me the Link!"
                ).strip()[:20]
                context_id = payload_data.get("context_id") or ""
                payload_val = f"LINK_DM:{context_id}" if context_id else "LINK_DM"

                message_payload = {
                    "text": entry_msg,
                    "quick_replies": [
                        {
                            "content_type": "text",
                            "title": entry_btn,
                            "payload": payload_val
                        }
                    ]
                }
            # Follow Gate prompt: When follow is required, prompt user to follow before clicking link
            elif dm_type == "follow_gate" or payload_data.get("require_follow"):
                follow_user = account_username or payload_data.get("account_username")
                follow_url = self._resolve_public_url(payload_data.get("follow_url"))
                if not follow_url and follow_user:
                    follow_url = f"https://instagram.com/{follow_user.lstrip('@').strip()}"
                
                prompt_text = payload_data.get("follow_intro_text") or (
                    f"Step 1: Follow @{follow_user} first!\n"
                    f"Then reply with 'Send me the Link' or tap below once you are following to receive your link."
                )
                
                buttons = []
                if follow_url:
                    follow_btn_title = (payload_data.get("follow_button_text") or "Follow Account")[:20]
                    buttons.append({
                        "type": "web_url",
                        "url": follow_url,
                        "title": follow_btn_title
                    })
                
                confirm_title = (payload_data.get("confirm_button_text") or "I Followed! Get Link")[:20]
                buttons.append({
                    "type": "postback",
                    "title": confirm_title,
                    "payload": "USER_CONFIRMED_FOLLOW"
                })

                element = {
                    "title": (payload_data.get("title") or "Follow to Unlock Link")[:80],
                    "subtitle": prompt_text[:80],
                    "buttons": buttons
                }
                image_url = self._resolve_public_url(payload_data.get("image_url") or "")
                if image_url:
                    if "localhost" in image_url or "127.0.0.1" in image_url:
                        logger.warning(
                            f"Image URL '{image_url}' is on localhost! Meta's servers cannot reach localhost over the internet. "
                            f"To display images on Instagram, use a public HTTPS URL (e.g. Unsplash, Cloudinary, Imgur, S3) or configure PUBLIC_BASE_URL with ngrok."
                        )
                    else:
                        logger.info(f"Using public image URL for DM attachment: {image_url}")
                    element["image_url"] = image_url

                message_payload = {
                    "attachment": {
                        "type": "template",
                        "payload": {
                            "template_type": "generic",
                            "elements": [element]
                        }
                    }
                }
            elif dm_type in ("quick_reply", "quick_replies"):
                quick_replies = []
                for qr in payload_data.get("quick_replies", []):
                    title = qr.get("title", "") if isinstance(qr, dict) else str(qr)
                    payload_val = qr.get("payload", title) if isinstance(qr, dict) else str(qr)
                    safe_title = title.strip()[:20]
                    if safe_title:
                        quick_replies.append({
                            "content_type": "text",
                            "title": safe_title,
                            "payload": payload_val
                        })
                message_payload = {
                    "text": payload_data.get("text") or "Please select an option:",
                    "quick_replies": quick_replies
                }
            elif dm_type == "postback":
                button_title = (payload_data.get("button_text") or "Tap Here").strip()[:20]
                payload_val = payload_data.get("payload") or "BUTTON_CLICKED"
                card_title, card_subtitle = self._format_card_title_and_subtitle(
                    payload_data,
                    default_title="Welcome!"
                )
                message_payload = {
                    "text": f"{card_title}\n\n[Option: {button_title}]",
                    "quick_replies": [
                        {
                            "content_type": "text",
                            "title": button_title,
                            "payload": payload_val
                        }
                    ]
                }
            elif dm_type in ("button_template", "generic", "generic_template") or (is_template and payload_data.get("button_url")):
                card_title, card_subtitle = self._format_card_title_and_subtitle(
                    payload_data,
                    default_title="Welcome! Click the link below to get started."
                )
                raw_btn_text = (payload_data.get("button_text") or "Link").strip()
                button_text = raw_btn_text[:20] if raw_btn_text else "Link"

                button_url = self._resolve_public_url(payload_data.get("button_url") or "")
                image_url = self._resolve_public_url(payload_data.get("image_url") or "")

                buttons = []
                if button_url:
                    buttons.append({
                        "type": "web_url",
                        "url": button_url,
                        "title": button_text
                    })

                # Follow Me button redirecting to the sending profile
                follow_user = account_username or payload_data.get("account_username")
                follow_url = self._resolve_public_url(payload_data.get("follow_url"))
                if not follow_url and follow_user:
                    follow_url = f"https://instagram.com/{follow_user.lstrip('@').strip()}"

                if follow_url:
                    follow_btn_title = (payload_data.get("follow_button_text") or "Follow Me")[:20]
                    buttons.append({
                        "type": "web_url",
                        "url": follow_url,
                        "title": follow_btn_title
                    })

                if buttons:
                    element = {
                        "title": card_title,
                        "buttons": buttons
                    }
                    if card_subtitle and card_subtitle != button_url:
                        element["subtitle"] = card_subtitle
                    if image_url:
                        if "localhost" in image_url or "127.0.0.1" in image_url:
                            logger.warning(
                                f"Image URL '{image_url}' is on localhost! Meta's servers cannot reach localhost over the internet. "
                                f"To display images on Instagram, use a public HTTPS URL (e.g. Unsplash, Cloudinary, Imgur, S3) or configure PUBLIC_BASE_URL with ngrok."
                            )
                        else:
                            logger.info(f"Using public image URL for DM attachment: {image_url}")
                        element["image_url"] = image_url

                    message_payload = {
                        "attachment": {
                            "type": "template",
                            "payload": {
                                "template_type": "generic",
                                "elements": [element]
                            }
                        }
                    }
                else:
                    message_payload = {
                        "text": card_title
                    }
            elif dm_type == "image":
                text_val = payload_data.get("text") or payload_data.get("reply_text") or ""
                image_url = self._resolve_public_url(payload_data.get("image_url") or "")
                
                parts = []
                if text_val:
                    parts.append(text_val)
                if image_url:
                    parts.append(f"Image: {image_url}")
                
                message_payload = {
                    "text": "\n\n".join([p for p in parts if p])
                }
            else:
                # Text fallback
                message_payload = {
                    "text": payload_data.get("text") or payload_data.get("reply_text") or ""
                }
        else:
            message_payload = {
                "text": message_text.strip()
            }

        json_body = {
            "recipient": {
                "comment_id": comment_id
            },
            "message": message_payload
        }

        try:
            res = await self._request("POST", "/me/messages", params=params, json=json_body)
            msg_id = res.get("message_id", "")
            logger.info(f"Direct Message successfully sent to commenter of comment {comment_id} (message_id={msg_id})")
            return msg_id
        except Exception as e_req:
            # If the error is due to the 7-day/24-hour window policy (Code 10), retrying will always fail.
            if getattr(e_req, "error_code", None) == 10 or "outside of allowed window" in str(e_req).lower():
                raise e_req

            # If rich template or quick_replies fails due to account permission or Meta Graph policy, fall back to clean text
            if "attachment" in message_payload or "quick_replies" in message_payload:
                logger.warning(f"Rich message private reply failed ({str(e_req)}). Retrying with clean text fallback...")
                button_url = (payload_data.get("link_url") or payload_data.get("button_url")) if is_template and payload_data else None
                text_val = (payload_data.get("message_text") or payload_data.get("text") or payload_data.get("entry_message")) if is_template and payload_data else message_payload.get("text", "")
                if button_url:
                    fallback_text = f"{text_val}\n\n{button_url}" if text_val else button_url
                else:
                    fallback_text = text_val or message_payload.get("text", "")
                json_body["message"] = {"text": fallback_text}
                res = await self._request("POST", "/me/messages", params=params, json=json_body)
                return res.get("message_id", "")
            raise

    async def check_user_follows_business(
        self,
        page_access_token: str,
        user_id: str
    ) -> Optional[bool]:
        """
        Check if the Instagram user (IGSID) is following the business account.
        Uses Graph API GET /{igsid}?fields=is_user_follow_business.
        Returns True/False, or None if the field cannot be determined.
        """
        if not user_id or not str(user_id).strip().isdigit():
            return None
        try:
            res = await self._request(
                "GET",
                f"/{str(user_id).strip()}",
                params={
                    "fields": "is_user_follow_business,username",
                    "access_token": page_access_token
                }
            )
            is_following = res.get("is_user_follow_business")
            logger.info(f"Instagram follow verification for IGSID {user_id}: is_user_follow_business={is_following}")
            return is_following
        except Exception as e:
            logger.warning(f"Could not check follow status for IGSID {user_id}: {e}")
            return None

    async def send_direct_dm(
        self,
        page_access_token: str,
        recipient_id: str,
        message_text: str,
        page_id: Optional[str] = None,
        account_username: Optional[str] = None
    ) -> str:
        """
        Send a direct message to a user by their Instagram Scoped ID (IGSID).
        """
        recipient_id_str = str(recipient_id).strip()
        if not recipient_id_str.isdigit():
            logger.info(
                f"[send_direct_dm] Recipient ID '{recipient_id_str}' is non-numeric (username/handle). "
                f"Attempting to resolve numeric IGSID from conversations..."
            )
            try:
                convs = await self.get_instagram_conversations(
                    page_id=page_id or "me",
                    page_access_token=page_access_token,
                    max_items=30
                )
                resolved_id = None
                clean_target = recipient_id_str.lstrip("@").lower()
                for conv in convs:
                    for p in conv.get("participants", {}).get("data", []):
                        p_uname = str(p.get("username", "")).strip().lower()
                        p_id = str(p.get("id", "")).strip()
                        if p_uname == clean_target and p_id.isdigit():
                            resolved_id = p_id
                            break
                    if resolved_id:
                        break
                if resolved_id:
                    logger.info(f"[send_direct_dm] Successfully resolved '{recipient_id_str}' -> numeric IGSID '{resolved_id}'")
                    recipient_id = resolved_id
                else:
                    logger.warning(f"[send_direct_dm] Could not resolve numeric IGSID for handle '{recipient_id_str}'.")
            except Exception as e_res:
                logger.warning(f"[send_direct_dm] Error while resolving recipient ID: {e_res}")

        endpoint = "/me/messages"
        logger.info(f"Sending direct DM to Instagram User {recipient_id} via {endpoint}")
        params = {
            "access_token": page_access_token
        }

        # Auto-detect if message_text is a JSON template
        import json
        is_template = False
        payload_data = None
        try:
            stripped = message_text.strip()
            if stripped.startswith("{") and stripped.endswith("}"):
                payload_data = json.loads(stripped)
                is_template = True
        except Exception:
            pass

        if is_template and payload_data:
            dm_type = payload_data.get("dm_type", "message_template")
            if dm_type == "follow_gate" or payload_data.get("require_follow"):
                # If follow_intro_text is present, send the introductory text bubble first
                intro_text = payload_data.get("follow_intro_text")
                if not intro_text and payload_data.get("account_username"):
                    intro_text = f"Follow me here ➡️ @{payload_data.get('account_username')}"
                if intro_text:
                    try:
                        intro_body = {
                            "recipient": {"id": str(recipient_id).strip()},
                            "message": {"text": intro_text}
                        }
                        try:
                            await self._request("POST", endpoint, params=params, json=intro_body)
                        except MetaAPIError as e_ep:
                            if endpoint != "/me/messages":
                                await self._request("POST", "/me/messages", params=params, json=intro_body)
                            else:
                                raise e_ep
                    except Exception as e_intro:
                        logger.warning(f"Could not send follow intro text: {e_intro}")

                follow_url = self._resolve_public_url(payload_data.get("follow_url") or payload_data.get("button_url") or "https://instagram.com")
                follow_btn = (payload_data.get("follow_button_text") or "Follow me here")[:20]
                confirm_btn = (payload_data.get("confirm_button_text") or "✅ Send me the DM")[:20]
                card_title = (payload_data.get("title") or "➡️ You need to be following me to unlock this DM")[:80]
                card_subtitle = (payload_data.get("subtitle") or "Once you’re following, click the button below to get the DM!")[:80]

                buttons = [
                    {
                        "type": "web_url",
                        "url": follow_url,
                        "title": follow_btn
                    },
                    {
                        "type": "postback",
                        "title": confirm_btn,
                        "payload": "CONFIRM_FOLLOW_AND_SEND_LINK"
                    }
                ]
                elements = [{
                    "title": card_title,
                    "subtitle": card_subtitle,
                    "buttons": buttons
                }]
                if payload_data.get("image_url"):
                    img_url = self._resolve_public_url(payload_data["image_url"])
                    if "localhost" in img_url or "127.0.0.1" in img_url:
                        logger.warning(
                            f"Image URL '{img_url}' is on localhost! Meta's servers cannot reach localhost over the internet. "
                            f"To display images on Instagram, use a public HTTPS URL (e.g. Unsplash, Cloudinary, Imgur, S3) or configure PUBLIC_BASE_URL with ngrok."
                        )
                    else:
                        logger.info(f"Using public image URL for follow-gate direct DM: {img_url}")
                    elements[0]["image_url"] = img_url

                message_payload = {
                    "attachment": {
                        "type": "template",
                        "payload": {
                            "template_type": "generic",
                            "elements": elements
                        }
                    }
                }
            elif dm_type in ("button_template", "link_dm", "generic"):
                button_url = self._resolve_public_url(payload_data.get("link_url") or payload_data.get("button_url") or "")
                raw_btn_title = (payload_data.get("button_text") or payload_data.get("link_button_text") or "Open Link").strip()
                button_title = raw_btn_title[:20] if raw_btn_title else "Open Link"

                buttons = []
                if button_url:
                    buttons.append({
                        "type": "web_url",
                        "url": button_url,
                        "title": button_title
                    })

                follow_user = account_username or payload_data.get("account_username")
                follow_url = self._resolve_public_url(payload_data.get("follow_url"))
                if not follow_url and follow_user:
                    follow_url = f"https://instagram.com/{follow_user.lstrip('@').strip()}"
                if follow_url and payload_data.get("include_follow_button"):
                    buttons.append({
                        "type": "web_url",
                        "url": follow_url,
                        "title": (payload_data.get("follow_button_text") or "Follow Me")[:20]
                    })

                msg_text = (
                    payload_data.get("message_text") or
                    payload_data.get("text") or
                    payload_data.get("reply_text") or
                    "Here is the link you requested 👇"
                ).strip()

                card_title, card_subtitle = self._format_card_title_and_subtitle(
                    {"text": msg_text, "title": payload_data.get("title")},
                    default_title="Here is the link you requested 👇"
                )

                element = {
                    "title": card_title[:80],
                    "buttons": buttons
                }
                if card_subtitle and card_subtitle != button_url:
                    element["subtitle"] = card_subtitle[:80]
                img_url = self._resolve_public_url(payload_data.get("image_url") or "")
                if img_url:
                    if "localhost" in img_url or "127.0.0.1" in img_url:
                        logger.warning(
                            f"Image URL '{img_url}' is on localhost! Meta's servers cannot reach localhost over the internet. "
                            f"To display images on Instagram, use a public HTTPS URL (e.g. Unsplash, Cloudinary, Imgur, S3) or configure PUBLIC_BASE_URL with ngrok."
                        )
                    else:
                        logger.info(f"Using public image URL for direct DM: {img_url}")
                    element["image_url"] = img_url
                elements = [element]
                
                if buttons:
                    message_payload = {
                        "attachment": {
                            "type": "template",
                            "payload": {
                                "template_type": "generic",
                                "elements": elements
                            }
                        }
                    }
                else:
                    message_payload = {
                        "text": card_title
                    }
            elif dm_type == "image":
                img_url = self._resolve_public_url(payload_data.get("image_url") or "")
                message_payload = {
                    "attachment": {
                        "type": "image",
                        "payload": {
                            "url": img_url
                        }
                    }
                }
            else:
                # Text fallback
                message_payload = {
                    "text": payload_data.get("text") or payload_data.get("reply_text") or ""
                }
        else:
            message_payload = {
                "text": message_text
            }

        json_body = {
            "recipient": {
                "id": str(recipient_id).strip()
            },
            "message": message_payload
        }
        try:
            res = await self._request("POST", endpoint, params=params, json=json_body)
            return res.get("message_id", "")
        except MetaAPIError as e_main:
            # If recipient user does not have a role on the app (Development Mode restriction, subcode 2534048),
            # retrying will never succeed until the user is added as an Instagram Tester in Meta Developer Portal.
            if getattr(e_main, "error_subcode", None) == 2534048 or "does not have role on app" in str(e_main):
                logger.warning(
                    f"[Meta Dev Mode Policy] Direct DM to user {recipient_id} blocked: "
                    f"Recipient user does not have a role on your Meta App. "
                    f"In Development Mode, add this Instagram user under 'App Roles -> Roles -> Instagram Testers' "
                    f"in developers.facebook.com and accept the invite in the Instagram app."
                )
                raise e_main

            # Try with messaging_type: RESPONSE in case required by specific Meta app configuration
            try:
                json_body_resp = dict(json_body)
                json_body_resp["messaging_type"] = "RESPONSE"
                res = await self._request("POST", "/me/messages", params=params, json=json_body_resp)
                return res.get("message_id", "")
            except Exception:
                pass

            # If /me/messages failed, try /{page_id}/messages if page_id is available
            if page_id:
                logger.info(f"Retrying send_direct_dm on /{page_id}/messages fallback...")
                try:
                    res = await self._request("POST", f"/{page_id}/messages", params=params, json=json_body)
                    return res.get("message_id", "")
                except Exception:
                    pass

            # If rich template or image attachment fails, fallback to clean text with URL so delivery succeeds
            if "attachment" in message_payload:
                logger.warning(f"Rich direct DM template failed ({str(e_main)}). Retrying with clean text fallback...")
                if dm_type == "follow_gate" or (is_template and payload_data and payload_data.get("require_follow")):
                    title_fg = (payload_data.get("title") or "➡️ You need to be following me to unlock this DM") if payload_data else "Follow to unlock DM"
                    sub_fg = (payload_data.get("subtitle") or "Once you’re following, click the button below to get the DM!") if payload_data else ""
                    url_fg = (payload_data.get("follow_url") or "https://instagram.com") if payload_data else ""
                    fallback_text = f"{title_fg}\n\n{sub_fg}\n\nFollow: {url_fg}"
                else:
                    button_url = (payload_data.get("link_url") or payload_data.get("button_url")) if is_template and payload_data else None
                    text_val = (payload_data.get("message_text") or payload_data.get("text")) if is_template and payload_data else ""
                    fallback_text = text_val or "Hello!"
                    if button_url:
                        fallback_text = f"{fallback_text}\n\n{button_url}"
                fallback_body = {
                    "recipient": {"id": str(recipient_id).strip()},
                    "message": {"text": fallback_text}
                }
                try:
                    res = await self._request("POST", "/me/messages", params=params, json=fallback_body)
                    return res.get("message_id", "")
                except Exception:
                    pass

            raise e_main


        
    async def get_instagram_posts(self, instagram_business_account_id: str, page_access_token: str, max_items: int = 250) -> List[Dict[str, Any]]:
        """Fetch list of media/posts on the Instagram business account with cursor pagination."""
        logger.info(f"Fetching posts for Instagram Account {instagram_business_account_id}")
        params = {
            "fields": "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,created_time",
            "access_token": page_access_token,
            "limit": min(100, max_items)
        }
        endpoint = f"/{instagram_business_account_id}/media"
        posts_data = []

        while endpoint and len(posts_data) < max_items:
            res = await self._request("GET", endpoint, params=params)
            items = res.get("data", [])
            if not items:
                break
            for item in items:
                item["timestamp"] = item.get("timestamp") or item.get("created_time")
                posts_data.append(item)
                if len(posts_data) >= max_items:
                    break

            paging = res.get("paging", {})
            cursors = paging.get("cursors", {})
            after_cursor = cursors.get("after")
            if after_cursor and paging.get("next"):
                params["after"] = after_cursor
                endpoint = f"/{instagram_business_account_id}/media"
            else:
                break

        return posts_data

    async def get_instagram_conversations(self, page_id: str, page_access_token: str, max_items: int = 15) -> List[Dict[str, Any]]:
        """Fetch active conversations and recent messages for the Instagram Business Account via the Facebook Page."""
        logger.info(f"Fetching conversations for Page {page_id}")
        params = {
            "platform": "instagram",
            "fields": "id,updated_time,participants,messages.limit(5){id,created_time,from,to,message}",
            "access_token": page_access_token,
            "limit": min(10, max_items)
        }
        if page_access_token == "mock_page_token" or str(page_access_token).startswith("mock"):
            return []
        
        target = page_id if page_id else "me"
        try:
            res = await self._request("GET", f"/{target}/conversations", params=params)
            return res.get("data", [])
        except MetaAPIError as e:
            logger.warning(f"Could not fetch Instagram conversations on /{target}/conversations ({e.message}). Retrying with /me/conversations...")
            try:
                res = await self._request("GET", "/me/conversations", params=params)
                return res.get("data", [])
            except Exception as e_fallback:
                logger.warning(f"Fallback to /me/conversations failed: {e_fallback}")
                return []
        except Exception as ex:
            logger.warning(f"Error fetching Instagram conversations: {ex}")
            return []

    async def get_instagram_comments(self, media_id: str, page_access_token: str) -> List[Dict[str, Any]]:
        """Fetch comments for a specific Instagram post/media, including nested replies."""
        logger.info(f"Fetching comments for Instagram Media {media_id}")
        params = {
            "fields": "id,text,username,timestamp,parent_id,from,replies{id,text,username,timestamp,from,parent_id}",
            "access_token": page_access_token
        }
        if page_access_token == "mock_page_token" or str(page_access_token).startswith("mock"):
            return [
                {
                    "id": f"mock_comment_{media_id}_1",
                    "text": "This is a great mockup! Does it support real-time webhooks?",
                    "username": "tester_user",
                    "timestamp": "2026-08-03T15:00:00+0000",
                    "commenter_id": "mock_commenter_id_1"
                },
                {
                    "id": f"mock_comment_{media_id}_2",
                    "text": "Yes, it works perfectly!",
                    "username": "owner_user",
                    "timestamp": "2026-08-03T15:05:00+0000",
                    "parent_id": f"mock_comment_{media_id}_1",
                    "commenter_id": "mock_commenter_id_2"
                }
            ]
        try:
            res = await self._request("GET", f"/{media_id}/comments", params=params)
            comments_data = []
            for comment in res.get("data", []):
                from_data = comment.get("from", {})
                comments_data.append({
                    "id": comment["id"],
                    "text": comment.get("text", ""),
                    "username": comment.get("username") or from_data.get("username", "anonymous"),
                    "timestamp": comment.get("timestamp"),
                    "parent_id": comment.get("parent_id"),
                    "commenter_id": from_data.get("id")
                })
                
                # Fetch and parse nested comment replies
                replies_data = comment.get("replies", {}).get("data", [])
                for reply in replies_data:
                    r_from = reply.get("from", {})
                    comments_data.append({
                        "id": reply["id"],
                        "text": reply.get("text", ""),
                        "username": reply.get("username") or r_from.get("username", "anonymous"),
                        "timestamp": reply.get("timestamp"),
                        "parent_id": comment["id"],
                        "commenter_id": r_from.get("id")
                    })
            return comments_data
        except MetaAPIError as e:
            logger.warning(f"Failed to fetch comments from Meta API: {e.message}")
            return []

    async def delete_comment(self, page_access_token: str, comment_id: str) -> bool:
        """Delete an Instagram comment or reply."""
        logger.info(f"Deleting Instagram comment/reply {comment_id}")
        params = {
            "access_token": page_access_token
        }
        if page_access_token == "mock_page_token" or str(page_access_token).startswith("mock"):
            return True
        res = await self._request("DELETE", f"/{comment_id}", params=params)
        return res.get("success", False)

    async def discover_facebook_pages(self, long_lived_user_token: str) -> List[Dict[str, Any]]:
        """Discover Facebook Pages for the user."""
        logger.info("Discovering Facebook Pages")
        params = {
            "fields": "id,name,access_token,picture{url}",
            "access_token": long_lived_user_token
        }
        if long_lived_user_token == "mock_user_token" or str(long_lived_user_token).startswith("mock"):
            return [
                {
                    "facebook_page_id": "mock_fb_page_1",
                    "name": "Mock Facebook Page",
                    "page_access_token": "mock_page_token",
                    "username": "mockfbpage",
                    "profile_picture_url": "https://placekitten.com/200/200"
                }
            ]
        authorized_page_ids = await self.get_authorized_page_ids(long_lived_user_token)

        res = await self._request("GET", "/me/accounts", params=params)
        pages_data = res.get("data", [])
        
        discovered_pages = []
        for page in pages_data:
            page_id = str(page["id"])
            if authorized_page_ids is not None and page_id not in authorized_page_ids:
                logger.info(f"Skipping Facebook Page {page.get('name')} ({page_id}) - not in user selected pages {authorized_page_ids}")
                continue

            page_token = page.get("access_token")
            # Verify that page token has valid permissions and is not error 190
            try:
                await self._request("GET", f"/{page_id}", params={"fields": "id", "access_token": page_token})
            except Exception as e:
                logger.warning(f"Facebook Page {page.get('name')} ({page_id}) token validation failed ({e}), skipping.")
                continue

            pic_url = page.get("picture", {}).get("data", {}).get("url", "") if page.get("picture") else ""
            discovered_pages.append({
                "facebook_page_id": page_id,
                "name": page["name"],
                "page_access_token": page_token,
                "username": page["name"].lower().replace(" ", ""),
                "profile_picture_url": pic_url
            })
        return discovered_pages

    async def get_facebook_posts(self, page_id: str, page_access_token: str) -> List[Dict[str, Any]]:
        """Fetch list of posts on the Facebook Page."""
        logger.info(f"Fetching posts for Facebook Page {page_id}")
        params = {
            "fields": "id,message,permalink_url,created_time,full_picture,attachments{media_type,type,url,media}",
            "access_token": page_access_token,
            "limit": 100
        }
        if page_access_token == "mock_page_token" or str(page_access_token).startswith("mock"):
            return []
        try:
            res = await self._request("GET", f"/{page_id}/posts", params=params)
            posts_data = []
            for post in res.get("data", []):
                attachments = post.get("attachments", {}).get("data", [])
                media_type = "post"
                media_url = post.get("full_picture", "")
                permalink_url = post.get("permalink_url", "")
                
                if attachments:
                    first_att = attachments[0]
                    is_reel = "reel" in permalink_url.lower() or first_att.get("type") in ["video_inline", "video_autoplay", "video"]
                    if is_reel:
                        media_type = "reel"
                    
                    media_url = first_att.get("media", {}).get("image", {}).get("src", "") or first_att.get("url", "") or media_url

                posts_data.append({
                    "id": post["id"],
                    "caption": post.get("message", ""),
                    "media_type": media_type,
                    "media_url": media_url,
                    "thumbnail_url": media_url,
                    "permalink": permalink_url,
                    "timestamp": post.get("created_time")
                })
            
            # Fetch actual video reels from the page if they exist
            try:
                reels_params = {
                    "fields": "id,description,permalink_url,created_time,video",
                    "access_token": page_access_token
                }
                reels_res = await self._request("GET", f"/{page_id}/video_reels", params=reels_params)
                for reel in reels_res.get("data", []):
                    reel_id = reel["id"]
                    reel_permalink = reel.get("permalink_url", "")
                    is_duplicate = False
                    reel_digits = set(re.findall(r'\d{10,}', f"{reel_id} {reel_permalink}"))
                    for p in posts_data:
                        p_digits = set(re.findall(r'\d{10,}', f"{p['id']} {p.get('permalink', '')}"))
                        if p_digits.intersection(reel_digits):
                            is_duplicate = True
                            break
                    if not is_duplicate:
                        video_info = reel.get("video", {})
                        media_url = video_info.get("source", "") or video_info.get("picture", "")
                        posts_data.append({
                            "id": reel["id"],
                            "caption": reel.get("description", ""),
                            "media_type": "reel",
                            "media_url": media_url,
                            "thumbnail_url": video_info.get("picture", "") or media_url,
                            "permalink": reel_permalink,
                            "timestamp": reel.get("created_time")
                        })
            except Exception as e_reels:
                logger.info(f"Could not fetch live reels for Page {page_id}: {str(e_reels)}")
            
            return posts_data
        except MetaAPIError as e:
            logger.warning(f"Meta API error on GET /{page_id}/posts: {e.message}")
            return []

    async def get_facebook_comments(self, post_id: str, page_access_token: str) -> List[Dict[str, Any]]:
        """Fetch comments for a specific Facebook post, including nested replies."""
        logger.info(f"Fetching comments for Facebook Post {post_id}")
        params = {
            "fields": "id,message,from,created_time,parent,comments{id,message,from,created_time,parent}",
            "access_token": page_access_token
        }
        try:
            res = await self._request("GET", f"/{post_id}/comments", params=params)
            comments_data = []
            for comment in res.get("data", []):
                from_data = comment.get("from", {})
                comments_data.append({
                    "id": comment["id"],
                    "text": comment.get("message", ""),
                    "username": from_data.get("name", from_data.get("username", "anonymous")),
                    "timestamp": comment.get("created_time"),
                    "parent_id": comment.get("parent", {}).get("id") if comment.get("parent") else None,
                    "commenter_id": from_data.get("id")
                })
                
                # Fetch and parse nested comment replies (comments connection on Facebook comments)
                sub_comments = comment.get("comments", {}).get("data", [])
                for sub in sub_comments:
                    sub_from = sub.get("from", {})
                    comments_data.append({
                        "id": sub["id"],
                        "text": sub.get("message", ""),
                        "username": sub_from.get("name", sub_from.get("username", "anonymous")),
                        "timestamp": sub.get("created_time"),
                        "parent_id": comment["id"],
                        "commenter_id": sub_from.get("id")
                    })
            return comments_data
        except MetaAPIError as e:
            logger.warning(f"Failed to fetch Facebook comments from Meta API: {e.message}")
            return []

meta_client = MetaClient()
