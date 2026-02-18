import { platform } from "node:os"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

const path = `${import.meta.dirname}`.replaceAll("\\", "/").split("/").reverse()
export default defineConfig({
    base: platform() !== "win32" ? `${path[1]}/${path[0]}` : "./",
    plugins: [react(), tailwindcss()]
})
