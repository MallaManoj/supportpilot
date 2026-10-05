"""add conversation updated timestamp

Revision ID: e224cd427f6d
Revises: 1bf1a25717c8
Create Date: 2026-10-05 23:06:42.048403

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e224cd427f6d'
down_revision: Union[str, Sequence[str], None] = '1bf1a25717c8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "conversations",
        sa.Column(
            "updated_at",
            sa.DateTime(),
            nullable=True,
        ),
    )


def downgrade() -> None:
    op.drop_column(
        "conversations",
        "updated_at",
    )
