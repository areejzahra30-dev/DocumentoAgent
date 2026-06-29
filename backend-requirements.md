# Documento Agent — Backend Requirements

**Version:** 1.0  
**Stack:** Python FastAPI + Neon PostgreSQL + SQLAlchemy + Gemini 2.5 Flash

---

## 1. Overview

The backend is a Python FastAPI server that handles:
- User management (profile, deletion, export)
- Project CRUD
- File registration and metadata
- File parsing (extract text from uploaded files)
- AI pipeline (Analyzer → Planner → Generator → Reviewer)
- Generation history
- Auth token validation (via BetterAuth shared JWT secret)

---

## 2. Tech Stack (Python)

### Core
| Library              | Purpose                                  |
|----------------------|------------------------------------------|
| `fastapi`            | Web framework                            |
| `uvicorn[standard]`  | ASGI server                              |
| `pydantic`           | Request/response validation              |
| `pydantic-settings`  | Environment variable management          |

### Database
| Library              | Purpose                                  |
|----------------------|------------------------------------------|
| `sqlalchemy[asyncio]` | ORM (async)                              |
| `asyncpg`            | PostgreSQL async driver                  |
| `alembic`            | Migrations                               |
| `neon` (standard)    | Connection to Neon PostgreSQL            |

### Authentication (BetterAuth Integration)
| Library              | Purpose                                  |
|----------------------|------------------------------------------|
| `pyjwt`              | Decode/verify BetterAuth JWT tokens      |
| `httpx`              | Call BetterAuth verify endpoint (fallback)|

### File Parsing
| Library              | Purpose                                  |
|----------------------|------------------------------------------|
| `pypdf`              | PDF text extraction                      |
| `python-mammoth`     | DOCX text extraction                     |
| `openpyxl`           | XLSX data extraction                     |
| `python-pptx`        | PPTX text extraction                     |
| `python-docx`        | DOCX processing                          |
| `csv` (stdlib)        | CSV parsing                              |
| `json` (stdlib)       | JSON parsing                             |
| `markdown-it-py`     | MD parsing                               |
| `pillow`             | Image metadata + EXIF extraction         |
| `pytesseract`        | OCR for images (optional, stretch goal)  |

### AI
| Library              | Purpose                                  |
|----------------------|------------------------------------------|
| `google-genai`       | Gemini 2.5 Flash API                     |

### Utilities
| Library              | Purpose                                  |
|----------------------|------------------------------------------|
| `httpx`              | HTTP client (UploadThing fetch, etc.)    |
| `python-multipart`   | File upload support                      |
| `loguru`             | Structured logging                       |
| `tenacity`           | Retry logic for AI calls                 |

---

## 3. Authentication (BetterAuth Integration)

### How It Works

BetterAuth runs on Next.js API routes. FastAPI does NOT handle login/signup directly.

**Token Validation Flow:**

1. Frontend authenticates via BetterAuth (Next.js)
2. BetterAuth issues a JWT session token (stored as HTTP-only cookie on the frontend)
3. Frontend reads the token from BetterAuth client and sends it to FastAPI as:
   ```
   Authorization: Bearer <token>
   ```
4. FastAPI middleware validates the token:
   - Decodes JWT using `pyjwt` with the shared `BETTER_AUTH_SECRET`
   - Extracts `user_id` and `email` from the token payload
   - If invalid/expired → returns 401 Unauthorized
   - If valid → attaches `current_user` to request state

### Middleware

```python
# app/middleware/auth.py
from fastapi import Request, HTTPException
from jwt import decode, ExpiredSignatureError, InvalidTokenError

async def verify_better_auth_token(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")

    token = auth_header.replace("Bearer ", "")
    try:
        payload = decode(token, settings.BETTER_AUTH_SECRET, algorithms=["HS256"])
        request.state.user_id = payload.get("sub")
        request.state.user_email = payload.get("email")
    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
```

### User Synchronization

When a new user signs up via BetterAuth, FastAPI needs to know about them.
- **Option 1 (Recommended):** After sign-up, frontend calls `POST /api/v1/users/sync` to create user record in the backend DB
- **Option 2:** FastAPI queries BetterAuth's database directly (not recommended — couples databases)

---

## 4. Database Schema

### Tables

#### `users`
| Column       | Type      | Notes                               |
|--------------|-----------|-------------------------------------|
| id           | UUID      | PK, matches BetterAuth `sub` claim  |
| email        | TEXT      | UNIQUE, NOT NULL                    |
| name         | TEXT      | Nullable                            |
| avatar_url   | TEXT      | Nullable                            |
| created_at   | TIMESTAMP | Default: now()                      |
| updated_at   | TIMESTAMP | Auto-update                         |
| deleted_at   | TIMESTAMP | Nullable (soft delete for GDPR)     |

#### `projects`
| Column       | Type      | Notes                               |
|--------------|-----------|-------------------------------------|
| id           | UUID      | PK                                  |
| user_id      | UUID      | FK → users.id, NOT NULL             |
| name         | TEXT      | NOT NULL                            |
| description  | TEXT      | Nullable                            |
| created_at   | TIMESTAMP | Default: now()                      |
| updated_at   | TIMESTAMP | Auto-update                         |

#### `files`
| Column       | Type      | Notes                               |
|--------------|-----------|-------------------------------------|
| id           | UUID      | PK                                  |
| project_id   | UUID      | FK → projects.id, NOT NULL          |
| user_id      | UUID      | FK → users.id, NOT NULL             |
| filename     | TEXT      | NOT NULL                            |
| file_type    | TEXT      | MIME type or extension              |
| file_size    | INTEGER   | Bytes                               |
| storage_key  | TEXT      | UploadThing file key                |
| storage_url  | TEXT      | UploadThing file URL                |
| content_text | TEXT      | Extracted text (nullable, populated after parsing) |
| created_at   | TIMESTAMP | Default: now()                      |

#### `generations`
| Column       | Type      | Notes                               |
|--------------|-----------|-------------------------------------|
| id           | UUID      | PK                                  |
| project_id   | UUID      | FK → projects.id, NOT NULL          |
| user_id      | UUID      | FK → users.id, NOT NULL             |
| type         | TEXT      | 'readme' or 'summary'               |
| status       | TEXT      | 'pending', 'processing', 'completed', 'failed' |
| input_context| JSONB     | The context sent to the AI pipeline |
| output_content | TEXT    | Final generated output               |
| output_format | TEXT    | 'markdown' (default)                |
| model_used   | TEXT      | 'gemini-2.5-flash'                  |
| error_message| TEXT      | Nullable, populated on failure      |
| created_at   | TIMESTAMP | Default: now()                      |
| completed_at | TIMESTAMP | Nullable                            |

### Relationships
- User 1→* Projects
- User 1→* Generations (via user_id)
- Project 1→* Files
- Project 1→* Generations
- File *→1 Project

### Indexes
- `users.email` UNIQUE
- `projects.user_id`
- `files.project_id`
- `files.user_id`
- `generations.project_id`
- `generations.user_id`
- `generations.created_at` (for history sorting)

---

## 5. API Endpoints

### Health
| Method | Endpoint     | Purpose              |
|--------|-------------|----------------------|
| GET    | `/api/v1/health` | Health check     |

### Users
| Method | Endpoint                 | Purpose                  |
|--------|--------------------------|--------------------------|
| POST   | `/api/v1/users/sync`     | Create/update user from BetterAuth |
| GET    | `/api/v1/users/me`       | Get current user profile |
| PATCH  | `/api/v1/users/me`       | Update profile           |
| DELETE | `/api/v1/users/me`       | Delete all user data (GDPR) |
| GET    | `/api/v1/users/me/export`| Export all user data (GDPR) |

### Projects
| Method | Endpoint                          | Purpose              |
|--------|-----------------------------------|----------------------|
| GET    | `/api/v1/projects`                | List user projects   |
| POST   | `/api/v1/projects`                | Create project       |
| GET    | `/api/v1/projects/{id}`           | Get project detail   |
| PATCH  | `/api/v1/projects/{id}`           | Update project       |
| DELETE | `/api/v1/projects/{id}`           | Delete project + cascade |

### Files
| Method | Endpoint                                   | Purpose              |
|--------|--------------------------------------------|----------------------|
| POST   | `/api/v1/projects/{id}/files`              | Register uploaded file |
| GET    | `/api/v1/projects/{id}/files`              | List project files   |
| DELETE | `/api/v1/projects/{id}/files/{file_id}`    | Delete file          |

### Generations
| Method | Endpoint                                           | Purpose              |
|--------|-----------------------------------------------------|----------------------|
| POST   | `/api/v1/projects/{id}/generations`                 | Trigger generation   |
| GET    | `/api/v1/generations`                               | List user generations |
| GET    | `/api/v1/generations/{id}`                          | Get generation detail |
| GET    | `/api/v1/generations/{id}/download?format=md\|txt\|pdf` | Download output  |
| DELETE | `/api/v1/generations/{id}`                          | Delete generation    |

---

## 6. AI Pipeline

All pipeline stages live in `app/ai/pipeline.py` and are called sequentially.

### Stage 1: Parser
```python
# app/ai/stages/parser.py
def parse_file(file: File) -> str:
    if file.file_type == "pdf":     return parse_pdf(file.storage_url)
    if file.file_type == "docx":    return parse_docx(file.storage_url)
    if file.file_type == "txt":     return parse_txt(file.storage_url)
    if file.file_type == "md":      return parse_md(file.storage_url)
    if file.file_type in IMAGE_TYPES: return parse_image(file.storage_url)
    if file.file_type == "csv":     return parse_csv(file.storage_url)
    if file.file_type == "xlsx":    return parse_xlsx(file.storage_url)
    if file.file_type == "pptx":    return parse_pptx(file.storage_url)
    if file.file_type == "json":    return parse_json(file.storage_url)
    if file.file_type in CODE_TYPES: return read_as_text(file.storage_url)
    return f"[Unsupported file type: {file.file_type}]"
```

Each parser downloads the file from UploadThing URL, extracts text, and returns a string.

### Stage 2: Context Builder
```python
# app/ai/stages/context_builder.py
def build_context(parsed_files: list[ParsedFile]) -> str:
    # Merges all extracted text into a single structured context
    # Separates by file, adds filename headers
    # Truncates if total exceeds token limit (Gemini 1M context window)
    pass
```

### Stage 3: Analyzer
Uses Gemini to analyze the context and determine:
- Is this a project or just documents?
- What programming language(s) are present?
- What framework(s) (if any)?
- File categories (code, docs, config, images, data)
- Brief summary of contents

### Stage 4: Planner
Based on analyzer output, determines:
- README mode → which sections to include
- Summary mode → structure of summary
- Output format instructions

### Stage 5: Generator
Sends the context + plan to Gemini and generates:
- Full README.md content
- OR structured summary

**Prompt Engineering Rules:**
- Never fabricate project details
- Base everything strictly on uploaded content
- Use Markdown formatting

### Stage 6: Reviewer
```python
def review(output: str, context: str) -> tuple[bool, str]:
    # Ask Gemini to review the output
    # Check: completeness, formatting, missing sections, consistency
    # If issues found → return (False, feedback)
    # If clean → return (True, output)
```

If review fails (max 2 retries), generation status is set to `completed` with a warning note instead of blocking.

### Pipeline Orchestration
```python
# app/ai/pipeline.py
async def run_pipeline(project_id: UUID, generation_type: str) -> Generation:
    files = await get_project_files(project_id)
    parsed = [await parse_file(f) for f in files]
    context = build_context(parsed)
    analysis = await analyzer.analyze(context)
    plan = await planner.plan(analysis, generation_type)
    output = await generator.generate(context, plan)
    is_valid, feedback = await reviewer.review(output, context)
    if not is_valid:
        output = await generator.generate(context, plan, previous_feedback=feedback)
    return output
```

---

## 7. File Processing

### Upload Flow
1. Frontend uploads file to UploadThing
2. UploadThing returns `{ url, key, name, size, type }`
3. Frontend sends this metadata to FastAPI: `POST /projects/{id}/files`
4. FastAPI creates File record (with `content_text = NULL`)
5. FastAPI triggers async file parsing task
6. After parsing completes, `content_text` is updated

### File Fetching for AI
Pipeline downloads files from UploadThing URL during parsing stage.

---

## 8. CCPA / GDPR Compliance

### Endpoints
- `DELETE /api/v1/users/me` — cascade deletes user, projects, files, generations (soft delete with `deleted_at`)
- `GET /api/v1/users/me/export` — returns JSON with all user data (profile, projects, files metadata, generations)

### Logging
- Do NOT log file contents or generated output
- Log only: timestamps, user IDs (anonymized), generation status, error types
- Retention: 90 days, then auto-purged

### Data Processing Agreement
- Gemini API: Google does not use API data for training. This is stated in Google's terms.
- Storage: User data is stored only in Neon PostgreSQL.
- File content: Stored temporarily for processing, can be deleted on user request.

---

## 9. Error Handling

### Strategy
- All endpoints return structured JSON: `{ detail: string, code: string }`
- Use FastAPI exception handlers for:
  - 400 Bad Request (validation)
  - 401 Unauthorized (auth)
  - 403 Forbidden (wrong user)
  - 404 Not Found
  - 429 Too Many Requests (rate limiting)
  - 500 Internal Server Error (unexpected)

### AI Pipeline Errors
- If AI call fails → retry with exponential backoff (max 3 attempts)
- If all retries fail → set generation status to `failed`, store error message
- If review fails repeatedly → set status to `completed` with warning

---

## 10. Environment Variables

```env
# Server
HOST=0.0.0.0
PORT=8000
ENVIRONMENT=development

# Database
DATABASE_URL=postgresql+asyncpg://user:pass@neon-host/docagent

# Auth (BetterAuth integration)
BETTER_AUTH_SECRET=your-better-auth-jwt-secret
BETTER_AUTH_URL=http://localhost:3000

# AI
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.5-flash

# UploadThing (for downloading files)
UPLOADTHING_SECRET=your-uploadthing-secret

# CORS
ALLOWED_ORIGINS=http://localhost:3000
```

---

## 11. Folder Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                  # FastAPI app, middleware, startup
│   ├── config.py                # pydantic-settings
│   ├── database.py              # SQLAlchemy engine + session
│   ├── models/                  # SQLAlchemy models
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── project.py
│   │   ├── file.py
│   │   └── generation.py
│   ├── schemas/                 # Pydantic schemas
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── project.py
│   │   ├── file.py
│   │   └── generation.py
│   ├── api/                     # Route handlers
│   │   ├── __init__.py
│   │   ├── router.py            # Main router
│   │   ├── projects.py
│   │   ├── files.py
│   │   ├── generations.py
│   │   └── users.py
│   ├── middleware/
│   │   ├── __init__.py
│   │   └── auth.py              # BetterAuth JWT verification
│   ├── services/                # Business logic
│   │   ├── __init__.py
│   │   ├── project_service.py
│   │   ├── file_service.py
│   │   ├── generation_service.py
│   │   └── user_service.py
│   ├── parsers/                 # File parsers
│   │   ├── __init__.py
│   │   ├── base.py
│   │   ├── pdf_parser.py
│   │   ├── docx_parser.py
│   │   ├── txt_parser.py
│   │   ├── md_parser.py
│   │   ├── image_parser.py
│   │   ├── csv_parser.py
│   │   ├── xlsx_parser.py
│   │   ├── pptx_parser.py
│   │   └── json_parser.py
│   └── ai/                      # AI pipeline
│       ├── __init__.py
│       ├── pipeline.py
│       ├── stages/
│       │   ├── __init__.py
│       │   ├── context_builder.py
│       │   ├── analyzer.py
│       │   ├── planner.py
│       │   ├── generator.py
│       │   └── reviewer.py
│       └── client.py            # Gemini client wrapper
├── alembic/                     # Migrations
│   ├── env.py
│   └── versions/
├── alembic.ini
├── requirements.txt
├── pyproject.toml
└── .env
```
