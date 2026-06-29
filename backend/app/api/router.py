from fastapi import APIRouter

from app.api import projects, files, generations, users

router = APIRouter(prefix="/api/v1")

router.include_router(users.router, prefix="/users", tags=["Users"])
router.include_router(projects.router, prefix="/projects", tags=["Projects"])
router.include_router(files.router, prefix="/projects", tags=["Files"])
router.include_router(generations.router, prefix="", tags=["Generations"])


@router.get("/health")
async def health_check():
    return {"status": "ok", "version": "1.0"}
