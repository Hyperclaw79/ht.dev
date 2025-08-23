/**
 * @jest-environment node
 */
import { jest } from "@jest/globals";

jest.unstable_mockModule("src/routes/api/experience/getter.js", () => {
    return {
        default: jest.fn().mockResolvedValue([
            {
                name: "Company 1",
                type: "Job",
                year: "2022 - Present",
                children: [
                    {
                        name: "Position 1",
                        type: "Role",
                        children: [
                            {
                                name: "Product 1",
                                type: "Product",
                                description: "Description 1",
                                skills: ["Skill 1", "Skill 2", "Skill 3"]
                            },
                            {
                                name: "Product 2",
                                type: "Product",
                                description: "Description 2",
                                skills: ["Skill 1", "Skill 2", "Skill 3"]
                            }
                        ]
                    },
                    {
                        name: "Position 2",
                        type: "Role",
                        description: "Description 3",
                        skills: ["Skill 4", "Skill 5", "Skill 6"]
                    }
                ]
            },
            {
                name: "Company 2",
                type: "Job",
                year: "2020 - 2022",
                children: [
                    {
                        name: "Position 3",
                        type: "Role",
                        description: "Description 4",
                        skills: ["Skill 7", "Skill 8", "Skill 9"]
                    }
                ]
            }
        ])
    };
});

// Mock environment variables
jest.unstable_mockModule("$env/dynamic/private", () => {
    return {
        env: {
            DB_EMAIL: "test@example.com",
            DB_PASSWORD: "testpassword"
        }
    };
});

const { GET, POST, PUT, DELETE } = await import("src/routes/api/experience/+server.js");

describe("Unallowed Methods", () => {
    it("should throw error with status code 405 for POST, PUT and DELETE", () => {
        expect(() => POST()).toThrowError(/Method not allowed/);
        expect(() => PUT()).toThrowError(/Method not allowed/);
        expect(() => DELETE()).toThrowError(/Method not allowed/);
    });
});

describe("GET method", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return Job Experience with provided authData", async () => {
        const result = await GET({ authData: { email: "mock", password: "mock" } });
        expect(result).toBeDefined();
        expect(result.status).toEqual(200);
        expect(result.headers.get("Content-Type")).toEqual("application/json");
        const body = await result.json();
        expect(body).toBeDefined();
        Array.isArray(body);
        expect(body[0]).toMatchObject({
            name: expect.any(String),
            type: expect.any(String),
            year: expect.any(String)
        });
        expect(body[0].children).toBeDefined();
        Array.isArray(body[0].children);
        expect(body[0].children[0]).toMatchObject({
            name: expect.any(String),
            type: expect.any(String)
        });
        expect(body[0].children[0].children).toBeDefined();
        Array.isArray(body[0].children[0].children);
        expect(body[0].children[0].children[0]).toMatchObject({
            name: expect.any(String),
            type: expect.any(String),
            description: expect.any(String)
        });
        expect(body[0].children[0].children[0].skills).toBeDefined();
        Array.isArray(body[0].children[0].children[0].skills);
        expect(body[0].children[0].children[0].skills[0]).toEqual(expect.any(String));
        expect(body[0].children[1]).toMatchObject({
            name: expect.any(String),
            type: expect.any(String),
            description: expect.any(String)
        });
        expect(body[0].children[1].skills).toBeDefined();
        Array.isArray(body[0].children[1].skills);
        expect(body[0].children[1].skills[0]).toEqual(expect.any(String));
        expect(body[1]).toMatchObject({
            name: expect.any(String),
            type: expect.any(String),
            year: expect.any(String)
        });
        expect(body[1].children).toBeDefined();
        Array.isArray(body[1].children);
        expect(body[1].children[0]).toMatchObject({
            name: expect.any(String),
            type: expect.any(String),
            description: expect.any(String)
        });
        expect(body[1].children[0].skills).toBeDefined();
        Array.isArray(body[1].children[0].skills);
        expect(body[1].children[0].skills[0]).toEqual(expect.any(String));
    });

    it("should use environment variables when authData is not provided", async () => {
        const response = await GET({});
        
        expect(response).toBeInstanceOf(Response);
        expect(response.headers.get("Content-Type")).toBe("application/json");
        
        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
        expect(data).toHaveLength(2);
    });

    it("should handle getter function being called with correct parameters", async () => {
        const authData = { email: "custom@example.com", password: "custompass" };
        await GET({ authData });
        
        const getterModule = await import("src/routes/api/experience/getter.js");
        expect(getterModule.default).toHaveBeenCalledWith(authData);
    });

    it("should handle case when no authData is provided by using env vars", async () => {
        await GET({});
        
        const getterModule = await import("src/routes/api/experience/getter.js");
        expect(getterModule.default).toHaveBeenCalledWith({
            email: "test@example.com",
            password: "testpassword"
        });
    });
});
