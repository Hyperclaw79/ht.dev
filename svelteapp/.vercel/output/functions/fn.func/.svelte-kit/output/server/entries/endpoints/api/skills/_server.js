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
  const module = await import("../../../../chunks/getter5.js");
  const getter = module.default;
  const skills = await getter(authData);
  const response = new Response(JSON.stringify(skills));
  response.headers.set("Content-Type", "application/json");
  return response;
};
export {
  DELETE,
  GET,
  POST,
  PUT
};
