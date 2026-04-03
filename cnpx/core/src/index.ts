#!/usr/bin/env node

export { version } from "../package.json"
import { intro, outro, confirm, select, spinner, isCancel, cancel, text } from "@clack/prompts"
import { blue, inverse } from "colorette"
import degit from "degit"

async function main() {
    intro(blue("Create a new project"))

    const name = await text({ message: "Project Name", placeholder: "Cool" })

    if (isCancel(name)) {
        cancel("Operation cancelled")
        return process.exit(0)
    }

    const projectType = await select({
        message: "Pick a project type.",
        options: [
            { value: "ts", label: "TypeScript" },
            { value: "js", label: "JavaScript" },
            { value: "coffee", label: "CoffeeScript", hint: "oh no" }
        ]
    })

    if (isCancel(projectType)) {
        cancel("Operation cancelled")
        return process.exit(0)
    }

    const s = spinner()
    s.start("Installing via npm")

    s.stop("Installed via npm")

    outro("You're all set!")
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})
