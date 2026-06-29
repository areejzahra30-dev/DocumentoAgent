# Documento Agent — Frontend Requirements

**Version:** 1.0  
**Stack:** Next.js 15 + React 19 + TailwindCSS + shadcn/ui + BetterAuth

---

## 1. Overview

The frontend is a single-page application (SPA-like using App Router) that provides:
- Authentication (Sign Up / Sign In / Sign Out)
- Dashboard (projects, recent generations, upload history)
- File upload with drag-and-drop
- README generation interface
- Summary generation interface
- Live Markdown preview
- History browser
- Export (Markdown, TXT, PDF, clipboard)

---

## 2. Pages / Routes

| Route                  | Description                              | Auth Required |
|------------------------|------------------------------------------|---------------|
| `/`                    | Landing page                             | No            |
| `/sign-in`             | Sign in form                             | No            |
| `/sign-up`             | Sign up form                             | No            |
| `/dashboard`           | Main dashboard                           | Yes           |
| `/dashboard/projects`  | Project list                             | Yes           |
| `/dashboard/projects/[id]` | Single project detail + upload       | Yes           |
| `/dashboard/projects/[id]/generate` | Generation interface     | Yes           |
| `/dashboard/history`   | Generation history list                  | Yes           |
| `/dashboard/history/[id]` | Single generation view + export      | Yes           |
| `/privacy`             | Privacy policy (GDPR/CCPA)              | No            |
| `/terms`               | Terms of service                         | No            |
| `/settings`            | User profile settings + data deletion    | Yes           |

### Middleware

Protect all `/dashboard/*` routes via BetterAuth middleware. Redirect unauthenticated users to `/sign-in`.

---

## 3. Authentication (BetterAuth)

### Integration

BetterAuth runs inside Next.js API routes (`/api/auth/*`).

**Flow:**
1. User signs up via `/api/auth/sign-up` (email + password)
2. User signs in via `/api/auth/sign-in` → receives session cookie
3. Session cookie is sent automatically with every request to Next.js API routes
4. For FastAPI requests, the frontend reads the session token from BetterAuth's client and sends it as `Authorization: Bearer <token>` header

**Endpoints exposed by BetterAuth:**
- `GET /api/auth/session` — check current session
- `POST /api/auth/sign-up` — register
- `POST /api/auth/sign-in` — login
- `POST /api/auth/sign-out` — logout

**UI:**
- Simple form with email + password
- No email verification step
- On success → redirect to `/dashboard`
- On error → show inline error messages
- Loading state during submission

### Session Storage
- HTTP-only cookie (default BetterAuth behavior)
- Frontend reads session via `/api/auth/session`

---

## 4. Dashboard

### Layout
- Sidebar with navigation links
- Top bar with user info (name, email) and sign-out button
- Main content area

### Sections
1. **Recent Projects** — last 5 projects, card layout
2. **Recent Generations** — last 5 generations, card layout
3. **Upload History** — last 10 uploaded files, compact list

All sections use skeleton loading.

---

## 5. File Upload

### Behavior
- Drag & drop zone with dashed border
- File picker fallback (click to browse)
- Multiple file selection allowed
- Upload progress indicator per file (UploadThing)
- File type validation on client side before upload
- File size validation (max 10MB per file, enforced client+server)

### Supported File Types
- `.pdf`, `.docx`, `.txt`, `.md`
- `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`
- `.csv`, `.xlsx`, `.pptx`
- `.json`, `.xml`, `.yaml`, `.yml`, `.toml`
- `.js`, `.ts`, `.py`, `.java`, `.cpp`, `.c`, `.h`, `.rs`, `.go`, `.rb`, `.php`, `.swift`, `.kt`
- `.html`, `.css`, `.scss`, `.less`

### UploadThing Integration
- Frontend uploads files directly to UploadThing via their client SDK
- Returns `{ url, key, name, size, type }`
- Sends file metadata + UploadThing URL to FastAPI for processing

---

## 6. Generation Interface

### README Mode
1. User selects a project
2. Views list of uploaded files
3. Clicks "Generate README"
4. Sees real-time progress:
   - "Parsing files…"
   - "Analyzing content…"
   - "Planning structure…"
   - "Generating README…"
   - "Reviewing output…"
5. Final README rendered with live Markdown preview (split pane)
6. User can regenerate if unsatisfied

### Summary Mode
1. Same flow as README mode
2. Output is a structured summary instead of README
3. Summary sections: concepts, details, definitions, key points

### AI Input Component
Use `@kokonutui/ai-input-search` for additional AI interaction (e.g., custom instructions for generation).

---

## 7. Live Markdown Preview

- Renders Markdown in real-time using `react-markdown`
- Syntax highlighting for code blocks (rehype-highlight or similar)
- Split-pane layout: editor (read-only output) on left, preview on right
- On mobile: tab-based toggle between editor and preview

---

## 8. History

- Table or card list of previous generations
- Columns: Project name, type (README/Summary), date, status
- Click to view full output
- Download buttons per generation
- Generation history is immutable (never overwritten)

---

## 9. Export

| Format     | Implementation                                |
|------------|-----------------------------------------------|
| Markdown   | Download as `.md` file                        |
| TXT        | Strip Markdown, download as `.txt`            |
| PDF        | Convert via `html2pdf.js` or a backend API    |
| Clipboard  | Copy Markdown source to clipboard             |

---

## 10. UI / UX

### Design System
- **Dark-first** design (default dark mode, light mode toggle optional)
- **Glassmorphism** cards and panels
- **Rounded corners** (shadcn/ui default `rounded-lg`)
- **Framer Motion** for page transitions, hover effects, skeleton loading

### Components (shadcn/ui)
- `Button`, `Input`, `Label`, `Card`, `Badge`, `Avatar`
- `Dialog`, `Sheet`, `DropdownMenu`
- `Tabs`, `Table`, `Separator`
- `Skeleton`, `Progress`, `Toast`
- `Form` (react-hook-form + zod)

### State Management
- **Server state:** React Query (TanStack Query) for API calls to FastAPI
- **Auth state:** BetterAuth client (`better-auth/client`)
- **Form state:** React Hook Form + Zod

---

## 11. API Integration (FastAPI)

### Base URL
```
VITE_API_URL=http://localhost:8000 (dev)
VITE_API_URL=https://api.documento.app (prod)
```

### Endpoints Consumed

| Method | Endpoint                          | Purpose                          |
|--------|-----------------------------------|----------------------------------|
| GET    | `/api/v1/projects`                | List user projects               |
| POST   | `/api/v1/projects`                | Create project                   |
| GET    | `/api/v1/projects/{id}`           | Get project detail               |
| PATCH  | `/api/v1/projects/{id}`           | Rename project                   |
| DELETE | `/api/v1/projects/{id}`           | Delete project + files           |
| POST   | `/api/v1/projects/{id}/files`     | Register uploaded file           |
| DELETE | `/api/v1/projects/{id}/files/{fid}` | Delete file                   |
| POST   | `/api/v1/projects/{id}/generate`  | Trigger generation               |
| GET    | `/api/v1/generations`             | List user generations            |
| GET    | `/api/v1/generations/{id}`        | Get generation detail            |
| GET    | `/api/v1/generations/{id}/download?format=md` | Download output    |
| DELETE | `/api/v1/generations/{id}`        | Delete generation                |
| GET    | `/api/v1/user/profile`            | Get user profile                 |
| PATCH  | `/api/v1/user/profile`            | Update user profile              |
| DELETE | `/api/v1/user/data`               | GDPR data deletion               |
| GET    | `/api/v1/user/export`             | GDPR data portability            |

### Auth Token Passing
- Frontend reads BetterAuth session token via `authClient.getSession()`
- Sends token in `Authorization: Bearer <token>` header to FastAPI
- FastAPI validates the token via shared JWT secret

---

## 12. CCPA / GDPR Compliance

### Implementation
- **Cookie Consent Banner:** shown on first visit, stores preference in localStorage
- **Privacy Policy:** `/privacy` page with full disclosure of data collection
- **Terms of Service:** `/terms` page
- **Data Deletion:** Settings page → "Delete My Data" button → API call to delete all user data
- **Data Export:** Settings page → "Export My Data" → downloads a JSON archive
- **Consent Record:** Frontend stores consent timestamp and sends it with sign-up

### User-Facing Promises
- No data shared with third parties
- AI content is processed via Gemini API (Google) — data is not used for training
- User can delete all data at any time
- Session tokens expire after 7 days

---

## 13. Environment Variables

```env
# Next.js
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_UPLOADTHING_APP_ID=
UPLOADTHING_SECRET=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
```

---

## 14. Folder Structure

```
frontend/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/page.tsx
│   │   └── sign-up/page.tsx
│   ├── (marketing)/
│   │   ├── page.tsx
│   │   ├── privacy/page.tsx
│   │   └── terms/page.tsx
│   └── dashboard/
│       ├── layout.tsx
│       ├── page.tsx
│       ├── projects/
│       ├── history/
│       └── settings/page.tsx
├── components/
│   ├── ui/            (shadcn/ui components)
│   ├── auth/
│   ├── dashboard/
│   ├── upload/
│   ├── generation/
│   ├── preview/
│   ├── history/
│   └── layout/
├── lib/
│   ├── api.ts         (FastAPI client)
│   ├── auth.ts        (BetterAuth client)
│   └── uploadthing.ts
├── hooks/
├── types/
└── styles/
```
