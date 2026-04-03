import { spinner } from "@clack/prompts"
import degit from "degit"

export async function clone(name: string, type: string, template: string) {
    const Spinner = spinner()

    Spinner.start("Cloning repository")
    const emitter = degit(`xcfio/template/${type}/${template}`, { cache: true, force: true, verbose: true })

    await emitter.clone(name)
    Spinner.stop("Template cloned successfully")
}
