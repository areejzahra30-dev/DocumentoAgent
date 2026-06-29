# Documento Agent — Frontend Setup Guide

**Stack:** Next.js 15 + React 19 + TailwindCSS + shadcn/ui + BetterAuth + UploadThing

---

## Prerequisites

- Node.js 20+ (LTS)
- pnpm (recommended) or npm or yarn
- A Neon PostgreSQL database (shared with backend)
- An UploadThing account (free tier)
- BetterAuth configuration (see below)

---

## Step 1: Create Next.js Project

```bash
npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd frontend
```

---

## Step 2: Install Dependencies

```bash
# UI & styling
npm install tailwindcss @tailwindcss/typography framer-motion lucide-react
npx shadcn@latest init
npx shadcn@latest add button input label card badge avatar dialog sheet dropdown-menu tabs table separator skeleton progress toast form

# Forms
npm install react-hook-form @hookform/resolvers zod

# Markdown
npm install react-markdown remark-gfm rehype-highlight rehype-raw

# Auth
npm install better-auth @better-auth/next-js

# AI input component
npx shadcn@latest add @kokonutui/ai-input-search

# Upload
npm install uploadthing @uploadthing/react

# HTTP client
npm install @tanstack/react-query

# PDF export (optional client-side)
npm install html2pdf.js
```

---

## Step 3: Configure BetterAuth

### 3.1 Create auth config

`src/lib/auth.ts`:
```ts
import { betterAuth } from "better-auth"
import { nextJsMiddleware } from "@better-auth/next-js"

export const auth = betterAuth({
  database: {
    provider: "postgres",
    url: process.env.DATABASE_URL!,
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  session: {
    expiresIn: 7 * 24 * 60 * 60, // 7 days
  },
  plugins: [nextJsMiddleware()],
})
```

### 3.2 Create API route

`src/app/api/auth/[...all]/route.ts`:
```ts
import { auth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"

export const { POST, GET } = toNextJsHandler(auth)
```

### 3.3 Auth client

`src/lib/auth-client.ts`:
```ts
import { createAuthClient } from "better-auth/client"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL!,
})
```

---

## Step 4: Configure UploadThing

`src/lib/uploadthing.ts`:
```ts
import { createUploadThing } from "@uploadthing/react"

export const { useUploadThing, uploadFiles } = createUploadThing({
  appId: process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID!,
})
```

---

## Step 5: Configure API Client

`src/lib/api.ts`:
```ts
import { authClient } from "./auth-client"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

async function getAuthHeaders(): Promise<HeadersInit> {
  const session = await authClient.getSession()
  if (!session?.data?.session?.token) return {}
  return { Authorization: `Bearer ${session.data.session.token}` }
}

export async function apiClient<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const headers = await getAuthHeaders()
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...headers, ...options?.headers, "Content-Type": "application/json" },
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}
```

---

## Step 6: Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-better-auth-secret-min-32-chars
BETTER_AUTH_URL=http://localhost:3000
DATABASE_URL=postgres://user:pass@neon-host/docagent
NEXT_PUBLIC_UPLOADTHING_APP_ID=your-uploadthing-app-id
UPLOADTHING_SECRET=your-uploadthing-secret
```

---

## Step 7: Run Development Server

```bash
npm run dev
# → http://localhost:3000
```

---

## Connecting to Backend

The frontend communicates with the Python FastAPI backend at `http://localhost:8000` (configurable via `NEXT_PUBLIC_API_URL`).

**Flow:**
1. Auth: BetterAuth handles sign-up/sign-in via Next.js API routes
2. Session token: Frontend reads token from BetterAuth client
3. API calls: Frontend sends token as `Authorization: Bearer <token>` to FastAPI
4. File upload: Frontend uploads directly to UploadThing, then registers file metadata with FastAPI
5. Generation: Frontend triggers AI pipeline via FastAPI, polls for status

**CORS:** FastAPI must allow requests from `http://localhost:3000`.

---

## Production Build

```bash
npm run build
npm start
# → http://localhost:3000
```
