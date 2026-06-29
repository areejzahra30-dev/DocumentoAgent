from uuid import UUID

from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.middleware.auth import verify_better_auth_token
from app.schemas.project import ProjectCreateRequest, ProjectUpdateRequest, ProjectResponse
from app.services import project_service

router = APIRouter(dependencies=[Depends(verify_better_auth_token)])


@router.get("", response_model=list[ProjectResponse])
async def list_projects(
    request: Request,
    limit: int = Query(default=20, le=100),
    offset: int = Query(default=0, ge=0),
    db: AsyncSession = Depends(get_db),
):
    return await project_service.list_projects(db, request.state.user_id, limit, offset)


@router.post("", response_model=ProjectResponse, status_code=201)
async def create_project(
    body: ProjectCreateRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    return await project_service.create_project(db, request.state.user_id, body)


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: UUID,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    return await project_service.get_project(db, project_id, request.state.user_id)


@router.patch("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: UUID,
    body: ProjectUpdateRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    return await project_service.update_project(db, project_id, request.state.user_id, body)


@router.delete("/{project_id}", status_code=204)
async def delete_project(
    project_id: UUID,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    await project_service.delete_project(db, project_id, request.state.user_id)
