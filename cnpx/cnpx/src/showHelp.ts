import { blue, bold, green, dim } from "colorette"

export function showHelp(): never {
    console.log(`
    ${blue(bold("cnpx"))} - Create a new project from a template

    ${bold("Options:")}
        ${green("-n, --name")}      ${dim("Project name")}
        ${green("-c, --category")}  ${dim("Template category")}
        ${green("-t, --template")}  ${dim("Template name")}
        ${green("-f, --force")}     ${dim("Overwrite existing directory")}
        ${green("-o, --offline")}   ${dim("Run in offline mode (using cached templates)")}
        ${green("-h, --help")}      ${dim("Show help")}
`)
    process.exit(0)
}
