# Documento Agent — Complete Requirements & Resource Summary

**Version:** 1.0  
**Last Updated:** 2026-06-28

---

## 1. Full Requirement List

### Functional Requirements

| # | Requirement | Category | Priority |
|---|------------|----------|----------|
| 1 | Email + Password sign-up | Auth | P0 |
| 2 | Email + Password sign-in | Auth | P0 |
| 3 | Sign-out (session destroy) | Auth | P0 |
| 4 | No email verification | Auth | P0 |
| 5 | Session-based auth (7-day expiry) | Auth | P0 |
| 6 | Dashboard with recent projects | UI | P0 |
| 7 | Dashboard with recent generations | UI | P1 |
| 8 | Dashboard with upload history | UI | P1 |
| 9 | Drag & drop file upload | Upload | P0 |
| 10 | File picker upload | Upload | P0 |
| 11 | Multiple file upload at once | Upload | P0 |
| 12 | Upload progress indicator | Upload | P1 |
| 13 | File type validation (client + server) | Upload | P0 |
| 14 | File size limit (10MB) | Upload | P0 |
| 15 | Create project | Projects | P0 |
| 16 | Rename project | Projects | P1 |
| 17 | Delete project + cascade | Projects | P0 |
| 18 | List user projects | Projects | P0 |
| 19 | Parse PDF files | Parser | P0 |
| 20 | Parse DOCX files | Parser | P0 |
| 21 | Parse TXT files | Parser | P0 |
| 22 | Parse Markdown files | Parser | P0 |
| 23 | Parse image files (metadata) | Parser | P1 |
| 24 | Parse CSV files | Parser | P0 |
| 25 | Parse XLSX files | Parser | P1 |
| 26 | Parse PPTX files | Parser | P1 |
| 27 | Parse JSON files | Parser | P0 |
| 28 | Parse source code files | Parser | P0 |
| 29 | Context Builder (merge parsed content) | AI | P0 |
| 30 | Analyzer (detect project type, lang, framework) | AI | P0 |
| 31 | Planner (determine sections, structure) | AI | P0 |
| 32 | Generator (produce README.md) | AI | P0 |
| 33 | Generator (produce structured summary) | AI | P0 |
| 34 | Reviewer (validate output) | AI | P0 |
| 35 | Don't fabricate project details | AI | P0 |
| 36 | Live Markdown preview | UI | P0 |
| 37 | Split-pane preview (desktop) | UI | P1 |
| 38 | Tab toggle preview (mobile) | UI | P1 |
| 39 | View generation history | History | P0 |
| 40 | Open previous generation | History | P0 |
| 41 | Download generation as Markdown | Export | P0 |
| 42 | Download generation as TXT | Export | P1 |
| 43 | Download generation as PDF | Export | P2 |
| 44 | Copy to clipboard | Export | P0 |
| 45 | User profile info | User | P1 |
| 46 | User data deletion (GDPR) | Compliance | P1 |
| 47 | User data export (GDPR) | Compliance | P1 |
| 48 | Cookie consent banner (CCPA) | Compliance | P1 |
| 49 | Privacy policy page | Compliance | P1 |
| 50 | Terms of service page | Compliance | P1 |
| 51 | Skeleton loading states | UI | P1 |
| 52 | Framer Motion animations | UI | P1 |
| 53 | Dark-first design | UI | P0 |
| 54 | Glassmorphism cards | UI | P1 |
| 55 | Responsive layout | UI | P0 |

### Non-Functional Requirements

| # | Requirement | Category |
|---|------------|----------|
| 56 | Modular architecture | Architecture |
| 57 | Type-safe (TypeScript + Pydantic) | Quality |
| 58 | Maintainable codebase | Quality |
| 59 | Responsive across all devices | UX |
| 60 | Secure password hashing (BetterAuth) | Security |
| 61 | Protected authenticated routes | Security |
| 62 | File type validation | Security |
| 63 | File size limits | Security |
| 64 | No secrets exposed client-side | Security |
| 65 | Don't trust client input | Security |
| 66 | Meaningful error messages | Error Handling |
| 67 | Log unexpected failures | Error Handling |
| 68 | Prevent app crashes | Error Handling |
| 69 | AI pipeline retry logic | Reliability |

---

## 2. Technology Stack (Complete Resource List)

### Frontend — Next.js 15 + React 19

| Resource | Purpose | Installation |
|----------|---------|-------------|
| Next.js 15 | Framework | `npx create-next-app@latest` |
| React 19 | UI library | Included with Next.js |
| TypeScript | Type safety | Included with Next.js |
| TailwindCSS v4 | Styling | Included with Next.js |
| shadcn/ui | Component library | `npx shadcn@latest init` |
| Framer Motion | Animations | `npm i framer-motion` |
| Lucide React | Icons | `npm i lucide-react` |
| React Hook Form | Form state | `npm i react-hook-form @hookform/resolvers` |
| Zod | Validation | `npm i zod` |
| React Markdown | Markdown render | `npm i react-markdown remark-gfm rehype-highlight` |
| BetterAuth | Auth (Next.js native) | `npm i better-auth @better-auth/next-js` |
| UploadThing | File storage | `npm i uploadthing @uploadthing/react` |
| TanStack Query | Server state | `npm i @tanstack/react-query` |
| @kokonutui/ai-input-search | AI input component | `npx shadcn@latest add @kokonutui/ai-input-search` |
| html2pdf.js | PDF export (client) | `npm i html2pdf.js` |

### Backend — Python FastAPI

| Resource | Purpose | Installation |
|----------|---------|-------------|
| FastAPI | Web framework | `pip install fastapi[standard]` |
| Uvicorn | ASGI server | `pip install uvicorn[standard]` |
| Pydantic + pydantic-settings | Validation + config | `pip install pydantic pydantic-settings` |
| SQLAlchemy (async) | ORM | `pip install sqlalchemy[asyncio]` |
| asyncpg | PostgreSQL async driver | `pip install asyncpg` |
| Alembic | Migrations | `pip install alembic` |
| PyJWT | JWT verification (BetterAuth) | `pip install pyjwt` |
| httpx | HTTP client | `pip install httpx` |
| pypdf | PDF parsing | `pip install pypdf` |
| python-mammoth | DOCX parsing | `pip install python-mammoth` |
| openpyxl | XLSX parsing | `pip install openpyxl` |
| python-pptx | PPTX parsing | `pip install python-pptx` |
| python-docx | DOCX processing | `pip install python-docx` |
| markdown-it-py | MD parsing | `pip install markdown-it-py` |
| Pillow | Image processing | `pip install pillow` |
| google-genai | Gemini API | `pip install google-genai` |
| python-multipart | File upload support | `pip install python-multipart` |
| loguru | Logging | `pip install loguru` |
| tenacity | Retry logic | `pip install tenacity` |

### Infrastructure

| Resource | Purpose | URL |
|----------|---------|-----|
| Neon PostgreSQL | Serverless Postgres | https://neon.tech |
| Gemini 2.5 Flash | AI model | https://aistudio.google.com |
| UploadThing | File storage | https://uploadthing.com |

### Development Tools

| Tool | Purpose |
|------|---------|
| npm/pnpm | Node.js package manager |
| pip/uv | Python package manager |
| BetterAuth CLI | Auth scaffolding | `npx skills add better-auth/skills` |

---

## 3. Architecture Diagram (Text)

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (Next.js 15)                  │
│  ┌──────────┐  ┌──────────┐  ┌────────┐  ┌──────────────┐ │
│  │  Auth UI  │  │Dashboard │  │Upload  │  │ Generation   │ │
│  │ (SignIn/  │  │(Projects,│  │(DnD,   │  │ (Preview,    │ │
│  │  SignUp)  │  │ History) │  │Picker) │  │  Export)     │ │
│  └─────┬────┘  └────┬─────┘  └───┬────┘  └──────┬───────┘ │
│        │             │            │               │         │
│  ┌─────┴─────────────┴────────────┴───────────────┴──────┐ │
│  │                   API Client Layer                     │ │
│  │   (BetterAuth session + Bearer token to FastAPI)      │ │
│  └──────────────────────────┬────────────────────────────┘ │
│                             │                               │
│  ┌──────────────────────────┴────────────────────────────┐ │
│  │              UploadThing (Direct Upload)               │ │
│  └───────────────────────────────────────────────────────┘ │
└──────────────────────────┬────────────────────────────────┘
                           │ HTTP (CORS)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     BACKEND (FastAPI)                       │
│  ┌──────────┐  ┌──────────┐  ┌────────┐  ┌──────────────┐ │
│  │Auth MW   │  │  API     │  │Services│  │  AI Pipeline  │ │
│  │(JWT      │  │ Routes   │  │(CRUD)  │  │              │ │
│  │ Verify)  │  │          │  │        │  │  Parser       │ │
│  └─────┬────┘  └────┬─────┘  └───┬────┘  │  Context      │ │
│        │             │            │       │  Builder      │ │
│        └─────────────┴────────────┘       │  Analyzer     │ │
│                                           │  Planner      │ │
│  ┌─────────────────────────────────────┐  │  Generator    │ │
│  │        SQLAlchemy (Async)           │  │  Reviewer     │ │
│  │        ─────────────────            │  └──────┬───────┘ │
│  │   PostgreSQL (Neon)                 │         │         │
│  │   ┌─────┐ ┌────────┐ ┌──────────┐ │         │         │
│  │   │Users│ │Projects│ │Files     │ │         │         │
│  │   └─────┘ └────────┘ └──────────┘ │         │         │
│  │   ┌──────────┐                     │         │         │
│  │   │Generations│                    │         │         │
│  │   └──────────┘                     │         │         │
│  └─────────────────────────────────────┘         │         │
│                                                  │         │
│  ┌───────────────────────────────────────────────┘         │
│  │                  Gemini 2.5 Flash API                    │
│  └──────────────────────────────────────────────────────────┘
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Data Flow Summary

### Auth Flow
```
User → Sign Up Form → BetterAuth API (Next.js) → Postgres (BetterAuth schema)
                                                 → User Sync API (FastAPI) → users table
User → Sign In Form → BetterAuth API (Next.js) → JWT Session Token
User → API Request → Frontend → Bearer Token → FastAPI Auth MW → User Data
```

### Upload Flow
```
User → Drag Files → UploadThing Client → UploadThing CDN → URL + Key
     → Register File API (FastAPI) → files table (metadata only)
     → Background Parse → content_text updated
```

### Generation Flow
```
User → Click Generate → FastAPI Generation API
     → Fetch files → Download from UploadThing → Parser
     → Context Builder → Analyzer → Planner → Generator → Reviewer
     → Save to generations table → Return output to frontend
```

---

## 5. Resource Links

| Resource | URL |
|----------|-----|
| BetterAuth Installation | https://better-auth.com/docs/installation |
| BetterAuth Skills | `npx skills add better-auth/skills` |
| AI Input Component | `npx shadcn@latest add @kokonutui/ai-input-search` |
| Next.js 15 Docs | https://nextjs.org/docs |
| shadcn/ui | https://ui.shadcn.com |
| FastAPI | https://fastapi.tiangolo.com |
| SQLAlchemy Async | https://docs.sqlalchemy.org/en/20/orm/extensions/asyncio.html |
| Alembic | https://alembic.sqlalchemy.org |
| Neon Postgres | https://neon.tech/docs |
| Gemini API | https://ai.google.dev/gemini-api/docs |
| UploadThing | https://docs.uploadthing.com |
| Framer Motion | https://www.framer.com/motion |
| React Hook Form | https://react-hook-form.com |
| Zod | https://zod.dev |

---

## 6. CCPA / GDPR Compliance Checklist

| # | Requirement | Implementation | Status |
|---|-------------|----------------|--------|
| 1 | Cookie consent banner | Frontend component, localStorage tracking | Planned |
| 2 | Privacy policy page | `/privacy` route | Planned |
| 3 | Terms of service page | `/terms` route | Planned |
| 4 | Right to access data | `GET /api/v1/users/me/export` | Planned |
| 5 | Right to delete data | `DELETE /api/v1/users/me` (soft delete) | Planned |
| 6 | Right to data portability | JSON export of all user data | Planned |
| 7 | Session expiry (7 days) | BetterAuth session config | Planned |
| 8 | No third-party data sharing | Architecture guarantee | Planned |
| 9 | Google AI data terms | Gemini API does not use data for training | Verified |
| 10 | Log retention limits | 90 days, auto-purge | Planned |
| 11 | Secure password hashing | BetterAuth (bcrypt/scrypt) | Built-in |

---

## 7. Documents Created

| Document | Path | Purpose |
|----------|------|---------|
| Frontend Requirements | `frontend-requirements.md` | All frontend pages, components, flows |
| Backend Requirements | `backend-requirements.md` | All backend endpoints, models, pipeline |
| Frontend Setup Guide | `frontend-setup-guide.md` | Step-by-step frontend setup instructions |
| Backend Setup Guide | `backend-setup-guide.md` | Step-by-step backend setup instructions |
| This Document | `project-requirements-summary.md` | Complete requirements + resource index |
