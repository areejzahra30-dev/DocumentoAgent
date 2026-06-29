# Documento Agent — Builder Rules

**Version:** 1.0

---

## Purpose

This document defines the development rules for the AI Builder Agent.

These rules are mandatory unless explicitly overridden by the user.

The goal is to maintain a clean, production-quality codebase that strictly follows the project specification.

---

## Rule 1 — Follow the Specification

`spec.md` is the project's source of truth.

Do not invent features.

Do not remove required functionality.

If a requirement is ambiguous, choose the simplest implementation that satisfies the specification.

---

## Rule 2 — Respect the Architecture

The architecture must remain modular.

Never merge unrelated responsibilities.

Use the following layers:

```
Frontend
    ↓
Backend
    ↓
Database
    ↓
Storage
    ↓
AI
```

Each layer should only perform its intended responsibility.

---

## Rule 3 — Build Incrementally

Complete one feature before starting another.

**Recommended order:**

1. Project setup
2. Authentication
3. Database
4. Storage
5. Upload system
6. File parsing
7. AI pipeline
8. README generation
9. Summary generation
10. History
11. Export
12. UI polish

Do not partially implement multiple features.

---

## Rule 4 — Never Fake Functionality

Do not use placeholder implementations for core features.

Avoid:

- Fake API responses
- Hardcoded AI output
- Mock database data

Temporary mock data is acceptable only when explicitly requested.

---

## Rule 5 — Keep Components Small

Prefer small reusable components.

Avoid components exceeding approximately 300 lines whenever practical.

Business logic must not live inside UI components.

---

## Rule 6 — Keep Business Logic in Backend

**Frontend responsibilities:**

- Rendering
- User interaction
- State management
- API requests

**Backend responsibilities:**

- Authentication
- Validation
- File parsing
- AI orchestration
- Database operations

---

## Rule 7 — AI Pipeline

Maintain the following workflow:

```
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
```

Do not collapse the workflow into a single function.

Each stage should remain independently maintainable.

---

## Rule 8 — Database

Use SQLAlchemy.

Manage schema changes with Alembic.

Never duplicate data unnecessarily.

Use relationships instead of redundant fields whenever appropriate.

---

## Rule 9 — Validation

Validate all external input.

Validate:

- Forms
- Uploaded files
- API payloads
- Query parameters

Reject invalid input before processing.

---

## Rule 10 — Error Handling

Never silently ignore errors.

Return meaningful error messages.

Log unexpected failures.

Prevent application crashes whenever possible.

---

## Rule 11 — Dependencies

Do not introduce new packages unless they provide clear value.

Prefer existing project dependencies.

If an additional dependency is required, explain why before introducing it.

---

## Rule 12 — Naming

Use descriptive names.

Avoid abbreviations.

**Examples:**

| Good              | Bad       |
|-------------------|-----------|
| `generateReadme()`| `gen()`   |
| `uploadProject()` | `temp()`  |
| `projectHistory()`| `data1()` |

---

## Rule 13 — Reusability

Avoid duplicated logic.

Extract shared functionality into reusable modules.

If identical logic appears multiple times, refactor it.

---

## Rule 14 — UI Consistency

Maintain consistent spacing, typography, colors, and component styles.

Use shadcn/ui components whenever suitable.

Animations should improve UX without reducing performance.

---

## Rule 15 — Performance

Avoid unnecessary renders.

Avoid duplicate database queries.

Avoid duplicate AI requests.

Avoid loading unnecessary data.

Optimize before adding complexity.

---

## Rule 16 — Security

Never expose secrets.

Never trust client input.

Hash passwords securely.

Protect authenticated routes.

Validate uploaded file types.

Enforce file size limits.

---

## Rule 17 — Code Quality

Prefer:

- Pure functions
- Typed interfaces
- Small modules
- Clear folder structure

Avoid:

- Deep nesting
- Global mutable state
- Duplicate code
- Unused files

---

## Rule 18 — Comments

Write self-documenting code.

Only add comments when they explain intent rather than implementation.

Avoid redundant comments.

---

## Rule 19 — Version Scope

Current target: **Version 1.0**

Implement only the functionality defined in `spec.md`.

Future ideas should not be implemented unless explicitly requested.

---

## Rule 20 — Completion Criteria

A feature is complete only when:

- [ ] Backend is implemented
- [ ] Frontend is connected
- [ ] Validation exists
- [ ] Errors are handled
- [ ] Database integration works
- [ ] The feature follows the architecture
- [ ] No placeholder code remains

Only then should development continue to the next feature.
