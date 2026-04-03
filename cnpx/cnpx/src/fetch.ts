export async function get<T>(url: string): Promise<{ req: Response; data: T }> {
    const req = await fetch(url)
    const data = (await req.json()) as T
    return { req, data }
}
