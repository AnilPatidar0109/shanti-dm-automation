from typing import Any, Dict
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func, select

from app.api import deps
from app.db.repository import instagram_account_repo
from app.schemas.log import AnalyticsResponse
from app.models.instagram import CommentEvent, Post
from app.models.automation import AutomationFlow
from app.models.log import AutomationLog
from app.models.user import User

router = APIRouter()


from typing import Any, Dict
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func, select, or_

from app.api import deps
from app.db.repository import instagram_account_repo, facebook_account_repo
from app.schemas.log import AnalyticsResponse
from app.models.instagram import CommentEvent, Post
from app.models.facebook import FacebookCommentEvent, FacebookPost
from app.models.automation import AutomationFlow
from app.models.log import AutomationLog
from app.models.user import User

router = APIRouter()


@router.get("", response_model=AnalyticsResponse)
async def get_analytics(
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    """
    Get aggregated analytics metrics for the current user's connected Instagram and Facebook accounts.
    """
    insta_accounts = await instagram_account_repo.get_by_user_id(db, user_id=current_user.id)
    insta_ids = [acc.id for acc in insta_accounts]
    
    fb_accounts = await facebook_account_repo.get_by_user_id(db, user_id=current_user.id)
    fb_ids = [acc.id for acc in fb_accounts]
    
    if not insta_ids and not fb_ids:
        return {
            "total_comments": 0,
            "replies_sent": 0,
            "dms_sent": 0,
            "keyword_counts": {},
            "failed_replies": 0,
            "avg_response_time_seconds": 0.0
        }

    # 1. Total Comments Received (Instagram + Facebook)
    total_comments = 0
    
    if insta_ids:
        comments_query = select(func.count(CommentEvent.id)).join(
            Post, CommentEvent.media_id == Post.id
        ).where(Post.instagram_account_id.in_(insta_ids))
        res_comments = await db.execute(comments_query)
        total_comments += res_comments.scalar_one_or_none() or 0

    if fb_ids:
        fb_comments_query = select(func.count(FacebookCommentEvent.id)).join(
            FacebookPost, FacebookCommentEvent.media_id == FacebookPost.id
        ).where(FacebookPost.facebook_account_id.in_(fb_ids))
        res_fb_comments = await db.execute(fb_comments_query)
        total_comments += res_fb_comments.scalar_one_or_none() or 0

    # Flow Filter helper
    flow_filter = or_(
        AutomationFlow.instagram_account_id.in_(insta_ids) if insta_ids else False,
        AutomationFlow.facebook_account_id.in_(fb_ids) if fb_ids else False
    )

    # 2. Replies Sent successfully
    replies_query = select(func.count(AutomationLog.id)).join(
        AutomationFlow, AutomationLog.flow_id == AutomationFlow.id
    ).where(
        flow_filter,
        AutomationLog.action_type == "reply_sent",
        AutomationLog.status == "success"
    )
    res_replies = await db.execute(replies_query)
    replies_sent = res_replies.scalar_one_or_none() or 0

    # 3. DMs Sent successfully
    dms_query = select(func.count(AutomationLog.id)).join(
        AutomationFlow, AutomationLog.flow_id == AutomationFlow.id
    ).where(
        flow_filter,
        AutomationLog.action_type == "dm_sent",
        AutomationLog.status == "success"
    )
    res_dms = await db.execute(dms_query)
    dms_sent = res_dms.scalar_one_or_none() or 0

    # 4. Failed Actions (both replies and DMs)
    failed_query = select(func.count(AutomationLog.id)).join(
        AutomationFlow, AutomationLog.flow_id == AutomationFlow.id
    ).where(
        flow_filter,
        AutomationLog.action_type.in_(["reply_sent", "dm_sent"]),
        AutomationLog.status == "failed"
    )
    res_failed = await db.execute(failed_query)
    failed_replies = res_failed.scalar_one_or_none() or 0

    # 5. Keyword trigger counts
    from app.utils.text import contains_keyword
    
    # Initialize keyword_counts with tracking keywords ("price", "link", "info")
    # so keywords like "info" with 0 matches can be properly displayed with count 0.
    keyword_counts: Dict[str, int] = {
        "price": 0,
        "link": 0,
        "info": 0
    }

    # Fetch active flows to include any other configured trigger keywords
    active_flows_query = select(AutomationFlow).where(
        flow_filter,
        AutomationFlow.is_active == True
    )
    res_flows = await db.execute(active_flows_query)
    for flow in res_flows.scalars().all():
        for node in (flow.nodes or []):
            cfg = node.get("config", {}) if isinstance(node, dict) else getattr(node, "config", {}) or {}
            for kw in cfg.get("keywords", []):
                if kw and kw not in keyword_counts:
                    keyword_counts[kw] = 0

    kw_query = select(AutomationLog.details).join(
        AutomationFlow, AutomationLog.flow_id == AutomationFlow.id
    ).where(
        flow_filter,
        AutomationLog.action_type == "trigger_match"
    )
    res_kw = await db.execute(kw_query)
    details_list = res_kw.scalars().all()

    seen_comment_keywords = set()
    for details in details_list:
        if isinstance(details, dict):
            matched = details.get("matched_keywords", [])
            comment_text = details.get("comment_text")
            comment_id = details.get("comment_id")

            if comment_text:
                actual_kws = [
                    kw for kw in matched
                    if contains_keyword(comment_text, kw, exact_word=False)
                ]
                if not actual_kws:
                    actual_kws = [
                        kw for kw in keyword_counts.keys()
                        if contains_keyword(comment_text, kw, exact_word=False)
                    ]
                chosen = actual_kws if actual_kws else matched
            else:
                chosen = matched

            for kw in chosen:
                if comment_id:
                    dedup_key = (str(comment_id), str(kw).lower())
                    if dedup_key in seen_comment_keywords:
                        continue
                    seen_comment_keywords.add(dedup_key)
                keyword_counts[kw] = keyword_counts.get(kw, 0) + 1

    # Check comment events for any matches that were processed directly or unlogged
    if insta_ids:
        comm_query = select(CommentEvent.id, CommentEvent.text).join(
            Post, CommentEvent.media_id == Post.id
        ).where(
            Post.instagram_account_id.in_(insta_ids)
        )
        comm_res = await db.execute(comm_query)
        for c_id, c_text in comm_res.all():
            if c_text:
                for kw in list(keyword_counts.keys()):
                    if contains_keyword(c_text, kw, exact_word=False):
                        dedup_key = (str(c_id), str(kw).lower())
                        if dedup_key not in seen_comment_keywords:
                            seen_comment_keywords.add(dedup_key)
                            keyword_counts[kw] = keyword_counts.get(kw, 0) + 1

    # 6. Average Response Time (Instagram + Facebook)
    total_seconds = 0.0
    total_records = 0

    if insta_ids:
        time_query = select(CommentEvent.timestamp, CommentEvent.processed_at).join(
            Post, CommentEvent.media_id == Post.id
        ).where(
            Post.instagram_account_id.in_(insta_ids),
            CommentEvent.status == "processed",
            CommentEvent.processed_at.isnot(None)
        )
        res_times = await db.execute(time_query)
        time_records = res_times.all()
        for rec in time_records:
            dt_diff = rec.processed_at - rec.timestamp
            total_seconds += dt_diff.total_seconds()
            total_records += 1

    if fb_ids:
        fb_time_query = select(FacebookCommentEvent.timestamp, FacebookCommentEvent.processed_at).join(
            FacebookPost, FacebookCommentEvent.media_id == FacebookPost.id
        ).where(
            FacebookPost.facebook_account_id.in_(fb_ids),
            FacebookCommentEvent.status == "processed",
            FacebookCommentEvent.processed_at.isnot(None)
        )
        res_fb_times = await db.execute(fb_time_query)
        fb_time_records = res_fb_times.all()
        for rec in fb_time_records:
            dt_diff = rec.processed_at - rec.timestamp
            total_seconds += dt_diff.total_seconds()
            total_records += 1
            
    avg_response_time = 0.0
    if total_records > 0:
        avg_response_time = total_seconds / total_records

    return {
        "total_comments": total_comments,
        "replies_sent": replies_sent,
        "dms_sent": dms_sent,
        "keyword_counts": keyword_counts,
        "failed_replies": failed_replies,
        "avg_response_time_seconds": round(avg_response_time, 2)
    }
