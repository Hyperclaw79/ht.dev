/**
 * @jest-environment node
 */
import { jest } from "@jest/globals";

// Mock the environment to throw an error
jest.unstable_mockModule("$env/dynamic/private", () => {
    throw new Error("Environment import failed");
});

describe("projects +server.js environment error handling", () => {
    beforeEach(() => {
        global.fetch = jest.fn().mockImplementation(() => Promise.resolve({
            json: () => Promise.resolve({ data: {} })
        }));
        console.error = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it("should handle environment import errors when no token provided", async () => {
        // Import the module after the mock is set up
        const { _updateWithGHStats } = await import("../../../../src/routes/api/" + directory + "/+server.js");
        
        const projects = [{ 
            isOnGithub: true, 
            alias: "repo", 
            title: "Project Title", 
            description: "Project Description" 
        }];

        await _updateWithGHStats({ projects });

        // Should have called console.error with the import error
        expect(console.error).toHaveBeenCalledWith(expect.any(Error));
        
        // Should have attempted to fetch with empty token
        expect(global.fetch).toHaveBeenCalledWith(
            "https://api.github.com/graphql",
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: "Bearer "
                })
            })
        );
    });
});