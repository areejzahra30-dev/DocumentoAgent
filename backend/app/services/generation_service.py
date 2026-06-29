from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from fastapi.responses import PlainTextResponse

from app.models.generation import Generation
from app.models.project import Project
from app.schemas.generation import (
    GenerationCreateRequest,
    GenerationResponse,
    GenerationListItem,
)
from app.ai.pipeline import run_pipeline


async def create_and_run(
    db: AsyncSession, project_id, user_id: str, body: GenerationCreateRequest
) -> GenerationResponse:
    project_result = await db.execute(
        select(Project).where(Project.id == project_id, Project.user_id == user_id)
    )
    project = project_result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    generation = Generation(
        project_id=project_id,
        user_id=user_id,
        type=body.type,
        status="processing",
    )
    db.add(generation)
    await db.commit()
    await db.refresh(generation)

    try:
        output = await run_pipeline(db, project_id, body.type)
        generation.status = "completed"
        generation.output_content = output
        generation.completed_at = datetime.now(timezone.utc)
    except Exception as e:
        generation.status = "failed"
        generation.error_message = str(e)
        generation.completed_at = datetime.now(timezone.utc)

    await db.commit()
    await db.refresh(generation)
    return GenerationResponse.model_validate(generation)


async def list_generations(
    db: AsyncSession, user_id: str, limit: int = 20, offset: int = 0
) -> list[GenerationListItem]:
    result = await db.execute(
        select(Generation)
        .where(Generation.user_id == user_id)
        .order_by(Generation.created_at.desc())
        .offset(offset)
        .limit(limit)
    )
    generations = result.scalars().all()

    items = []
    for g in generations:
        item = GenerationListItem.model_validate(g)
        project_result = await db.execute(
            select(Project.name).where(Project.id == g.project_id)
        )
        proj_name = project_result.scalar_one_or_none()
        item.project_name = proj_name or "Unknown"
        items.append(item)

    return items


async def get_generation(
    db: AsyncSession, generation_id, user_id: str
) -> GenerationResponse:
    result = await db.execute(
        select(Generation).where(
            Generation.id == generation_id,
            Generation.user_id == user_id,
        )
    )
    generation = result.scalar_one_or_none()
    if not generation:
        raise HTTPException(status_code=404, detail="Generation not found")
    return GenerationResponse.model_validate(generation)


async def download_generation(
    db: AsyncSession, generation_id, user_id: str, format: str = "md"
):
    result = await db.execute(
        select(Generation).where(
            Generation.id == generation_id,
            Generation.user_id == user_id,
        )
    )
    generation = result.scalar_one_or_none()
    if not generation or not generation.output_content:
        raise HTTPException(status_code=404, detail="Generation not found")

    content = generation.output_content
    if format == "txt":
        import re
        content = re.sub(r"[#*`\[\]()>|~-]", "", content)
        content = re.sub(r"\n{3,}", "\n\n", content).strip()
        return PlainTextResponse(content, media_type="text/plain")

    if format == "pdf":
        raise HTTPException(status_code=501, detail="PDF export not yet implemented")

    return PlainTextResponse(
        content,
        media_type="text/markdown",
        headers={"Content-Disposition": f'attachment; filename="readme-{generation_id}.md"'},
    )


async def delete_generation(
    db: AsyncSession, generation_id, user_id: str
):
    result = await db.execute(
        select(Generation).where(
            Generation.id == generation_id,
            Generation.user_id == user_id,
        )
    )
    generation = result.scalar_one_or_none()
    if not generation:
        raise HTTPException(status_code=404, detail="Generation not found")

    await db.delete(generation)
    await db.commit()
