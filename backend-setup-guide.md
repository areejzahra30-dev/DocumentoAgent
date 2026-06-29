# Documento Agent — Backend Setup Guide

**Stack:** Python FastAPI + Neon PostgreSQL + SQLAlchemy + Gemini 2.5 Flash

---

## Prerequisites

- Python 3.11+
- pip / uv (recommended for speed)
- A Neon PostgreSQL database (free tier)
- A Google Gemini API key
- UploadThing account (for file downloads)

---

## Step 1: Create Project

```bash
mkdir backend
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
# source .venv/bin/activate
```

---

## Step 2: Install Dependencies

```bash
pip install "fastapi[standard]" uvicorn pydantic pydantic-settings
pip install "sqlalchemy[asyncio]" asyncpg alembic
pip install pyjwt httpx
pip install pypdf python-mammoth openpyxl python-pptx python-docx markdown-it-py pillow
pip install google-genai
pip install python-multipart loguru tenacity
```

Or use `requirements.txt`:

```txt
fastapi[standard]>=0.115.0
uvicorn[standard]>=0.32.0
pydantic>=2.10.0
pydantic-settings>=2.7.0
sqlalchemy[asyncio]>=2.0.36
asyncpg>=0.30.0
alembic>=1.14.0
pyjwt>=2.10.0
httpx>=0.28.0
pypdf>=5.1.0
python-mammoth>=0.1.0
openpyxl>=3.1.5
python-pptx>=1.0.2
python-docx>=1.1.2
markdown-it-py>=3.0.0
pillow>=11.0.0
google-genai>=1.0.0
python-multipart>=0.0.18
loguru>=0.7.3
tenacity>=9.0.0
```

```bash
pip install -r requirements.txt
```

---

## Step 3: Configure Environment

Create `.env`:

```env
HOST=0.0.0.0
PORT=8000
ENVIRONMENT=development

DATABASE_URL=postgresql+asyncpg://user:pass@neon-host/docagent

BETTER_AUTH_SECRET=your-better-auth-secret-min-32-chars
BETTER_AUTH_URL=http://localhost:3000

GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.5-flash

UPLOADTHING_SECRET=your-uploadthing-secret

ALLOWED_ORIGINS=http://localhost:3000
```

---

## Step 4: Configure Database

### 4.1 SQLAlchemy setup

`app/database.py`:
```python
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from app.config import settings

engine = create_async_engine(settings.DATABASE_URL, echo=settings.ENVIRONMENT == "development")
async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

class Base(DeclarativeBase):
    pass

async def get_db() -> AsyncSession:
    async with async_session() as session:
        try:
            yield session
        finally:
            await session.close()
```

### 4.2 Initialize Alembic

```bash
alembic init alembic
```

Edit `alembic/env.py` to use async engine and auto-import models.

### 4.3 Create First Migration

```bash
alembic revision --autogenerate -m "initial"
alembic upgrade head
```

---

## Step 5: Run the Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
# → http://localhost:8000
# → API Docs: http://localhost:8000/docs
```

---

## Step 6: Verify Setup

```bash
# Health check
curl http://localhost:8000/api/v1/health
# → {"status": "ok"}
```

---

## Connecting to Frontend

**CORS Configuration** (`app/main.py`):
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Auth Integration:**
- Frontend sends BetterAuth JWT in `Authorization: Bearer` header
- Backend middleware decodes the JWT using shared `BETTER_AUTH_SECRET`
- No login/signup endpoints needed on backend — BetterAuth handles that on Next.js

---

## Production

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

For Docker deployment, include a `Dockerfile` with the multi-stage build.
