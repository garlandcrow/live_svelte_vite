export function normalizeComponents(components) {
    const normalized = {};
    for (const [path, module] of Object.entries(components)) {
        const Component = module.default;
        const name = path.replace("../svelte/", "").replace(".svelte", "");
        normalized[name] = Component;
    }
    return normalized;
}
