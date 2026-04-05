import { isValidDirectoryName } from "./isValidDirectoryName"
import { cancel, isCancel, text } from "@clack/prompts"

export async function getProjectName(initialName?: string | boolean): Promise<string | null> {
    if (typeof initialName === "string") {
        const isValidName = isValidDirectoryName(initialName)
        if (typeof isValidName === "string") {
            cancel(isValidName)
            return null
        }
        return initialName
    }

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
        return null
    }

    return newName
}
