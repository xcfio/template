# template

A collection of application templates for Fastify, Next.js, Node.js, React, and SolidJS.

## Templates

| Name                                       | Description                                               |
| ------------------------------------------ | --------------------------------------------------------- |
| [fastify](backend/fastify)                 | Fastify API with TypeScript, Drizzle ORM, JWT, and Docker |
| [fastify-netlify](backend/fastify-netlify) | Fastify API adapted for Netlify deployment                |
| [next](frontend/next)                      | Next.js with Tailwind CSS                                 |
| [nodejs](backend/nodejs)                   | Node.js with TypeScript and Docker                        |
| [react](frontend/react)                    | React with Tailwind CSS                                   |
| [solid](frontend/solid)                    | SolidJS with Tailwind CSS                                 |
| [solidstart](frontend/solidstart)          | SolidStart with Tailwind CSS                              |

## Usage

Scaffold a template into a new directory using [@cnpx/cnpx](cnpx/cnpx):

```bash
# Interactive mode
pnpm dlx @cnpx/cnpx
```

Or skip straight to a known template with CLI flags:

```bash
pnpm dlx @cnpx/cnpx --name my-app --template backend/fastify
```

**Available CLI Flags:**

| Flag         | Short | Description                                                                                                                                   |
| ------------ | ----- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `--name`     | `-n`  | Output directory / project name.                                                                                                              |
| `--category` | `-c`  | Template category (top-level directory in the template repo). Skips the category selection prompt.                                            |
| `--template` | `-t`  | Template name. Accepts bare name (`fastify`) or `category/template` slash syntax. Slash syntax also sets `--category`.                        |
| `--force`    | `-f`  | Overwrite a non-empty target directory without prompting. Skips both the overwrite confirmation and the final "create project?" confirmation. |
| `--offline`  | `-o`  | Run in offline mode using locally cached templates. Requires `--template` in `category/template` format.                                      |

### Examples

```bash
# Fully interactive
pnpm dlx @cnpx/cnpx

# Name only — prompts for category and template
pnpm dlx @cnpx/cnpx --name my-project

# Slash syntax — sets both category and template
pnpm dlx @cnpx/cnpx -t backend/fastify

# Category and template as separate flags
pnpm dlx @cnpx/cnpx --category backend --template fastify
```

## License

MIT © [xcfio](https://github.com/xcfio)
