import { e as error } from "../../../../chunks/index.js";
const POST = () => {
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
const GET = async ({ authData }) => {
  if (!authData) {
    const module2 = await import("../../../../chunks/private.js").then((n) => n._);
    const { env } = module2;
    authData = { email: env.DB_EMAIL, password: env.DB_PASSWORD };
  }
  const module = await import("../../../../chunks/getter6.js");
  const getter = module.default;
  const socials = await getter(authData);
  const response = new Response(JSON.stringify(socials));
  response.headers.set("Content-Type", "application/json");
  return response;
};
export {
  DELETE,
  GET,
  POST,
  PUT
};
