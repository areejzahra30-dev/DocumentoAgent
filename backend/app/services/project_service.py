from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.project import Project
from app.models.file import File
from app.models.generation import Generation
from app.schemas.project import ProjectCreateRequest, ProjectUpdateRequest, ProjectResponse


async def list_projects(
    db: AsyncSession, user_id: str, limit: int = 20, offset: int = 0
) -> list[ProjectResponse]:
    result = await db.execute(
        select(Project)
        .where(Project.user_id == user_id)
        .order_by(Project.updated_at.desc())
        .offset(offset)
        .limit(limit)
    )
    projects = result.scalars().all()

    responses = []
    for p in projects:
        file_count = await db.scalar(
            select(func.count()).select_from(File).where(File.project_id == p.id)
        )
        gen_count = await db.scalar(
            select(func.count()).select_from(Generation).where(Generation.project_id == p.id)
        )
        resp = ProjectResponse.model_validate(p)
        resp.file_count = file_count or 0
        resp.generation_count = gen_count or 0
        responses.append(resp)

    return responses


async def create_project(
    db: AsyncSession, user_id: str, body: ProjectCreateRequest
) -> ProjectResponse:
    project = Project(
        user_id=user_id,
        name=body.name,
        description=body.description,
    )
    db.add(project)
    await db.commit()
    await db.refresh(project)
    return ProjectResponse.model_validate(project)


async def get_project(
    db: AsyncSession, project_id, user_id: str
) -> ProjectResponse:
    result = await db.execute(
        select(Project).where(Project.id == project_id, Project.user_id == user_id)
    )
    project = result.scalar_one_or_none()
    if not project:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Project not found")

    file_count = await db.scalar(
        select(func.count()).select_from(File).where(File.project_id == project.id)
    )
    gen_count = await db.scalar(
        select(func.count()).select_from(Generation).where(Generation.project_id == project.id)
    )
    resp = ProjectResponse.model_validate(project)
    resp.file_count = file_count or 0
    resp.generation_count = gen_count or 0
    return resp


async def update_project(
    db: AsyncSession, project_id, user_id: str, body: ProjectUpdateRequest
) -> ProjectResponse:
    result = await db.execute(
        select(Project).where(Project.id == project_id, Project.user_id == user_id)
    )
    project = result.scalar_one_or_none()
    if not project:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Project not found")

    if body.name is not None:
        project.name = body.name
    if body.description is not None:
        project.description = body.description

    await db.commit()
    await db.refresh(project)
    return ProjectResponse.model_validate(project)


async def delete_project(db: AsyncSession, project_id, user_id: str):
    result = await db.execute(
        select(Project).where(Project.id == project_id, Project.user_id == user_id)
    )
    project = result.scalar_one_or_none()
    if not project:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Project not found")

    await db.delete(project)
    await db.commit()
