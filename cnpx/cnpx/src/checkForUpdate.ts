import { getPackageManager } from "./getPackageManager"
import { name, version } from "../package.json"
import { note, spinner } from "@clack/prompts"
import { bold } from "colorette"
import { get } from "./fetch"
import { lte } from "semver"

export async function checkForUpdate() {
    const Spinner = spinner()
    Spinner.start("Checking for updates")
    try {
        const { data } = await get<{ version: string }>(`https://registry.npmjs.org/${name}/latest`)
        Spinner.clear()

        if (lte(data.version, version)) return
        note(
            `Current: ${bold(version)} → Latest: ${bold(data.version)}\nRun: ${getPackageManager()} i -g ${name}`,
            "Update available"
        )
    } catch {
        if (!Spinner.isCancelled) Spinner.clear()
    }
}
