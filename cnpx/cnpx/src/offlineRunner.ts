import { cancel, note, outro } from "@clack/prompts"
import { getPackageManager } from "./getPackageManager"
import { getProjectName } from "./getProjectName"
import { confirmProject } from "./confirmProject"
import { parseTemplate } from "./parseTemplate"
import { gray } from "colorette"
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
    const forceBool = Boolean(force)

    const projectName = await getProjectName(name)
    if (!projectName) return process.exit(0)

    const templates = parseTemplate(category, template)

    if (!templates[0] || !templates[1]) {
        cancel("Offline mode requires a specific template.")
        return process.exit(1)
    }

    if (!(await confirmProject(projectName, templates[0], templates[1], forceBool))) {
        return process.exit(0)
    }

    await clone(projectName, `${templates.join("/")}`, forceBool)
    note(`cd ${projectName}\n${getPackageManager()} install\nnode --run dev`, "To get started, run:")
    outro(
        `Thanks for using cnpx! If you have any issues or feedback, please open an issue at ${gray("https://github.com/xcfio/template/issues")}`
    )
}
