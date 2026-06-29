Documento Agent — Project Specification

Version: 1.0

1. Project Overview
Purpose

Documento Agent is a full-stack AI-powered web application that allows authenticated users to upload projects, source code, documents, images, and other supported files.

The application has two primary capabilities:

Generate a professional GitHub README.md file.
Generate structured summaries of uploaded material.

The application should feel modern, responsive, and highly interactive while maintaining a clean and minimal user experience.

This project should be implemented as an agentic workflow, not as a single LLM prompt. The AI pipeline must process uploaded content through multiple logical stages before generating the final output.

2. Project Goals

The application must:

Allow secure user authentication.
Support multiple projects per user.
Support multiple uploaded files per project.
Process different file types into a unified context.
Generate professional README files.
Generate high-quality summaries.
Preserve generation history.
Provide live markdown preview.
Allow downloading generated outputs.
Maintain responsive UI and smooth UX.
3. Technology Stack
Frontend
Next.js 15
React 19
TailwindCSS
shadcn/ui
Framer Motion
React Hook Form
Zod
React Markdown
Lucide Icons
KokonutUI AI Input
Backend
Python FastAPI
Database
Neon PostgreSQL
SQLAlchemy
Alembic
Authentication
BetterAuth (Next.js)
JWT-based authentication between Next.js and FastAPI

Requirements:

Email + Password
No email verification
Secure password hashing
Session-based authentication
FastAPI verifies JWT issued by BetterAuth
AI
Gemini 2.5 Flash
Storage
UploadThing
File Parsing (Python)
pypdf
python-mammoth
openpyxl
python-pptx
markdown-it-py
csv
json
Pillow (image preprocessing if needed)

Images are analyzed using Gemini Vision.

Deployment

Frontend:

Render

Backend:

Render

Database:

Neon PostgreSQL

Storage:

UploadThing
4. System Architecture

The application follows the architecture below.

User

↓

Next.js Frontend (UI)

↓

BetterAuth

↓

JWT

↓

FastAPI Backend

↓

Upload Processing

↓

File Parser

↓

Context Builder

↓

AI Agent

Analyzer

↓

Planner

↓

Generator

↓

Reviewer

↓

Generated Output

↓

Neon PostgreSQL

↓

History

↓

Export

Layer Responsibilities

Frontend (Next.js)

UI
Authentication
Session Management
API Communication

Backend (FastAPI)

Business Logic
File Processing
AI Orchestration
Database Operations
Output Generation

Each layer must remain modular and independently maintainable.

5. AI Workflow
Parser

Extract readable content from uploaded files.

Supported formats include:

PDF
DOCX
TXT
Markdown
Images
Source code
CSV
XLSX
PPTX
JSON
Context Builder

Merge extracted information into a single structured context before sending it to Gemini.

This stage is responsible for creating clean input for the AI model.

Analyzer

Determine:

Project vs document
Programming language
Framework (if applicable)
File categories
Upload contents
Planner

Determine:

README mode
Summary mode
Required sections
Output structure
Generator

Generate:

README.md

OR

Structured Summary
Reviewer

Perform one additional review pass.

Validate:

Completeness
Markdown formatting
Missing sections
Output consistency
6. Functional Requirements
Authentication

Authentication is managed entirely by BetterAuth running inside the Next.js application.

Workflow:

User

↓

BetterAuth

↓

JWT

↓

FastAPI verifies JWT

↓

Protected API endpoints

Users must be able to:

Sign Up
Sign In
Sign Out

Email verification is intentionally omitted.

All protected backend routes must require a valid JWT issued by BetterAuth..

Dashboard

Display:

Recent Projects
Recent Generations
Upload History
Upload

Requirements:

Drag & Drop
File picker
Multiple files
Upload progress
Validation
Project

A project:

belongs to one user
contains multiple uploaded files
contains multiple generated outputs
supports rename
supports deletion
README Generation

Generate a professional GitHub README.

The output should include appropriate sections depending on project contents.

The generator must avoid fabricating project details.

Summary Generation

Generate structured summaries.

The summary should prioritize:

Important concepts
Key details
Definitions
Important points

Avoid unnecessary repetition.

History

Users can:

View previous outputs
Open previous outputs
Download previous outputs

Generation history must not be overwritten.

Export

Support:

Markdown
TXT
PDF

Also support Copy to Clipboard.

7. UI Requirements

Design principles:

Responsive
Modern
Minimal
Accessible
Smooth animations

Use:

Glassmorphism
Rounded cards
Framer Motion
Skeleton loading
Dark-first design

8. Deployment Architecture

The application is deployed entirely using free-tier services.

Frontend

Render

Backend

Render

Database

Neon PostgreSQL

Storage

UploadThing

AI

Gemini Free Tier

Deployment Requirements

Frontend and backend are deployed as separate Render services.
The frontend communicates with the backend through HTTPS REST APIs.
FastAPI connects directly to Neon PostgreSQL.
Uploaded files are stored using UploadThing.
Secrets must be managed using Render environment variables.
No paid services should be required for Version 1 deployment.

9. Non-Functional Requirements

The application must be:

Modular
Type-safe
Maintainable
Responsive
Secure
Scalable

All components should be reusable.

Business logic should remain outside UI components.

The AI pipeline should remain independent of presentation logic.

10. Out of Scope

The following are intentionally excluded from Version 1:

GitHub repository import
ZIP repository upload
OCR
Team workspaces
AI chat
Multiple AI providers
Billing
Public sharing

These may be added in future versions but should not influence the Version 1 architecture.