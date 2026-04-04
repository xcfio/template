import { spinner } from "@clack/prompts"
import degit from "degit"

export async function clone(name: string, template: string, force: boolean) {
    const Spinner = spinner()

    Spinner.start("Cloning repository")
    const emitter = degit(`xcfio/template/${template}`, { force, cache: true, verbose: true })

    await emitter.clone(name)
    Spinner.stop("Template cloned successfully")
}
