import { intro, outro, confirm, select, spinner, isCancel, cancel, text, note } from "@clack/prompts"
import { getPackageManager } from "./getPackageManager"
import { checkForUpdate } from "./checkForUpdate"
import { getCategories } from "./getCategories"
import { blue, bold, yellow } from "colorette"
import { getTemplates } from "./getTemplates"
import { clone } from "./clone"

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

    await clone(name, projectCategory, projectTemplate)
    note(`cd ${name}\n${getPackageManager()} install\nnode --run dev`, "To get started, run:")
    outro(`⭐ Give a ${yellow("star")} on GitHub: https://github.com/xcfio/template`)
}
