export type FilteredGithubResponse = Array<{ name: string; url: string }>
export type GithubAPIResponse =
    | { message: string }
    | Array<{
          name: string
          path: string
          sha: string
          size: number
          url: string
          html_url: string
          git_url: string
          download_url: null | string
          type: "dir" | "file"
          _links: {
              self: string
              git: string
              html: string
          }
      }>
