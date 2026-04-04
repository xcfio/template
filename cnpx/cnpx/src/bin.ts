#!/usr/bin/env node

import { showHelp } from "./showHelp"
import { main } from "./main"

process.removeAllListeners("warning")

if (process.argv.includes("help") || process.argv.includes("--help") || process.argv.includes("-h")) {
    showHelp()
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})
