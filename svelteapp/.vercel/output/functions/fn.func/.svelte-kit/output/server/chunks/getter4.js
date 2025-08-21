import { g as getRecords } from "./pbClient.js";
const _getProjects = async (authData) => {
  const projects = await getRecords({ collection: "projects", authData, sort: "-isOnGithub,-updated" });
  return projects;
};
export {
  _getProjects as default
};
