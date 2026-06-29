from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.middleware.auth import verify_better_auth_token
from app.schemas.user import UserSyncRequest, UserResponse, UserUpdateRequest
from app.services import user_service

router = APIRouter()


@router.post("/sync", status_code=201)
async def sync_user(
    body: UserSyncRequest,
    db: AsyncSession = Depends(get_db),
):
    user = await user_service.sync_user(db, body)
    return {"id": str(user.id), "email": user.email}


@router.get("/me", response_model=UserResponse, dependencies=[Depends(verify_better_auth_token)])
async def get_profile(
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    return await user_service.get_user(db, request.state.user_id)


@router.patch("/me", response_model=UserResponse, dependencies=[Depends(verify_better_auth_token)])
async def update_profile(
    body: UserUpdateRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    return await user_service.update_user(db, request.state.user_id, body)


@router.delete("/me", status_code=204, dependencies=[Depends(verify_better_auth_token)])
async def delete_my_data(
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    await user_service.soft_delete_user(db, request.state.user_id)


@router.get("/me/export", dependencies=[Depends(verify_better_auth_token)])
async def export_my_data(
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    return await user_service.export_user_data(db, request.state.user_id)
