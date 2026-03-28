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

Scaffold a template into a new directory using [degit](https://github.com/Rich-Harris/degit):

```bash
pnpm dlx degit xcfio/template/<type>/<name> my-app
cd my-app
pnpm install
pnpm dev
```

## License

MIT © [xcfio](https://github.com/xcfio)
