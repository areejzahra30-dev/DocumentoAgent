from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr


class UserSyncRequest(BaseModel):
    id: str
    email: str
    name: str | None = None


class UserResponse(BaseModel):
    id: str
    email: str
    name: str | None = None
    avatar_url: str | None = None
    created_at: datetime

    model_config = {"from_attributes": True}


class UserUpdateRequest(BaseModel):
    name: str | None = None
