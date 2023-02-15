/**
 * @jest-environment node
 */
import { jest } from "@jest/globals";

jest.unstable_mockModule("./getter.js", () => {
    return {
        default: () => Promise.resolve([
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

import { GET, POST, PUT, DELETE } from "./+server.js";

describe("Unallowed Methods", () => {
    it("should throw error with status code 405 for POST, PUT and DELETE", () => {
        expect(() => POST()).toThrowError(/Method not allowed/);
        expect(() => PUT()).toThrowError(/Method not allowed/);
        expect(() => DELETE()).toThrowError(/Method not allowed/);
    });
});

describe("GET", () => {
    it("should return Job Experience", async () => {
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
});
