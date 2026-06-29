import { authClient } from "./auth-client"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function getToken(): Promise<string | null> {
  const session = await authClient.getSession()
  return session?.data?.session?.token ?? null
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await getToken()
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }
  if (!headers["Content-Type"] && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json"
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  })

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.detail || `Request failed: ${res.status}`)
  }

  if (res.status === 204) return undefined as T
  return res.json()
}
