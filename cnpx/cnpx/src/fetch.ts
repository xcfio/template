import { fetchCache } from "./cache"

export async function get<T>(url: string): Promise<{ req: Response; data: T }> {
    if (fetchCache.has(url)) return { req: new Response(), data: fetchCache.get(url) as T }

    const req = await fetch(url)
    const data = (await req.json()) as T

    if (req.ok) fetchCache.set(url, data as any)
    return { req, data }
}
