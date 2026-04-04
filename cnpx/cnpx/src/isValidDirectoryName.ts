export function isValidDirectoryName(name: string): boolean | string {
    if (!name || !name.trim()) return "Directory name cannot be empty"
    if (name.length > 255) return "Directory name is too long"
    if (/[<>:"/\\|?*\x00-\x1f]/.test(name)) return "Directory name contains invalid characters"
    if (/^[. ]|[. ]$/.test(name)) return "Directory name cannot start or end with a dot or space"
    if (/^(con|prn|aux|nul|com[0-9]|lpt[0-9])$/i.test(name)) return "Directory name is a reserved name"
    return true
}
