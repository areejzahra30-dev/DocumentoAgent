from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class ProjectCreateRequest(BaseModel):
    name: str
    description: str | None = None


class ProjectUpdateRequest(BaseModel):
    name: str | None = None
    description: str | None = None


class ProjectResponse(BaseModel):
    id: UUID
    user_id: str
    name: str
    description: str | None = None
    created_at: datetime
    updated_at: datetime
    file_count: int = 0
    generation_count: int = 0

    model_config = {"from_attributes": True}
