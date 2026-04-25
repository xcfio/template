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
import { defineCommand, runMain } from "citty"
import { blue, gray, green } from "colorette"
import { clone } from "./clone"
import { join } from "node:path"

const main = defineCommand({
    meta: {
        name: "cnpx",
        description: "Create a new project from a template"
    },
    args: {
        category: { type: "string", alias: "c", description: "Template category" },
        template: { type: "string", alias: "t", description: "Template name" },
        name: { type: "string", alias: "n", description: "Project name" },
        force: { type: "boolean", alias: "f", description: "Overwrite existing directory" },
        offline: { type: "boolean", alias: "o", description: "Use offline mode" }
    },
    async run({ args: flags }) {
        intro(blue("cnpx - Create a new project from a template"))

        if (flags.offline) return await offlineRunner({ ...flags })

        const projectName = await getProjectName(flags.name)
        if (!projectName) return process.exit(0)

        let template = parseTemplate(flags.category, flags.template)

        await checkForUpdate()

        const invalid = isInvalidPath(join(process.cwd(), projectName))

        let force = typeof flags.force === "boolean" ? flags.force : false
        if (invalid !== null) {
            if (invalid) {
                if (!flags.force) {
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
            template[0] = projectCategory as string
        }

        const templates = await getTemplates(projectCategory as string)
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
            template[1] = projectTemplate as string
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
})

runMain(main)
