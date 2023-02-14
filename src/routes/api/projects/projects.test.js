/**
 * @jest-environment node
 */
import { jest } from "@jest/globals";

jest.unstable_mockModule("./getter.js", () => {
    return {
        default: [{ isOnGithub: true, alias: "repo", title: "Project Title", description: "Project Description" }]
    };
});

// eslint-disable-next-line import/first
import { GET, POST, PUT, DELETE, _updateWithGHStats, _generateGQL } from "./+server.js";

describe("Unallowed Methods", () => {
    it("should throw error with status code 405 for POST, PUT and DELETE", () => {
        expect(() => POST()).toThrowError(/Method not allowed/);
        expect(() => PUT()).toThrowError(/Method not allowed/);
        expect(() => DELETE()).toThrowError(/Method not allowed/);
    });
});

describe("GET method", () => {
    beforeEach(() => {
        global.fetch = jest.fn().mockImplementation(() => Promise.resolve({
            json: () => Promise.resolve({ data: { repo: { name: "repoName", description: "repoDescription", htmlUrl: "https://github.com/hyperclaw79/repoName", watchers: { totalCount: 1 }, forkCount: 2, stargazerCount: 3 } } })
        }));
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it("should return filtered projects in JSON string format", async () => {
        const response = await GET({ token: "mocked_github_pat" });
        const responseBody = await response.json();
        expect(responseBody).toEqual(
            [{ name: "repoName", title: "Project Title", description: "repoDescription", htmlUrl: "https://github.com/hyperclaw79/repoName", watcherCount: 1, forkCount: 2, stargazerCount: 3 }]
        );
    });
});

describe("_updateWithGHStats", () => {
    beforeEach(() => {
        global.fetch = jest.fn().mockImplementation(() => Promise.resolve({
            json: () => Promise.resolve({ data: { repo: { name: "repoName", description: "repoDescription", htmlUrl: "https://github.com/repo", watchers: { totalCount: 1 }, forkCount: 2, stargazerCount: 3 } } })
        }));
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it("updates projects with GH data", async () => {
        const projects = [{ isOnGithub: true, alias: "repo", title: "Project Title", description: "Project Description" }];

        await _updateWithGHStats({ projects, token: "mocked_github_pat" });

        expect(projects[0].name).toEqual("repoName");
        expect(projects[0].description).toEqual("repoDescription");
        expect(projects[0].htmlUrl).toEqual("https://github.com/repo");
        expect(projects[0].watcherCount).toEqual(1);
        expect(projects[0].forkCount).toEqual(2);
        expect(projects[0].stargazerCount).toEqual(3);
    });

    it("does not fetch GH data if no projects are on GH", async () => {
        const projects = [{ isOnGithub: false, title: "Project Title", description: "Project Description" }];

        await _updateWithGHStats({ projects, token: "mocked_github_pat" });

        expect(global.fetch).not.toHaveBeenCalled();
    });

    it("handles fetch errors", async () => {
        global.fetch = jest.fn().mockImplementation(() => Promise.reject(Error("Failed to fetch GitHub data.")));
        console.warn = jest.fn();

        const projects = [{ isOnGithub: true, alias: "repo", title: "Project Title", description: "Project Description" }];

        await _updateWithGHStats({ projects, token: "mocked_github_pat" });

        expect(console.warn).toHaveBeenCalledWith("Failed to fetch GitHub data.");
    });
});

describe("_generateGQL", () => {
    it("generates a valid GraphQL query string", () => {
        const projects = [
            {
                alias: "project1",
                name: "project-1",
                isOnGithub: true
            },
            {
                alias: "project2",
                name: "project-2",
                isOnGithub: false
            },
            {
                alias: "project3",
                name: "project-3",
                isOnGithub: true
            }
        ];

        const result = JSON.parse(_generateGQL(projects));
        result.query = result.query.replace(/\s+/g, " ").trim();
        const expected = `
        query RepoData {
            project1: repository(owner: "hyperclaw79", name: "project-1") {
                ...Repo
            }
            project3: repository(owner: "hyperclaw79", name: "project-3") {
                ...Repo
            }
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
        expect(result).toMatchObject({
            query: expected.replace(/\s+/g, " ").trim(),
            variables: {}
        });
    });
});
