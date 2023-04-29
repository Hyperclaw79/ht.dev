import { error } from "@sveltejs/kit";
import constructUrl from "../../../utils.js";

export const GET = () => {
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

export const POST = async ({ request, storedUsername, storedPassword, dbHost, dbPort }) => {
    if (!storedUsername) {
        const module = await import("$env/dynamic/private");
        const { env } = module;
        storedUsername = env.ADMIN_USERNAME;
        storedPassword = env.ADMIN_PASSWORD;
        dbHost = env.DB_HOST;
        dbPort = env.DB_PORT;
    };

    const { username, password } = await request.json();
    if (username !== storedUsername) {
        throw error(401, {
            message: "Unauthorized",
            error: "username"
        });
    }
    if (password !== storedPassword) {
        throw error(401, {
            message: "Unauthorized",
            error: "password"
        });
    }
    const redirectUrl = constructUrl(dbHost, dbPort, "_/");
    return new Response(JSON.stringify({ message: "Success", redirectUrl }));
};
