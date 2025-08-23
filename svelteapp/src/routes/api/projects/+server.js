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

export const GET = async ({ authData, token }) => {
    if (!authData) {
        const module = await import("$env/dynamic/private");
        const { env } = module;
        authData = { email: env.DB_EMAIL, password: env.DB_PASSWORD };
    };
    const module = await import("./getter.js");
    const getter = module.default;
    const projects = await getter(authData);
    await _updateWithGHStats({ projects, token });
    const filteredProjects = projects.map((project) => {
        const { isOnGithub: isOnGH, alias, watchers, ...proj } = project;
        return proj;
    });
    return new Response(JSON.stringify(filteredProjects));
};

export const _updateWithGHStats = async ({ projects, token }) => {
    if (!projects.some((project) => project.isOnGithub)) { return; }
    if (!token) {
        try {
            const module = await import("$env/dynamic/private");
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
        // Only log GitHub fetch errors if not in test mode
        if (process.env.TEST_MODE !== 'true') {
            console.warn("Failed to fetch GitHub data.");
        }
    }
};

export const _generateGQL = (projects) => {
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
        query: gql, variables: {}
    });
    return body;
};
