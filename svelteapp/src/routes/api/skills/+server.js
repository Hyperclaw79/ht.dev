/*
    Skills API endpoint.
    GET /api/skills returns raw skill records.
    GET /api/skills?aggregate=category returns categories with their ordered skills.
*/
import { error } from "@sveltejs/kit";

export const POST = () => {
    throw error(405, { message: "Method not allowed" });
};

export const PUT = () => {
    throw error(405, { message: "Method not allowed" });
};

export const DELETE = () => {
    throw error(405, { message: "Method not allowed" });
};

export const GET = async ({ authData, url }) => {
    if (!authData) {
        const module = await import("$env/dynamic/private");
        const { env } = module;
        authData = { email: env.DB_EMAIL, password: env.DB_PASSWORD };
    }

    const aggregate = url?.searchParams?.get("aggregate") || undefined;
    if (aggregate && aggregate !== "category") {
        throw error(400, { message: `Unsupported skills aggregate: ${aggregate}` });
    }

    const module = await import("./getter.js");
    const getter = module.default;
    const skills = await getter(authData, { aggregate });
    const response = new Response(JSON.stringify(skills));
    response.headers.set("Content-Type", "application/json");
    return response;
};
