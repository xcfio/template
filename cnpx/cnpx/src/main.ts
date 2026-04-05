import { intro, outro, select, isCancel, cancel, note, confirm } from "@clack/prompts"
import { getPackageManager } from "./getPackageManager"
import { confirmProject } from "./confirmProject"
import { getProjectName } from "./getProjectName"
import { checkForUpdate } from "./checkForUpdate"
import { getCategories } from "./getCategories"
import { isInvalidPath } from "./isInvalidPath"
import { parseTemplate } from "./parseTemplate"
import { offlineRunner } from "./offlineRunner"
import { getTemplates } from "./getTemplates"
import { blue, gray, green, yellow } from "colorette"
import { parseArgs } from "node:util"
import { clone } from "./clone"
import { join } from "node:path"

export async function main() {
    intro(blue("cnpx - Create a new project from a template"))

    const { values: flags } = parseArgs({
        args: process.argv.slice(2),
        strict: false,
        options: {
            category: { type: "string", short: "c" },
            template: { type: "string", short: "t" },
            name: { type: "string", short: "n" },
            force: { type: "boolean", short: "f" },
            offline: { type: "boolean", short: "o" }
        }
    })

    const [major, minor] = process.versions.node.split(".").map((x) => parseInt(x))
    if (major < 22 || (major === 22 && minor < 5) || true) {
        note(
            "Node.js v22.5.0 or higher is required. Versions below this will stop working from the next release. Please update your Node.js.",
            `${yellow("Warning")}`
        )
    }

    if (flags.offline === true) return await offlineRunner({ ...flags })

    const projectName = await getProjectName(flags.name)
    if (!projectName) return process.exit(0)

    let template = parseTemplate(flags.category, flags.template)

    await checkForUpdate()

    const invalid = isInvalidPath(join(process.cwd(), projectName))

    let force = typeof flags.force === "boolean" ? flags.force : false
    if (invalid !== null) {
        if (invalid) {
            if (flags.force !== true) {
                const overwrite = await confirm({
                    message: `Directory ${green(projectName)} already exists. Do you want to overwrite it?`
                })

                if (isCancel(overwrite) || !overwrite) {
                    cancel("Operation cancelled")
                    return process.exit(0)
                }
            }
        } else {
            cancel(`${projectName} is a file. Please choose a different project name.`)
            return process.exit(1)
        }
    }

    const categories = await getCategories()
    const projectCategory =
        template[0] ||
        (await select({
            message: "Select a category",
            options: categories.map((x) => ({ name: x.name, value: x.name }))
        }))

    if (isCancel(projectCategory)) {
        cancel("Operation cancelled")
        return process.exit(0)
    } else {
        template[0] = projectCategory
    }

    const templates = await getTemplates(projectCategory)
    const projectTemplate =
        template[1] ||
        (await select({
            message: "Select a template",
            options: templates.map((x) => ({ name: x.name, value: x.name }))
        }))

    if (isCancel(projectTemplate)) {
        cancel("Operation cancelled")
        return process.exit(0)
    } else {
        template[1] = projectTemplate
    }

    if (!(await confirmProject(projectName, template[0], template[1], force))) {
        return process.exit(0)
    }

    await clone(projectName, `${template.join("/")}`, force)
    note(`cd ${projectName}\n${getPackageManager()} install\nnode --run dev`, "To get started, run:")
    outro(
        `Thanks for using cnpx! If you have any issues or feedback, please open an issue at ${gray("https://github.com/xcfio/template/issues")}`
    )
}
