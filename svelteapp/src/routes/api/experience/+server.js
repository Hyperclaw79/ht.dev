/*
    * This is an endpoint file and should have the following structure:
    * POST, PUT and DELETE should return a 405 Method Not Allowed error.
    * GET should import the getter.js file and return the data.
*/

import { error } from "@sveltejs/kit";

export const POST = () => {
    throw error(405, {
        message: "Method not allowed"
    });
};

export const PUT = () => {
    throw error(405, {
        message: "Method not allowed"
    });
};

export const DELETE = () => {
    throw error(405, {
        message: "Method not allowed"
    });
};

export const GET = async ({ authData }) => {
    if (!authData) {
        const module = await import("$env/dynamic/private");
        const { env } = module;
        authData = { email: env.DB_EMAIL, password: env.DB_PASSWORD };
    };

    const module = await import("./getter.js");
    const getter = module.default;
    const experience = await getter(authData);
    const response = new Response(JSON.stringify(experience));
    response.headers.set("Content-Type", "application/json");
    return response;
};
