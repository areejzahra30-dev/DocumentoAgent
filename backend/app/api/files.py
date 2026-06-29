import os
import uuid as uuid_lib
from uuid import UUID

from fastapi import APIRouter, Depends, Request, UploadFile, File, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.middleware.auth import verify_better_auth_token
from app.schemas.file import FileRegisterRequest, FileResponse
from app.services import file_service

router = APIRouter(dependencies=[Depends(verify_better_auth_token)])

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

SUPPORTED_EXTENSIONS = {
    ".pdf", ".docx", ".txt", ".md", ".csv", ".xlsx", ".pptx", ".json",
    ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp",
    ".py", ".js", ".ts", ".jsx", ".tsx", ".java", ".cpp", ".c", ".h",
    ".rb", ".go", ".rs", ".swift", ".kt", ".scala", ".php", ".css", ".scss",
    ".html", ".xml", ".yaml", ".yml", ".toml", ".ini", ".cfg", ".env",
}


def _infer_file_type(filename: str) -> str:
    ext = os.path.splitext(filename)[1].lower()
    if ext in {".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"}:
        return "image"
    if ext == ".pdf":
        return "pdf"
    if ext == ".docx":
        return "docx"
    if ext == ".txt":
        return "txt"
    if ext == ".md":
        return "markdown"
    if ext == ".csv":
        return "csv"
    if ext == ".xlsx":
        return "xlsx"
    if ext == ".pptx":
        return "pptx"
    if ext == ".json":
        return "json"
    return "code"


@router.post("/{project_id}/files/upload", response_model=FileResponse, status_code=201)
async def upload_file(
    project_id: UUID,
    file: UploadFile = File(...),
    request: Request = None,
    db: AsyncSession = Depends(get_db),
):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")

    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in SUPPORTED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{ext}'. Supported: {', '.join(sorted(SUPPORTED_EXTENSIONS))}",
        )

    file_id = str(uuid_lib.uuid4())
    safe_name = f"{file_id}{ext}"
    dest = os.path.join(UPLOAD_DIR, safe_name)

    content = await file.read()
    with open(dest, "wb") as f:
        f.write(content)

    file_size = len(content)
    file_type = _infer_file_type(file.filename)
    base = str(request.base_url).rstrip("/")
    storage_url = f"{base}/uploads/{safe_name}"

    body = FileRegisterRequest(
        filename=file.filename,
        file_type=file_type,
        file_size=file_size,
        storage_key=safe_name,
        storage_url=storage_url,
    )
    return await file_service.register_file(db, project_id, request.state.user_id, body)


@router.post("/{project_id}/files", response_model=FileResponse, status_code=201)
async def register_file(
    project_id: UUID,
    body: FileRegisterRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    return await file_service.register_file(db, project_id, request.state.user_id, body)


@router.get("/{project_id}/files", response_model=list[FileResponse])
async def list_files(
    project_id: UUID,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    return await file_service.list_files(db, project_id, request.state.user_id)


@router.delete("/{project_id}/files/{file_id}", status_code=204)
async def delete_file(
    project_id: UUID,
    file_id: UUID,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    await file_service.delete_file(db, project_id, file_id, request.state.user_id)
