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
const GET = async ({ authData, token }) => {
  if (!authData) {
    const module2 = await import("../../../../chunks/private.js").then((n) => n._);
    const { env } = module2;
    authData = { email: env.DB_EMAIL, password: env.DB_PASSWORD };
  }
  const module = await import("../../../../chunks/getter4.js");
  const getter = module.default;
  const projects = await getter(authData);
  await _updateWithGHStats({ projects, token });
  const filteredProjects = projects.map((project) => {
    const { isOnGithub: isOnGH, alias, watchers, ...proj } = project;
    return proj;
  });
  return new Response(JSON.stringify(filteredProjects));
};
const _updateWithGHStats = async ({ projects, token }) => {
  if (!projects.some((project) => project.isOnGithub)) {
    return;
  }
  if (!token) {
    try {
      const module = await import("../../../../chunks/private.js").then((n) => n._);
      const { env } = module;
      token = env.GITHUB_TOKEN;
    } catch (err) {
      token = "";
      console.error(err);
    }
  }
  const body = _generateGQL(projects);
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  };
  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers,
      body
    });
    const { data } = await res.json();
    projects.forEach((project) => {
      if (project.isOnGithub) {
        const repo = data[project.alias];
        project.name = repo?.name || project.title;
        project.description = repo?.description || project.description;
        project.htmlUrl = repo?.htmlUrl;
        project.watcherCount = repo?.watchers?.totalCount || 0;
        project.forkCount = repo?.forkCount || 0;
        project.stargazerCount = repo?.stargazerCount || 0;
      }
    });
  } catch (err) {
    console.warn("Failed to fetch GitHub data.");
  }
};
const _generateGQL = (projects) => {
  const queries = projects.filter((project) => project.isOnGithub).map((project) => {
    return `${project.alias}: repository(owner: "hyperclaw79", name: "${project.name}") {
            ...Repo
        }`;
  });
  const gql = `
        query RepoData {
            ${queries.join("\n")}
        }
    
        fragment Repo on Repository {
            name
            description
            htmlUrl: url
            watchers {
                totalCount
            }
            forkCount
            stargazerCount
        }`;
  const body = JSON.stringify({
    query: gql,
    variables: {}
  });
  return body;
};
export {
  DELETE,
  GET,
  POST,
  PUT,
  _generateGQL,
  _updateWithGHStats
};
