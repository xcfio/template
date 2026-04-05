export function parseTemplate(category?: string | boolean, template?: string | boolean): [string, string] {
    const result: [string, string] = ["", ""]

    if (typeof category === "string") result[0] = category
    if (typeof template === "string") {
        if (template.includes("/")) {
            const [cat, tpl] = template.split("/")
            result[0] = cat
            result[1] = tpl
        } else {
            result[1] = template
        }
    }

    return result
}
