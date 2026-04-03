# @cnpx/cnpx

`@cnpx/cnpx` is an interactive CLI that scaffolds projects from the
[`xcfio/template`](https://github.com/xcfio/template) repository.

It fetches available categories and templates from GitHub, clones your selected
template into a local directory, and prints the next commands to run.

## Features

- Interactive prompts for project name, category, and template
- Live template discovery from `xcfio/template`
- Automatic package manager detection (`pnpm`, `yarn`, then `npm`)
- Update notification when a newer package version exists on npm

## Requirements

- Node.js 22+
- Internet access (GitHub API + npm registry)

## Usage

Run directly without installing globally:

```bash
npx @cnpx/cnpx
# or
pnpm dlx @cnpx/cnpx
# or
yarn dlx @cnpx/cnpx
```

Then follow the prompts:

1. Enter project name
2. Select a category (for example: `backend`, `frontend`)
3. Select a template
4. Confirm creation

After scaffold, the CLI prints:

```bash
cd <project-name>
<detected-package-manager> install
node --run dev
```

## Global Install (Optional)

```bash
npm i -g @cnpx/cnpx
cnpx
```

## Programmatic API

This package also exports utility functions:

- `main()`
- `checkForUpdate()`
- `clone(name, category, template)`
- `getCategories()`
- `getTemplates(category)`
- `getPackageManager()`
- `get(url)`

Type exports:

- `FilteredGithubResponse`
- `GithubAPIResponse`

## Development

From `cnpx/cnpx`:

```bash
node --run install
node --run dev
node --run build
node --run test
```

Available scripts:

- `node --run fmt` - format source with Prettier
- `node --run lint` - check formatting
- `node --run dev` - build in watch mode with tsup
- `node --run build` - production build
- `node --run test` - type-check with `tsc --noEmit`

## Notes and Limitations

- The CLI is currently fully interactive and does not expose command-line flags.
- GitHub API rate limits can block category/template loading.

## Support

- Issues: [GitHub Issues](https://github.com/xcfio/template/issues)
- Discord: [Discord Server](https://discord.gg/FaCCaFM74Q)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ by [xcfio](https://github.com/xcfio)
