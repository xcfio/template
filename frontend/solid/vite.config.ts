import tailwindcss from "@tailwindcss/vite"
import solidPlugin from "vite-plugin-solid"
import devtools from "solid-devtools/vite"
import { defineConfig } from "vite"

export default defineConfig({
    plugins: [devtools(), solidPlugin(), tailwindcss()],
    build: { target: "esnext" }
})
