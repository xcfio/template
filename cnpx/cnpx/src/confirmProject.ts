import { cancel, confirm, isCancel } from "@clack/prompts"
import { bold } from "colorette"

export async function confirmProject(
    name: string,
    category: string,
    template: string,
    force: boolean
): Promise<boolean> {
    if (force) return true

    const confirmResult = await confirm({
        message: `Create project with name: ${bold(name)}, category: ${bold(category)}, template: ${bold(template)}?`
    })

    if (isCancel(confirmResult) || !confirmResult) {
        cancel("Operation cancelled")
        return false
    }

    return true
}
