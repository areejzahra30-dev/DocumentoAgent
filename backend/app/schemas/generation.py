from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class GenerationCreateRequest(BaseModel):
    type: str


class GenerationResponse(BaseModel):
    id: UUID
    project_id: UUID
    type: str
    status: str
    output_content: str | None = None
    error_message: str | None = None
    created_at: datetime
    completed_at: datetime | None = None

    model_config = {"from_attributes": True}


class GenerationListItem(BaseModel):
    id: UUID
    project_id: UUID
    project_name: str = ""
    type: str
    status: str
    created_at: datetime
    completed_at: datetime | None = None

    model_config = {"from_attributes": True}
