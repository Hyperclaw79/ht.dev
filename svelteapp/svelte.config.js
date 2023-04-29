import adapter from "@sveltejs/adapter-auto";

/** @type {import("@sveltejs/kit").Config} */
const config = {
    kit: {
        adapter: adapter({
            devOptions: {
                sourceMap: true
            }
        })
    }
};

export default config;
