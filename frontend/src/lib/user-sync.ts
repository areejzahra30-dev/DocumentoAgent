import { authClient } from "./auth-client"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function syncUserToBackend(): Promise<void> {
  try {
    const session = await authClient.getSession()
    if (!session?.data?.user) return

    const { id, email, name } = session.data.user

    await fetch(`${API_URL}/api/v1/users/sync`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, email, name }),
    })
  } catch {
    // Sync is best-effort — don't block the user
  }
}
