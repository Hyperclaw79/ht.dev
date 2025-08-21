

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.e03a1690.js","_app/immutable/chunks/2.1703f1fa.js","_app/immutable/chunks/scheduler.38b1c095.js","_app/immutable/chunks/index.1afc2de3.js","_app/immutable/chunks/index.ace71199.js","_app/immutable/chunks/preload-helper.a4192956.js"];
export const stylesheets = ["_app/immutable/assets/2.9c4e0378.css"];
export const fonts = [];
