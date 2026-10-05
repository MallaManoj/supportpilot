"""add vector embeddings

Revision ID: 30e0ebda9916
Revises: 900ff7c2f7b5
Create Date: 2026-10-06 00:12:40.989586

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '30e0ebda9916'
down_revision: Union[str, Sequence[str], None] = '900ff7c2f7b5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("ALTER TABLE document_chunks ALTER COLUMN embedding TYPE VECTOR(1536) USING embedding::vector")


def downgrade() -> None:
    op.execute("ALTER TABLE document_chunks ALTER COLUMN embedding TYPE TEXT USING embedding::text")
