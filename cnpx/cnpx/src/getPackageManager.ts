import { execSync } from "node:child_process"

let packageManager: "npm" | "yarn" | "pnpm"

export function getPackageManager(): "npm" | "yarn" | "pnpm" {
    if (packageManager) return packageManager

    try {
        execSync("pnpm --version", { stdio: "ignore" })
        packageManager = "pnpm"
        return "pnpm"
    } catch {}

    try {
        execSync("yarn --version", { stdio: "ignore" })
        packageManager = "yarn"
        return "yarn"
    } catch {}

    packageManager = "npm"
    return "npm"
}
