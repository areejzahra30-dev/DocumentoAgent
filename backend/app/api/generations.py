from uuid import UUID

from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.middleware.auth import verify_better_auth_token
from app.schemas.generation import GenerationCreateRequest, GenerationResponse, GenerationListItem
from app.services import generation_service

router = APIRouter(dependencies=[Depends(verify_better_auth_token)])


@router.post("/projects/{project_id}/generations", response_model=GenerationResponse, status_code=201)
async def create_generation(
    project_id: UUID,
    body: GenerationCreateRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    return await generation_service.create_and_run(
        db, project_id, request.state.user_id, body
    )


@router.get("/generations", response_model=list[GenerationListItem])
async def list_generations(
    request: Request,
    limit: int = Query(default=20, le=100),
    offset: int = Query(default=0, ge=0),
    db: AsyncSession = Depends(get_db),
):
    return await generation_service.list_generations(
        db, request.state.user_id, limit, offset
    )


@router.get("/generations/{generation_id}", response_model=GenerationResponse)
async def get_generation(
    generation_id: UUID,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    return await generation_service.get_generation(
        db, generation_id, request.state.user_id
    )


@router.get("/generations/{generation_id}/download")
async def download_generation(
    generation_id: UUID,
    request: Request,
    format: str = Query(default="md"),
    db: AsyncSession = Depends(get_db),
):
    return await generation_service.download_generation(
        db, generation_id, request.state.user_id, format
    )


@router.delete("/generations/{generation_id}", status_code=204)
async def delete_generation(
    generation_id: UUID,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    await generation_service.delete_generation(
        db, generation_id, request.state.user_id
    )
