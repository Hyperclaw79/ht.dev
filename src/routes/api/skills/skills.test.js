/**
 * @jest-environment node
 */
import { jest } from "@jest/globals";

jest.unstable_mockModule("./getter.js", () => {
    return {
        default: () => Promise.resolve({
            "Technical Skills": [
                {
                    confidence: 100,
                    icon: "/icons/technical/python.webp",
                    name: "Python"
                },
                {
                    confidence: 100,
                    icon: "/icons/technical/rest.png",
                    name: "REST API"
                }
            ],
            "Soft Skills": [
                {
                    confidence: 100,
                    icon: "/icons/soft/communication.png",
                    name: "Communication Skills"
                },
                {
                    confidence: 100,
                    icon: "/icons/soft/lateral-thinking.png",
                    name: "Lateral Thinking"
                }
            ]
        })
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
    it("should return skills", async () => {
        const result = await GET({ authData: { email: "mock", password: "mock" } });
        expect(result).toBeDefined();
        expect(result.status).toEqual(200);
        expect(result.headers.get("Content-Type")).toEqual("application/json");
        const body = await result.json();
        expect(body).toBeDefined();
        Array.isArray(body["Technical Skills"]);
        Array.isArray(body["Soft Skills"]);
        expect(body["Technical Skills"][0]).toMatchObject({
            name: expect.any(String),
            icon: expect.any(String),
            confidence: expect.any(Number)
        });
        expect(body["Technical Skills"][0].confidence).toBeGreaterThan(0);
        expect(body["Technical Skills"][0].confidence).toBeLessThan(101);
        expect(body["Soft Skills"][0]).toMatchObject({
            name: expect.any(String),
            icon: expect.any(String),
            confidence: expect.any(Number)
        });
        expect(body["Soft Skills"][0].confidence).toBeGreaterThan(0);
        expect(body["Soft Skills"][0].confidence).toBeLessThan(101);
    });
});
