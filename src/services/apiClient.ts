const API_BASE_URL = process.env.NEXT_API || "http://localhost:3000";

export async function apiFetch<T>(
    endPoint: string,
    options?: RequestInit
): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${endPoint}`, {
        ...options,
        headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    })


    if(!res.ok) {
        throw new Error(`API request failed: ${res.status} ${res.statusText}`)
    }

    return res.json() as Promise<T>
}