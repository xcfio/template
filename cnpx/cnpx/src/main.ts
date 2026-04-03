import { intro, outro, confirm, select, spinner, isCancel, cancel, text, note } from "@clack/prompts"
import { getPackageManager } from "./getPackageManager"
import { blue, bold, green, yellow } from "colorette"
import { checkForUpdate } from "./checkForUpdate"
import { isInvalidPath } from "./isInvalidPath"
import { getCategories } from "./getCategories"
import { getTemplates } from "./getTemplates"
import { clone } from "./clone"
import { join } from "node:path"

export async function main() {
    intro(blue("Create a new project"))

    const updateSpinner = spinner()
    updateSpinner.start("Checking for updates")
    await checkForUpdate()
    updateSpinner.clear()

    const name = await text({
        message: "Project Name",
        placeholder: "my-project",
        defaultValue: "my-project"
    })

    if (isCancel(name)) {
        cancel("Operation cancelled")
        return process.exit(0)
    }

    const invalid = isInvalidPath(join(process.cwd(), name))

    let force = false
    if (invalid !== null) {
        if (invalid) {
            const overwrite = await confirm({
                message: `Directory ${green(name)} already exists. Do you want to overwrite it?`
            })

            if (isCancel(overwrite) || !overwrite) {
                cancel("Operation cancelled")
                return process.exit(0)
            } else {
                force = true
            }
        } else {
            cancel(`${green(name)} is a file. Please choose a different project name.`)
            return process.exit(1)
        }
    }

    const categories = await getCategories()
    const projectCategory = await select({
        message: "Select a category",
        options: categories.map((x) => ({ name: x.name, value: x.name }))
    })

    if (isCancel(projectCategory)) {
        cancel("Operation cancelled")
        return process.exit(0)
    }

    const templates = await getTemplates(projectCategory)
    const projectTemplate = await select({
        message: "Select a template",
        options: templates.map((x) => ({ name: x.name, value: x.name }))
    })

    if (isCancel(projectTemplate)) {
        cancel("Operation cancelled")
        return process.exit(0)
    }

    const confirmProject = await confirm({
        message: `Create project with name: ${bold(name)}, category: ${bold(projectCategory)}, template: ${bold(projectTemplate)}?`
    })

    if (isCancel(confirmProject) || !confirmProject) {
        cancel("Operation cancelled")
        return process.exit(0)
    }

    await clone(name, projectCategory, projectTemplate, force)
    note(`cd ${name}\n${getPackageManager()} install\nnode --run dev`, "To get started, run:")
    outro(`Thanks for using template! ⭐ Give a ${yellow("star")} on GitHub: https://github.com/xcfio/template`)
}
