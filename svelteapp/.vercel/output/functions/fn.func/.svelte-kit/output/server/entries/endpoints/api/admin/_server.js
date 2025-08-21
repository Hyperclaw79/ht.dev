import { e as error } from "../../../../chunks/index.js";
import { c as constructUrl } from "../../../../chunks/utils.js";
const GET = () => {
  throw error(405, {
    message: "Method not allowed"
  });
};
const PUT = () => {
  throw error(405, {
    message: "Method not allowed"
  });
};
const DELETE = () => {
  throw error(405, {
    message: "Method not allowed"
  });
};
const POST = async ({ request, storedUsername, storedPassword, dbHost, dbPort }) => {
  if (!storedUsername) {
    const module = await import("../../../../chunks/private.js").then((n) => n._);
    const { env } = module;
    storedUsername = env.ADMIN_USERNAME;
    storedPassword = env.ADMIN_PASSWORD;
    dbHost = env.DB_HOST;
    dbPort = env.DB_PORT;
  }
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
export {
  DELETE,
  GET,
  POST,
  PUT
};
