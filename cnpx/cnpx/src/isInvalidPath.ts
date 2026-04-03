import { existsSync, readdirSync, statSync } from "node:fs"

export function isInvalidPath(path: string): boolean | null {
    if (!existsSync(path)) return null
    if (!statSync(path).isDirectory()) return false

    const dir = readdirSync(path)
    return dir.length ? true : null
}
