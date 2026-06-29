# Documento Agent — Master Task List

**Build Order** (per Builder Rule 3)

---

## Phase 1: Project Setup ✅

- [x] Scaffold Next.js 15 frontend
- [x] Install all frontend dependencies (shadcn/ui, BetterAuth, UploadThing, Framer Motion, etc.)
- [x] Create frontend folder structure (routes, components, lib, hooks, types)
- [x] Scaffold FastAPI backend project structure
- [x] Create SQLAlchemy models (User, Project, File, Generation)
- [x] Create Pydantic schemas (request/response validation)
- [x] Create REST API routes (users, projects, files, generations)
- [x] Create business logic services
- [x] Create file parsers (PDF, DOCX, TXT, MD, CSV, XLSX, PPTX, JSON, Images)
- [x] Create AI pipeline structure (Context Builder, Analyzer, Planner, Generator, Reviewer)
- [x] Install all Python dependencies
- [x] Fix asyncpg SSL connection for Neon PostgreSQL
- [x] Generate and apply Alembic migration
- [x] Verify backend starts and health endpoint responds
- [x] Verify frontend builds without TypeScript errors

## Phase 2: Authentication

- [ ] Set up BetterAuth in Next.js (sign-up, sign-in, sign-out)
- [ ] Create auth UI pages (sign-in, sign-up forms)
- [ ] Create BetterAuth API route handler
- [ ] Set up BetterAuth middleware for protected routes
- [ ] Create user sync endpoint in FastAPI (POST /api/v1/users/sync)
- [ ] Configure JWT verification middleware in FastAPI
- [ ] Test full auth flow end-to-end

## Phase 3: Database

- [ ] Verify all SQLAlchemy models match schema
- [ ] Add any missing indexes or constraints
- [ ] Test CRUD operations via API

## Phase 4: Storage

- [ ] Set up UploadThing API route in Next.js
- [ ] Configure UploadThing file router
- [ ] Test file upload directly to UploadThing CDN

## Phase 5: Upload System

- [ ] Create drag-and-drop upload component
- [ ] Create file picker upload component
- [ ] Connect upload to UploadThing → register file with FastAPI
- [ ] Validate file types and sizes on client + server
- [ ] Show upload progress indicators
- [ ] Display uploaded files per project

## Phase 6: File Parsing

- [ ] Test each parser with sample files of each format
- [ ] Handle file download from UploadThing URL
- [ ] Store extracted text in files.content_text
- [ ] Handle parsing errors gracefully

## Phase 7: AI Pipeline

- [ ] Test Gemini client connection
- [ ] Test Context Builder stage
- [ ] Test Analyzer stage
- [ ] Test Planner stage
- [ ] Test Generator stage (README mode)
- [ ] Test Generator stage (Summary mode)
- [ ] Test Reviewer stage
- [ ] Test full pipeline orchestration
- [ ] Add retry logic and error handling

## Phase 8: README Generation

- [ ] Connect generation UI to backend API
- [ ] Show real-time progress stages in frontend
- [ ] Display generated README with live Markdown preview
- [ ] Add regenerate button
- [ ] Test with sample projects

## Phase 9: Summary Generation

- [ ] Reuse pipeline for summary mode
- [ ] Display structured summary output
- [ ] Test with sample documents

## Phase 10: History

- [ ] Create history list page
- [ ] Create single generation detail page
- [ ] Show generation status and metadata
- [ ] Ensure history is never overwritten

## Phase 11: Export

- [ ] Markdown download
- [ ] TXT download
- [ ] PDF download (html2pdf.js or backend)
- [ ] Copy to clipboard
- [ ] Test all export formats

## Phase 12: UI Polish

- [ ] Framer Motion page transitions
- [ ] Skeleton loading states
- [ ] Glassmorphism card styling
- [ ] Dark-first theme refinement
- [ ] Responsive layout verification
- [ ] Accessibility audit
- [ ] CCPA/GDPR cookie consent banner
- [ ] Privacy policy page
- [ ] Terms of service page
- [ ] User settings page (profile, data deletion, data export)
