import { defineConfig } from "tsup"

export default defineConfig({
    entry: ["src/**/*.ts"],
    format: ["cjs", "esm"],
    outDir: "out",
    treeshake: true,
    bundle: false,
    minify: true,
    clean: true,
    dts: true
})
