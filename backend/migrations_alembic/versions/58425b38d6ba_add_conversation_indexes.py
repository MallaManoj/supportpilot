"""add conversation indexes

Revision ID: 58425b38d6ba
Revises: e224cd427f6d
Create Date: 2026-10-05 23:41:46.364155

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '58425b38d6ba'
down_revision: Union[str, Sequence[str], None] = 'e224cd427f6d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_index(
        "ix_conversations_user_id",
        "conversations",
        ["user_id"],
    )
    op.create_index(
        "ix_messages_conversation_id",
        "messages",
        ["conversation_id"],
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(
        "ix_messages_conversation_id",
        table_name="messages",
    )
    op.drop_index(
        "ix_conversations_user_id",
        table_name="conversations",
    )
