import os

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.file import File
from app.schemas.file import FileRegisterRequest, FileResponse

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads")


async def register_file(
    db: AsyncSession, project_id, user_id: str, body: FileRegisterRequest
) -> FileResponse:
    file = File(
        project_id=project_id,
        user_id=user_id,
        filename=body.filename,
        file_type=body.file_type,
        file_size=body.file_size,
        storage_key=body.storage_key,
        storage_url=body.storage_url,
    )
    db.add(file)
    await db.commit()
    await db.refresh(file)
    return FileResponse.model_validate(file)


async def list_files(
    db: AsyncSession, project_id, user_id: str
) -> list[FileResponse]:
    result = await db.execute(
        select(File).where(
            File.project_id == project_id,
            File.user_id == user_id,
        )
    )
    files = result.scalars().all()
    return [FileResponse.model_validate(f) for f in files]


async def delete_file(
    db: AsyncSession, project_id, file_id, user_id: str
):
    result = await db.execute(
        select(File).where(
            File.id == file_id,
            File.project_id == project_id,
            File.user_id == user_id,
        )
    )
    file = result.scalar_one_or_none()
    if not file:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="File not found")

    file_path = os.path.join(UPLOAD_DIR, file.storage_key)
    if os.path.exists(file_path):
        os.remove(file_path)

    await db.delete(file)
    await db.commit()
