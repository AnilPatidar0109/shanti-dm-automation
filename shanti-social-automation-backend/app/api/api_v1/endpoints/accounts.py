from typing import Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.db.repository import instagram_account_repo, facebook_account_repo
from app.schemas.instagram import InstagramAccount as InstagramAccountSchema
from app.schemas.facebook import FacebookAccount as FacebookAccountSchema
from app.models.user import User

router = APIRouter()


@router.get("", response_model=List[InstagramAccountSchema])
async def read_accounts(
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
    skip: int = 0,
    limit: int = 100
) -> Any:
    """Retrieve connected Instagram Accounts for the logged-in user."""
    accounts = await instagram_account_repo.get_by_user_id(db, user_id=current_user.id)
    # Apply skip/limit
    return accounts[skip : skip + limit]


@router.get("/facebook", response_model=List[FacebookAccountSchema])
async def read_facebook_accounts(
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
    skip: int = 0,
    limit: int = 100
) -> Any:
    """Retrieve connected Facebook Accounts/Pages for the logged-in user."""
    accounts = await facebook_account_repo.get_by_user_id(db, user_id=current_user.id)
    return accounts[skip : skip + limit]


@router.delete("/instagram/{account_id}")
async def delete_instagram_account(
    account_id: int,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """Disconnect/delete a connected Instagram account."""
    from fastapi import HTTPException
    from sqlalchemy import delete, select
    from app.models.instagram import Post, CommentEvent, DMAutomation, DMAutomationExecution
    from app.models.automation import AutomationFlow
    from app.models.log import AutomationLog

    account = await instagram_account_repo.get(db, account_id)
    if not account or account.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Instagram account not found")

    # 1. Clean up associated comment events and automation logs
    post_ids_res = await db.execute(select(Post.id).where(Post.instagram_account_id == account_id))
    post_ids = [r[0] for r in post_ids_res.fetchall()]
    if post_ids:
        await db.execute(delete(CommentEvent).where(CommentEvent.media_id.in_(post_ids)))
        await db.execute(delete(AutomationLog).where(AutomationLog.flow_id.in_(
            select(AutomationFlow.id).where(AutomationFlow.instagram_account_id == account_id)
        )))

    # 2. Clean up flows, DM rules, messages, and executions
    await db.execute(delete(AutomationFlow).where(AutomationFlow.instagram_account_id == account_id))
    await db.execute(delete(DMAutomation).where(DMAutomation.instagram_account_id == account_id))


    # 3. Remove account itself
    await instagram_account_repo.remove(db, id=account_id)
    await db.commit()
    return {"status": "success", "message": "Instagram account disconnected"}


@router.delete("/facebook/{account_id}")
async def delete_facebook_account(
    account_id: int,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """Disconnect/delete a connected Facebook Page account."""
    from fastapi import HTTPException
    from sqlalchemy import delete, select
    from app.models.facebook import FacebookPost, FacebookCommentEvent
    from app.models.automation import AutomationFlow
    from app.models.log import AutomationLog

    account = await facebook_account_repo.get(db, account_id)
    if not account or account.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Facebook account not found")

    # Clean up associated comments and logs
    post_ids_res = await db.execute(select(FacebookPost.id).where(FacebookPost.facebook_account_id == account_id))
    post_ids = [r[0] for r in post_ids_res.fetchall()]
    if post_ids:
        await db.execute(delete(FacebookCommentEvent).where(FacebookCommentEvent.media_id.in_(post_ids)))
        await db.execute(delete(AutomationLog).where(AutomationLog.flow_id.in_(
            select(AutomationFlow.id).where(AutomationFlow.facebook_account_id == account_id)
        )))

    await db.execute(delete(AutomationFlow).where(AutomationFlow.facebook_account_id == account_id))
    await facebook_account_repo.remove(db, id=account_id)
    await db.commit()
    return {"status": "success", "message": "Facebook account disconnected"}

