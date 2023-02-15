/**
 * @jest-environment node
 */
import { jest } from "@jest/globals";

jest.unstable_mockModule("./getter.js", () => {
    return {
        default: () => Promise.resolve([
            {
                name: "Github",
                url: "https://github.com/hyperclaw79",
                icon: "/icons/github.png"
            },
            {
                name: "Linkedin",
                url: "https://linkedin.com/in/harshith-thota-749851154",
                icon: "/icons/linkedin.png"
            },
            {
                name: "Gmail",
                url: "mailto:harshith.thota7@gmail.com",
                icon: "/icons/gmail.webp"
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
    it("should return socialMetadata", async () => {
        const result = await GET({ authData: { email: "mock", password: "mock" } });
        expect(result).toBeDefined();
        expect(result.status).toEqual(200);
        expect(result.headers.get("Content-Type")).toEqual("application/json");
        const body = await result.json();
        expect(body).toBeDefined();
        expect(body[0]).toMatchObject({
            name: expect.any(String),
            url: expect.any(String),
            icon: expect.any(String)
        });
    });
});
