from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.models.project import Project
from app.models.file import File
from app.models.generation import Generation
from app.schemas.user import UserSyncRequest, UserUpdateRequest, UserResponse


async def sync_user(db: AsyncSession, body: UserSyncRequest) -> User:
    result = await db.execute(select(User).where(User.email == body.email))
    user = result.scalar_one_or_none()

    if user:
        user.name = body.name or user.name
    else:
        user = User(
            id=body.id,
            email=body.email,
            name=body.name,
        )
        db.add(user)

    await db.commit()
    await db.refresh(user)
    return user


async def get_user(db: AsyncSession, user_id: str) -> UserResponse:
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse.model_validate(user)


async def update_user(
    db: AsyncSession, user_id: str, body: UserUpdateRequest
) -> UserResponse:
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="User not found")

    if body.name is not None:
        user.name = body.name

    await db.commit()
    await db.refresh(user)
    return UserResponse.model_validate(user)


async def soft_delete_user(db: AsyncSession, user_id: str):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="User not found")

    user.deleted_at = datetime.now(timezone.utc)
    user.email = f"deleted-{user.id}@anonymous.local"
    user.name = "Deleted User"
    await db.commit()


async def export_user_data(db: AsyncSession, user_id: str) -> dict:
    user_result = await db.execute(select(User).where(User.id == user_id))
    user = user_result.scalar_one_or_none()
    if not user:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="User not found")

    projects_result = await db.execute(
        select(Project).where(Project.user_id == user_id)
    )
    projects = projects_result.scalars().all()

    generations_result = await db.execute(
        select(Generation).where(Generation.user_id == user_id)
    )
    generations = generations_result.scalars().all()

    return {
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "created_at": user.created_at.isoformat(),
        },
        "projects": [
            {
                "id": str(p.id),
                "name": p.name,
                "description": p.description,
                "created_at": p.created_at.isoformat(),
            }
            for p in projects
        ],
        "generations": [
            {
                "id": str(g.id),
                "project_id": str(g.project_id),
                "type": g.type,
                "status": g.status,
                "created_at": g.created_at.isoformat(),
            }
            for g in generations
        ],
    }
