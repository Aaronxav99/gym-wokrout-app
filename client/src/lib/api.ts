/** Training Ledger design reminder: API calls are quiet, direct, and safely fall back to the local training log. */
const API_BASE_URL = (import.meta.env.VITE_WORKOUT_API_URL as string | undefined) ?? (import.meta.env.DEV ? "http://localhost:8000/api/v1" : "");

export const apiBaseUrl = API_BASE_URL;

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_BASE_URL) throw new Error("No remote API is configured for this static deployment.");
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  if (!response.ok) {
    const detail = await response.json().catch(() => ({}));
    throw new Error(detail.detail || `Request failed with ${response.status}`);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export async function tryApi<T>(path: string, init?: RequestInit): Promise<T | undefined> {
  try {
    return await apiRequest<T>(path, init);
  } catch {
    return undefined;
  }
}
