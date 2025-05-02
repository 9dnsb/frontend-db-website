export async function fetchData<T>(url: string): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL
  const res = await fetch(`${baseUrl}${url}`, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
    },
    cache: 'no-store', // ⬅️ disables caching entirely
  })

  if (!res.ok) {
    throw new Error(`Fetch failed: ${res.status} ${res.statusText}`)
  }

  return res.json()
}
