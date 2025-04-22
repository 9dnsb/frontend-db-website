import { fetchData } from '@/lib/fetchData'

export type OneOffPuzzle = {
  slug: string
  publishedDate: string
  startingWord: string
  validAnswers: { word: string }[]
}

type APIResponse = { docs: OneOffPuzzle[] }

export async function loadOneOffPuzzle(slug: string) {
  const data = await fetchData<APIResponse>(
    `/api/oneoffpuzzles?where[slug][equals]=${slug}`
  )

  return data.docs?.[0] || null
}
