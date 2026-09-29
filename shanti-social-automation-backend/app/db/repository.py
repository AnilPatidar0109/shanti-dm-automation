from typing import Generic, Type, TypeVar, List, Optional, Any, Dict, Sequence
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.base_class import Base
from app.models.user import User
from app.models.instagram import InstagramAccount, Post, Comment, CommentEvent, DMAutomation, DMAutomationExecution, InstagramConversationContext
from app.models.facebook import FacebookAccount, FacebookPost, FacebookComment, FacebookCommentEvent
from app.models.automation import AutomationFlow, FlowNode, FlowEdge
from app.models.log import AutomationLog

ModelType = TypeVar("ModelType", bound=Base)

class BaseRepository(Generic[ModelType]):
    def __init__(self, model: Type[ModelType]):
        self.model = model

    async def get(self, db: AsyncSession, id: Any) -> Optional[ModelType]:
        result = await db.execute(select(self.model).filter(self.model.id == id))
        return result.scalars().first()

    async def get_multi(self, db: AsyncSession, *, skip: int = 0, limit: int = 100) -> Sequence[ModelType]:
        result = await db.execute(select(self.model).offset(skip).limit(limit))
        return result.scalars().all()

    async def create(self, db: AsyncSession, *, obj_in: Dict[str, Any]) -> ModelType:
        db_obj = self.model(**obj_in)
        db.add(db_obj)
        await db.flush()
        return db_obj

    async def update(self, db: AsyncSession, *, db_obj: ModelType, obj_in: Dict[str, Any]) -> ModelType:
        for field, value in obj_in.items():
            # If the property has a setter (e.g. access tokens), it works fine
            setattr(db_obj, field, value)
        db.add(db_obj)
        await db.flush()
        return db_obj

    async def remove(self, db: AsyncSession, *, id: Any) -> Optional[ModelType]:
        obj = await self.get(db, id)
        if obj:
            await db.delete(obj)
            await db.flush()
        return obj


class UserRepository(BaseRepository[User]):
    def __init__(self):
        super().__init__(User)

    async def get_by_email(self, db: AsyncSession, email: str) -> Optional[User]:
        result = await db.execute(select(User).filter(User.email == email))
        return result.scalars().first()


class InstagramAccountRepository(BaseRepository[InstagramAccount]):
    def __init__(self):
        super().__init__(InstagramAccount)

    async def get_by_instagram_id(self, db: AsyncSession, instagram_business_account_id: str) -> Optional[InstagramAccount]:
        result = await db.execute(
            select(InstagramAccount).filter(InstagramAccount.instagram_business_account_id == instagram_business_account_id)
        )
        return result.scalars().first()

    async def get_by_page_id(self, db: AsyncSession, page_id: str) -> Optional[InstagramAccount]:
        result = await db.execute(
            select(InstagramAccount).filter(InstagramAccount.page_id == page_id)
        )
        return result.scalars().first()

    async def get_by_user_id(self, db: AsyncSession, user_id: int) -> Sequence[InstagramAccount]:
        result = await db.execute(
            select(InstagramAccount).filter(InstagramAccount.user_id == user_id)
        )
        return result.scalars().all()


class PostRepository(BaseRepository[Post]):
    def __init__(self):
        super().__init__(Post)

    async def get_by_instagram_account_id(self, db: AsyncSession, instagram_account_id: int) -> Sequence[Post]:
        result = await db.execute(
            select(Post).filter(Post.instagram_account_id == instagram_account_id).order_by(Post.timestamp.desc())
        )
        return result.scalars().all()


class CommentRepository(BaseRepository[Comment]):
    def __init__(self):
        super().__init__(Comment)

    async def get_by_post_id(self, db: AsyncSession, post_id: str) -> Sequence[Comment]:
        result = await db.execute(
            select(Comment).filter(Comment.media_id == post_id)
        )
        return result.scalars().all()


class CommentEventRepository(BaseRepository[CommentEvent]):
    def __init__(self):
        super().__init__(CommentEvent)

    async def get_by_comment_id(self, db: AsyncSession, comment_id: str) -> Optional[CommentEvent]:
        result = await db.execute(
            select(CommentEvent).filter(CommentEvent.comment_id == comment_id)
        )
        return result.scalars().first()


class FacebookAccountRepository(BaseRepository[FacebookAccount]):
    def __init__(self):
        super().__init__(FacebookAccount)

    async def get_by_page_id(self, db: AsyncSession, facebook_page_id: str) -> Optional[FacebookAccount]:
        result = await db.execute(
            select(FacebookAccount).filter(FacebookAccount.facebook_page_id == facebook_page_id)
        )
        return result.scalars().first()

    async def get_by_user_id(self, db: AsyncSession, user_id: int) -> Sequence[FacebookAccount]:
        result = await db.execute(
            select(FacebookAccount).filter(FacebookAccount.user_id == user_id)
        )
        return result.scalars().all()


class FacebookPostRepository(BaseRepository[FacebookPost]):
    def __init__(self):
        super().__init__(FacebookPost)

    async def get_by_facebook_account_id(self, db: AsyncSession, facebook_account_id: int) -> Sequence[FacebookPost]:
        result = await db.execute(
            select(FacebookPost).filter(FacebookPost.facebook_account_id == facebook_account_id).order_by(FacebookPost.timestamp.desc())
        )
        return result.scalars().all()


class FacebookCommentRepository(BaseRepository[FacebookComment]):
    def __init__(self):
        super().__init__(FacebookComment)

    async def get_by_post_id(self, db: AsyncSession, post_id: str) -> Sequence[FacebookComment]:
        result = await db.execute(
            select(FacebookComment).filter(FacebookComment.media_id == post_id)
        )
        return result.scalars().all()


class FacebookCommentEventRepository(BaseRepository[FacebookCommentEvent]):
    def __init__(self):
        super().__init__(FacebookCommentEvent)

    async def get_by_comment_id(self, db: AsyncSession, comment_id: str) -> Optional[FacebookCommentEvent]:
        result = await db.execute(
            select(FacebookCommentEvent).filter(FacebookCommentEvent.comment_id == comment_id)
        )
        return result.scalars().first()


class AutomationFlowRepository(BaseRepository[AutomationFlow]):
    def __init__(self):
        super().__init__(AutomationFlow)

    async def get_active_by_instagram_account_id(self, db: AsyncSession, instagram_account_id: int) -> Sequence[AutomationFlow]:
        result = await db.execute(
            select(AutomationFlow).filter(
                AutomationFlow.instagram_account_id == instagram_account_id,
                AutomationFlow.is_active == True
            )
        )
        return result.scalars().all()

    async def get_active_by_facebook_account_id(self, db: AsyncSession, facebook_account_id: int) -> Sequence[AutomationFlow]:
        result = await db.execute(
            select(AutomationFlow).filter(
                AutomationFlow.facebook_account_id == facebook_account_id,
                AutomationFlow.is_active == True
            )
        )
        return result.scalars().all()

    async def get_unresolved_future_flows(self, db: AsyncSession) -> Sequence[AutomationFlow]:
        """Return all active future flows that are still pending resolution or apply to all future posts."""
        from sqlalchemy import or_, and_
        result = await db.execute(
            select(AutomationFlow).filter(
                AutomationFlow.is_future_flow == True,
                AutomationFlow.is_active == True,
                or_(
                    and_(
                        AutomationFlow.future_flow_status == "pending",
                        AutomationFlow.instagram_post_id == None,
                        AutomationFlow.facebook_post_id == None,
                    ),
                    AutomationFlow.apply_to_all_future_posts == True,
                )
            )
        )
        return result.scalars().all()



class AutomationLogRepository(BaseRepository[AutomationLog]):
    def __init__(self):
        super().__init__(AutomationLog)

    async def get_by_flow_id(self, db: AsyncSession, flow_id: str) -> Sequence[AutomationLog]:
        result = await db.execute(
            select(AutomationLog).filter(AutomationLog.flow_id == flow_id).order_by(AutomationLog.created_at.desc())
        )
        return result.scalars().all()


# Instantiate repositories for easy import
user_repo = UserRepository()
instagram_account_repo = InstagramAccountRepository()
facebook_account_repo = FacebookAccountRepository()
post_repo = PostRepository()
facebook_post_repo = FacebookPostRepository()
comment_repo = CommentRepository()
facebook_comment_repo = FacebookCommentRepository()
comment_event_repo = CommentEventRepository()
facebook_comment_event_repo = FacebookCommentEventRepository()
automation_flow_repo = AutomationFlowRepository()
automation_log_repo = AutomationLogRepository()
flow_node_repo = BaseRepository[FlowNode](FlowNode)
flow_edge_repo = BaseRepository[FlowEdge](FlowEdge)


class DMAutomationRepository(BaseRepository[DMAutomation]):
    def __init__(self):
        super().__init__(DMAutomation)

    async def get_active_by_instagram_account_id(self, db: AsyncSession, instagram_account_id: int) -> Sequence[DMAutomation]:
        result = await db.execute(
            select(DMAutomation).filter(
                DMAutomation.instagram_account_id == instagram_account_id,
                DMAutomation.is_active == True
            )
        )
        return result.scalars().all()





class DMAutomationExecutionRepository(BaseRepository[DMAutomationExecution]):
    def __init__(self):
        super().__init__(DMAutomationExecution)

    async def get_by_automation_id(self, db: AsyncSession, automation_id: str) -> Sequence[DMAutomationExecution]:
        result = await db.execute(
            select(DMAutomationExecution).filter(DMAutomationExecution.automation_id == automation_id)
        )
        return result.scalars().all()

    async def get_by_message_id(self, db: AsyncSession, message_id: str) -> Optional[DMAutomationExecution]:
        result = await db.execute(
            select(DMAutomationExecution).filter(DMAutomationExecution.message_id == message_id)
        )
        return result.scalars().first()


dm_automation_repo = DMAutomationRepository()
dm_automation_execution_repo = DMAutomationExecutionRepository()


class InstagramConversationContextRepository(BaseRepository[InstagramConversationContext]):
    def __init__(self):
        super().__init__(InstagramConversationContext)

    async def get_by_comment_id(self, db: AsyncSession, comment_id: str) -> Optional[InstagramConversationContext]:
        result = await db.execute(
            select(InstagramConversationContext).filter(InstagramConversationContext.comment_id == comment_id)
        )
        return result.scalars().first()

    async def get_pending_entry(
        self,
        db: AsyncSession,
        instagram_account_id: int,
        commenter_id: Optional[str] = None,
        commenter_username: Optional[str] = None
    ) -> Optional[InstagramConversationContext]:
        """
        Find most recent conversation context waiting for user entry interaction.
        Checks commenter_id first, then commenter_username.
        """
        query = select(InstagramConversationContext).filter(
            InstagramConversationContext.instagram_account_id == instagram_account_id,
            InstagramConversationContext.status.in_(["entry_sent", "link_delivered"])
        )
        if commenter_id and commenter_username:
            from sqlalchemy import or_
            query = query.filter(
                or_(
                    InstagramConversationContext.commenter_id == str(commenter_id).strip(),
                    InstagramConversationContext.commenter_username.ilike(commenter_username.strip())
                )
            )
        elif commenter_id:
            query = query.filter(InstagramConversationContext.commenter_id == str(commenter_id).strip())
        elif commenter_username:
            query = query.filter(InstagramConversationContext.commenter_username.ilike(commenter_username.strip()))

        query = query.order_by(InstagramConversationContext.created_at.desc())
        result = await db.execute(query)
        return result.scalars().first()


conversation_context_repo = InstagramConversationContextRepository()

