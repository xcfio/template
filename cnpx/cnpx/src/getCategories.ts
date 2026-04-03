import { GithubAPIResponse, FilteredGithubResponse } from "./type"
import { spinner } from "@clack/prompts"
import { get } from "./fetch"

export const IgnoredDirectory = new Set<string>([".github", "cnpx"])

export async function getCategories(): Promise<FilteredGithubResponse> {
    const Spinner = spinner()

    Spinner.start("Fetching Categories")
    const { data } = await get<GithubAPIResponse>("https://api.github.com/repos/xcfio/template/contents?ref=main")

    if ("message" in data) {
        if (data.message.startsWith("API rate limit exceeded")) {
            Spinner.error("API rate limit exceeded. Please try again later.")
        } else {
            Spinner.error("An unknown error occurred")
            console.log(data.message)
            console.trace()
        }
        process.exit(1)
    }

    const filtered = data.filter((x) => x.type === "dir" && !IgnoredDirectory.has(x.name))
    const shorted = filtered.map((x) => ({ name: x.name, url: x.url }))

    Spinner.clear()
    return shorted
}
