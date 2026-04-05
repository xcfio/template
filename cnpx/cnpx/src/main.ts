import { intro, outro, confirm, select, isCancel, cancel, text, note } from "@clack/prompts"
import { isValidDirectoryName } from "./isValidDirectoryName"
import { getPackageManager } from "./getPackageManager"
import { blue, bold, gray, green } from "colorette"
import { checkForUpdate } from "./checkForUpdate"
import { isInvalidPath } from "./isInvalidPath"
import { getCategories } from "./getCategories"
import { offlineRunner } from "./offlineRunner"
import { getTemplates } from "./getTemplates"
import { parseArgs } from "node:util"
import { clone } from "./clone"
import { join } from "node:path"

export async function main() {
    intro(blue("cnpx - Create a new project from a template"))

    const template: [string, string] = ["", ""]

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

    if (flags.offline === true) return await offlineRunner({ ...flags })
    if (typeof flags.name === "string") {
        const isValidName = isValidDirectoryName(flags.name)
        if (typeof isValidName === "string") {
            cancel(isValidName)
            return process.exit(1)
        }
    }

    if (typeof flags.category === "string") template[0] = flags.category
    if (typeof flags.template === "string") {
        if (flags.template.includes("/")) {
            const [category, templateName] = flags.template.split("/")

            template[0] = category
            template[1] = templateName
        } else {
            template[1] = flags.template
        }
    }

    await checkForUpdate()

    const name =
        typeof flags.name === "string"
            ? flags.name
            : await text({
                  message: "Project Name",
                  placeholder: "my-project",
                  defaultValue: "my-project",
                  validate: (value) => {
                      if (!value) return
                      const result = isValidDirectoryName(value)
                      if (typeof result === "string") return new Error(result)
                  }
              })

    if (isCancel(name)) {
        cancel("Operation cancelled")
        return process.exit(0)
    }

    const invalid = isInvalidPath(join(process.cwd(), name))

    let force = typeof flags.force === "boolean" ? flags.force : false
    if (invalid !== null) {
        if (invalid) {
            if (flags.force !== true) {
                const overwrite = await confirm({
                    message: `Directory ${green(name)} already exists. Do you want to overwrite it?`
                })

                if (isCancel(overwrite) || !overwrite) {
                    cancel("Operation cancelled")
                    return process.exit(0)
                }
            }
            force = true
        } else {
            cancel(`${green(name)} is a file. Please choose a different project name.`)
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

    if (flags.force !== true) {
        const confirmProject = await confirm({
            message: `Create project with name: ${bold(name)}, category: ${bold(template[0])}, template: ${bold(template[1])}?`
        })

        if (isCancel(confirmProject) || !confirmProject) {
            cancel("Operation cancelled")
            return process.exit(0)
        }
    }

    await clone(name, `${template.join("/")}`, force)
    note(`cd ${name}\n${getPackageManager()} install\nnode --run dev`, "To get started, run:")
    outro(
        `Thanks for using cnpx! If you have any issues or feedback, please open an issue at ${gray("https://github.com/xcfio/template/issues")}`
    )
}
