import { existsSync, mkdirSync } from "node:fs"
import { SQLiteCache } from "sqlite-cache"
import { homedir } from "node:os"
import { join } from "node:path"

const cacheDir = join(homedir(), ".cnpx")
if (!existsSync(cacheDir)) mkdirSync(cacheDir, { recursive: true })

export const fetchCache = new SQLiteCache({
    path: join(cacheDir, "fetch-cache.db"),
    ttl: 86400000,
    max: 100
})
