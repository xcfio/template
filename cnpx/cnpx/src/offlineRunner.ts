import { cancel, confirm, isCancel, note, outro, text } from "@clack/prompts"
import { isValidDirectoryName } from "./isValidDirectoryName"
import { getPackageManager } from "./getPackageManager"
import { bold, gray } from "colorette"
import { clone } from "./clone"

export async function offlineRunner({
    category,
    template,
    name,
    force
}: {
    category?: string | boolean
    template?: string | boolean
    name?: string | boolean
    force?: string | boolean
}) {
    note("Running in offline mode. Make sure you have cached templates available.", "Warning")
    const templates: [string, string] = ["", ""]
    force = Boolean(force)

    if (typeof name === "string") {
        const isValidName = isValidDirectoryName(name)
        if (typeof isValidName === "string") {
            cancel(isValidName)
            return process.exit(1)
        }
    } else {
        const newName = await text({
            message: "Project Name",
            placeholder: "my-project",
            defaultValue: "my-project",
            validate: (value) => {
                if (!value) return
                const result = isValidDirectoryName(value)
                if (typeof result === "string") return new Error(result)
            }
        })

        if (isCancel(newName)) {
            cancel("Operation cancelled")
            return process.exit(0)
        } else {
            name = newName
        }
    }

    if (typeof category === "string") templates[0] = category
    if (typeof template === "string") {
        if (template.includes("/")) {
            const [category, templateName] = template.split("/")

            templates[0] = category
            templates[1] = templateName
        } else {
            templates[1] = template
        }
    }

    if (!templates[0] || !templates[1]) {
        cancel("Offline mode requires a specific template.")
        return process.exit(1)
    }

    if (force !== true) {
        const confirmProject = await confirm({
            message: `Create project with name: ${bold(name)}, category: ${bold(templates[0])}, template: ${bold(templates[1])}?`
        })

        if (isCancel(confirmProject) || !confirmProject) {
            cancel("Operation cancelled")
            return process.exit(0)
        }
    }

    await clone(name, `${templates.join("/")}`, force)
    note(`cd ${name}\n${getPackageManager()} install\nnode --run dev`, "To get started, run:")
    outro(
        `Thanks for using cnpx! If you have any issues or feedback, please open an issue at ${gray("https://github.com/xcfio/template/issues")}`
    )
}
