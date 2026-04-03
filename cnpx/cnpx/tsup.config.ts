import { defineConfig } from "tsup"

export default defineConfig({
    entry: ["src/**/*.ts"],
    format: ["cjs", "esm"],
    outDir: "out",
    minifyIdentifiers: true,
    minifyWhitespace: true,
    minifySyntax: true,
    treeshake: true,
    bundle: false,
    minify: true,
    clean: true,
    dts: true
})
