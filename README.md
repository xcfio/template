# template

A collection of application templates for Fastify, Next.js, Node.js, React, and SolidJS.

## Templates

| Name                                    | Description                                               |
| --------------------------------------- | --------------------------------------------------------- |
| [fastify](apps/fastify)                 | Fastify API with TypeScript, Drizzle ORM, JWT, and Docker |
| [fastify-netlify](apps/fastify-netlify) | Fastify API adapted for Netlify deployment                |
| [next-tailwind](apps/next-tailwind)     | Next.js with Tailwind CSS                                 |
| [nodejs](apps/nodejs)                   | Node.js with TypeScript and Docker                        |
| [react-tailwind](apps/react-tailwind)   | React with Tailwind CSS                                   |
| [solid-tailwind](apps/solid-tailwind)   | SolidJS with Tailwind CSS                                 |

## Usage

Scaffold a template into a new directory using [degit](https://github.com/Rich-Harris/degit):

```bash
pnpm dlx degit xcfio/template/apps/<template-name> my-app
cd my-app
pnpm install
pnpm dev
```

## License

MIT © [xcfio](https://github.com/xcfio)
