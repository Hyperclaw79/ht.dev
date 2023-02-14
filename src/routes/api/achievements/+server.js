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

export const GET = async () => {
    const achievements = await import("./getter.js");
    const response = new Response(JSON.stringify(achievements.default));
    response.headers.set("Content-Type", "application/json");
    return response;
};
