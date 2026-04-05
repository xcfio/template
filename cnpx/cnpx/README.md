# cnpx — Project Scaffolder

An interactive CLI tool for creating new projects from curated templates hosted on GitHub. Pick a category, pick a template, and get coding.

---

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [CLI Flags](#cli-flags)
- [Interactive Flow](#interactive-flow)
- [Templates](#templates)
- [Package Manager Detection](#package-manager-detection)
- [Auto-Update Check](#auto-update-check)
- [Validation](#validation)
- [Dependencies](#dependencies)
- [Development](#development)
- [Links & Community](#links--community)

---

## Installation

Install globally to use the `cnpx` command from anywhere.

**pnpm**

```bash
pnpm install -g @cnpx/cnpx
```

**npm**

```bash
npm install -g @cnpx/cnpx
```

**yarn**

```bash
yarn global add @cnpx/cnpx
```

> **Requires Node.js 22.5 or later.** Check your version with `node --version`.

Alternatively, run without installing:

```bash
npx @cnpx/cnpx
```

---

## Quick Start

> **Important:** The `cnpx` command works only if `@cnpx/cnpx` is installed globally. If you have not installed it globally, use `npx @cnpx/cnpx` instead.

Run `cnpx` with no arguments to launch the fully interactive prompt wizard:

```bash
cnpx
```

Or skip straight to a known template with flags:

```bash
cnpx --name my-app --template backend/fastify
```

---

## CLI Flags

All flags are optional. Any omitted value is collected interactively.

| Flag               | Type      | Description                                                                                                                                   |
| ------------------ | --------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `-n`, `--name`     | `string`  | Output directory / project name. Validated against filesystem rules — see [Validation](#validation).                                          |
| `-c`, `--category` | `string`  | Template category (top-level directory in the template repo). Skips the category selection prompt.                                            |
| `-t`, `--template` | `string`  | Template name. Accepts bare name (`starter`) or `category/template` slash syntax. Slash syntax also sets `--category`.                        |
| `-f`, `--force`    | `boolean` | Overwrite a non-empty target directory without prompting. Skips both the overwrite confirmation and the final "create project?" confirmation. |
| `-h`, `--help`     | `boolean` | Print the help message and exit. Also triggered by passing `help` as a bare argument.                                                         |

### Examples

```bash
# Fully interactive
cnpx

# Name only — prompts for category and template
cnpx --name my-project

# Slash syntax — sets both category and template
cnpx -t backend/fastify

# Category and template as separate flags
cnpx --category backend --template fastify

# All flags — no prompts at all
cnpx -n my-app -t backend/fastify -f

# Print help
cnpx --help
```

> **Note:** Unknown flags are silently ignored (`strict: false` parse mode). Only the flags listed above have any effect.

---

## Interactive Flow

When flags are omitted the CLI walks through a series of prompts in order:

```
update check → project name → overwrite? → category → template → confirm → clone
```

1. **Update check** — silently queries the npm registry. If a newer version of `@cnpx/cnpx` exists, a note is shown with the upgrade command. Non-blocking.

2. **Project name** — free-text prompt with default `my-project`. Validated in real-time. Skipped when `--name` is provided.

3. **Overwrite confirmation** — shown only when the target directory already exists _and_ is non-empty. Cancelling aborts. Skipped when `--force` is set.

4. **Category selection** — fetches top-level directories from the GitHub template repo and presents a `select` list. Skipped when `--category` or a slash-template is provided.

5. **Template selection** — fetches sub-directories for the chosen category. Skipped when `--template` is provided.

6. **Final confirmation** — summarises name, category, and template before cloning. Skipped when `--force` is set.

7. **Clone** — degit clones the template into the target directory, caching the result locally for faster re-runs.

> Pressing `Ctrl+C` at any prompt cancels cleanly with an "Operation cancelled" message and exits with code `0`.

---

## Templates

All templates live in the [xcfio/template](https://github.com/xcfio/template) GitHub repository. The directory structure is:

```
xcfio/template
├── <category>/
│   ├── <template-name>/
│   │   └── ... template files
│   └── <template-name>/
└── <category>/
    └── ...
```

The following top-level directories are always excluded from the category list:

- `.github`
- `cnpx`

Templates are cloned using **degit** with `cache: true`, so repeated clones of the same template are served from a local cache instead of re-downloading from GitHub.

> **API rate limits:** Template lists are fetched live from the GitHub Contents API. If you encounter `API rate limit exceeded`, wait a few minutes and try again. Authenticated requests are not currently supported.

---

## Package Manager Detection

cnpx auto-detects the best available package manager by probing in priority order:

```
pnpm → yarn → npm
```

Detection runs `pnpm --version` and `yarn --version` via `execSync`. The first one that succeeds wins. The result is cached after the first call so subsequent lookups are free.

The detected package manager is used in:

- The update-available note (`run: <pm> i -g @cnpx/cnpx`)
- The post-clone "get started" instructions

---

## Auto-Update Check

At startup, cnpx fetches the latest version from the npm registry:

```
GET https://registry.npmjs.org/@cnpx/cnpx/latest
```

Versions are compared with a custom semver parser that handles pre-release identifiers correctly (numeric parts compared numerically, string parts lexicographically). If the remote version is _newer_ than the running version, a note is displayed:

```
┌  Update available ───────────────╮
│                                  │
│  Current: 0.0.4 → Latest: 0.0.5  │
│  Run: pnpm i -g @cnpx/cnpx       │
│                                  │
└──────────────────────────────────╯
```

The check is non-blocking — any error (network failure, rate limit) is silently swallowed so it never interrupts the main flow.

---

## Validation

### Directory name rules

The project name is validated before any I/O happens. The following conditions cause an error:

| Rule                                                                        | Error message                                            |
| --------------------------------------------------------------------------- | -------------------------------------------------------- |
| Empty or only whitespace                                                    | `Directory name cannot be empty`                         |
| Longer than 255 characters                                                  | `Directory name is too long`                             |
| Contains `< > : " / \ \| ? *` or control characters                         | `Directory name contains invalid characters`             |
| Starts or ends with `.` or a space                                          | `Directory name cannot start or end with a dot or space` |
| Windows reserved names (`CON`, `PRN`, `AUX`, `NUL`, `COM0`–`9`, `LPT0`–`9`) | `Directory name is a reserved name`                      |

### Target path rules

After name validation, the resolved path is checked:

| Condition                        | Behaviour                                                        |
| -------------------------------- | ---------------------------------------------------------------- |
| Path does not exist              | Proceeds normally                                                |
| Path is an empty directory       | Proceeds normally (no overwrite prompt)                          |
| Path is a non-empty directory    | Overwrite confirmation prompt (or auto-continues with `--force`) |
| Path is a file (not a directory) | Hard error — exits with code `1`                                 |

### Exit codes

| Code | Meaning                                                                       |
| ---- | ----------------------------------------------------------------------------- |
| `0`  | Success or user-cancelled                                                     |
| `1`  | Validation error, target-is-file error, API rate limit, or uncaught exception |

---

## Dependencies

### Runtime

| Package          | Version   | Purpose                                                                            |
| ---------------- | --------- | ---------------------------------------------------------------------------------- |
| `@clack/prompts` | `^1.2.0`  | Beautiful interactive prompts — text, select, confirm, spinner, note, outro        |
| `colorette`      | `^2.0.20` | Zero-dependency terminal colour helpers (`blue`, `green`, `bold`, `dim`, `yellow`) |
| `degit`          | `^2.8.4`  | Fast git-based scaffolding without cloning full history; supports local caching    |

### Dev / Build

| Package        | Version   | Purpose                                                              |
| -------------- | --------- | -------------------------------------------------------------------- |
| `tsup`         | `^8.5.1`  | Zero-config TypeScript bundler; outputs CJS (`.js`) and ESM (`.mjs`) |
| `@types/degit` | `^2.8.6`  | TypeScript types for degit                                           |
| `@types/node`  | `^25.5.2` | TypeScript types for Node.js built-in APIs                           |

All runtime dependencies are pure-JS and work without native addons.

---

## Development

### Project structure

```
src/
├── bin.ts                  # Entry point — wires showHelp + main
├── main.ts                 # Orchestrates the full interactive flow
├── clone.ts                # Wraps degit clone with a spinner
├── checkForUpdate.ts       # npm registry version check + semver comparison
├── getCategories.ts        # GitHub API → category list
├── getTemplates.ts         # GitHub API → template list for a category
├── getPackageManager.ts    # pnpm / yarn / npm detection (cached)
├── isInvalidPath.ts        # Target path existence and type checks
├── isValidDirectoryName.ts # Name validation logic
├── fetch.ts                # Thin fetch wrapper returning typed JSON
└── showHelp.ts             # --help output
```

### npm scripts

| Script             | What it does                                             |
| ------------------ | -------------------------------------------------------- |
| `node --run dev`   | Runs `tsup --watch` — rebuilds on every file change      |
| `node --run build` | Runs `tsup` — produces the `out/` directory              |
| `node --run test`  | Runs `tsc --noEmit` — type-checks without emitting files |
| `node --run lint`  | Checks formatting with Prettier                          |
| `node --run fmt`   | Auto-formats all source files with Prettier              |

### Module format

The package sets `"type": "commonjs"` but ships both CJS (`index.js`) and ESM (`index.mjs`) via the `exports` map, so it works with both `require()` and `import`.

```json
"exports": {
  ".": {
    "import": "./out/index.mjs",
    "require": "./out/index.js"
  }
}
```

### Publishing

The package is published publicly to npm under the `latest` tag:

```json
"publishConfig": {
  "access": "public",
  "tag": "latest"
}
```

---

## Links & Community

| Resource          | URL                                                          |
| ----------------- | ------------------------------------------------------------ |
| GitHub repository | https://github.com/xcfio/template                            |
| npm package       | https://www.npmjs.com/package/@cnpx/cnpx                     |
| Homepage          | https://github.com/xcfio/template/tree/main/cnpx/cnpx#readme |
| Bug reports       | https://github.com/xcfio/template/issues                     |
| Bug report email  | omarfaruksxp@gmail.com                                       |

### Discord

Join the community on Discord for help, template sharing, and discussion:

**https://discord.gg/FaCCaFM74Q**

---

Made with ❤️ by [xcfio](https://github.com/xcfio)

_If cnpx saves you time, consider leaving a star on the [GitHub repo](https://github.com/xcfio/template)._
