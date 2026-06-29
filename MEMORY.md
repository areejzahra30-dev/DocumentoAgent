Documento Agent — Project Memory

This file contains long-term project decisions that should remain consistent throughout development.

Project Identity

Name:

Documento Agent

Purpose:

AI-powered README generator and document summarizer.

Architecture:

Full-stack application with FastAPI backend and Next.js frontend.

Development Philosophy

Always prioritize:

Clean architecture
Modular code
Readability
Maintainability
Reusability

Avoid shortcuts that tightly couple unrelated modules.

Source of Truth

The project architecture is the highest priority.

Do not introduce features that are not specified in spec.md.

If implementation decisions are ambiguous, prefer the simplest solution that remains scalable.

AI Philosophy

The application is an agentic workflow, not a single prompt wrapper.

The workflow must remain:

Parser

↓

Context Builder

↓

Analyzer

↓

Planner

↓

Generator

↓

Reviewer

↓

Output

Do not collapse these stages into one implementation unless explicitly requested.

Backend Principles
FastAPI owns all backend logic.
SQLAlchemy manages database interaction.
Alembic manages schema migrations.
Gemini handles AI generation only.
UploadThing manages uploaded files.

Each service should have a single responsibility.

Frontend Principles

The frontend is responsible only for:

UI
UX
State management
API communication
Rendering

Business logic should remain in the backend whenever possible.

UI Philosophy

The application should resemble modern SaaS products.

Priorities:

Clean layouts
Minimal design
Smooth animations
Excellent responsiveness
Fast interactions

Avoid excessive visual effects.

AI Output Principles

README generation should:

be professional
use valid GitHub Markdown
avoid hallucinating information
infer structure only when supported by uploaded content

Summary generation should:

preserve important information
remain concise
avoid repetition
maintain logical organization
Code Standards

Prefer:

small functions
reusable components
descriptive naming
typed interfaces
modular folders

Avoid:

duplicated logic
large files
deeply nested components
unnecessary abstractions
Version Scope

Current target:

Version 1.0

Only implement features described in spec.md.

Do not add experimental functionality unless explicitly requested.

Maintain consistency over feature quantity.