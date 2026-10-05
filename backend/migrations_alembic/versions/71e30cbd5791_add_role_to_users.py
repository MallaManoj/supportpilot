"""add role to users

Revision ID: 71e30cbd5791
Revises: 5d0aa9891c79
Create Date: 2026-10-06 00:18:28.731467

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '71e30cbd5791'
down_revision: Union[str, Sequence[str], None] = '5d0aa9891c79'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("users", sa.Column("role", sa.String(20), server_default="customer", nullable=False))


def downgrade() -> None:
    op.drop_column("users", "role")
