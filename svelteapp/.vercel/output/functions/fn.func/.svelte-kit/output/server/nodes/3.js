

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.2546f654.js","_app/immutable/chunks/scheduler.38b1c095.js","_app/immutable/chunks/index.1afc2de3.js"];
export const stylesheets = ["_app/immutable/assets/3.34757459.css"];
export const fonts = [];
