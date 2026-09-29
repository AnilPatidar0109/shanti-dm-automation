"""add connected_at to instagram_accounts

Revision ID: 16d770f8e2c5
Revises: 2cd841529587
Create Date: 2026-09-21 14:49:18.362828

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '16d770f8e2c5'
down_revision: Union[str, Sequence[str], None] = '2cd841529587'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('facebook_accounts', sa.Column('connected_at', sa.DateTime(), nullable=True))
    op.add_column('instagram_accounts', sa.Column('connected_at', sa.DateTime(), nullable=True))
    op.alter_column('instagram_accounts', 'page_id',
               existing_type=sa.VARCHAR(),
               nullable=False)
    op.alter_column('instagram_accounts', 'page_access_token',
               existing_type=sa.VARCHAR(),
               nullable=False)
    op.drop_column('instagram_accounts', 'connection_type')
    op.drop_column('instagram_accounts', 'ig_user_access_token')


def downgrade() -> None:
    """Downgrade schema."""
    op.add_column('instagram_accounts', sa.Column('ig_user_access_token', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.add_column('instagram_accounts', sa.Column('connection_type', sa.VARCHAR(), server_default=sa.text("'facebook'::character varying"), autoincrement=False, nullable=False))
    op.alter_column('instagram_accounts', 'page_access_token',
               existing_type=sa.VARCHAR(),
               nullable=True)
    op.alter_column('instagram_accounts', 'page_id',
               existing_type=sa.VARCHAR(),
               nullable=True)
    op.drop_column('instagram_accounts', 'connected_at')
    op.drop_column('facebook_accounts', 'connected_at')
