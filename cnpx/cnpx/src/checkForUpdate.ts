import { getPackageManager } from "./getPackageManager"
import { name, version } from "../package.json"
import { note } from "@clack/prompts"
import { bold } from "colorette"
import { get } from "./fetch"

type ParsedSemver = {
    major: number
    minor: number
    patch: number
    pre: string[]
}

function parseSemver(value: string): ParsedSemver | null {
    const match = /^v?(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/.exec(value)
    if (!match) return null

    return {
        major: Number(match[1]),
        minor: Number(match[2]),
        patch: Number(match[3]),
        pre: match[4] ? match[4].split(".") : []
    }
}

function compareIdentifier(left: string, right: string): number {
    const leftNumeric = /^\d+$/.test(left)
    const rightNumeric = /^\d+$/.test(right)

    if (leftNumeric && rightNumeric) {
        const a = Number(left)
        const b = Number(right)
        if (a < b) return -1
        if (a > b) return 1
        return 0
    }

    if (leftNumeric && !rightNumeric) return -1
    if (!leftNumeric && rightNumeric) return 1

    if (left < right) return -1
    if (left > right) return 1
    return 0
}

function compareSemver(left: string, right: string): number {
    const a = parseSemver(left)
    const b = parseSemver(right)

    // Fall back to numeric-aware string compare for non-semver inputs.
    if (!a || !b) {
        return left.localeCompare(right, undefined, { numeric: true, sensitivity: "base" })
    }

    if (a.major !== b.major) return a.major < b.major ? -1 : 1
    if (a.minor !== b.minor) return a.minor < b.minor ? -1 : 1
    if (a.patch !== b.patch) return a.patch < b.patch ? -1 : 1

    if (a.pre.length === 0 && b.pre.length === 0) return 0
    if (a.pre.length === 0) return 1
    if (b.pre.length === 0) return -1

    const length = Math.max(a.pre.length, b.pre.length)
    for (let i = 0; i < length; i++) {
        const leftPart = a.pre[i]
        const rightPart = b.pre[i]

        if (leftPart === undefined) return -1
        if (rightPart === undefined) return 1

        const result = compareIdentifier(leftPart, rightPart)
        if (result !== 0) return result
    }

    return 0
}

export async function checkForUpdate() {
    try {
        const { data } = await get<{ version: string }>(`https://registry.npmjs.org/${name}/latest`)
        if (compareSemver(data.version, version) <= 0) return

        note(
            `Current: ${bold(version)} → Latest: ${bold(data.version)}\nRun: ${getPackageManager()} i -g ${name}`,
            "Update available"
        )
    } catch {}
}
