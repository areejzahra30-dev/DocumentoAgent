from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class FileRegisterRequest(BaseModel):
    filename: str
    file_type: str
    file_size: int
    storage_key: str
    storage_url: str


class FileResponse(BaseModel):
    id: UUID
    project_id: UUID
    filename: str
    file_type: str
    file_size: int
    storage_url: str
    content_text: str | None = None
    created_at: datetime

    model_config = {"from_attributes": True}
