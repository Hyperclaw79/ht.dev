/**
 * @jest-environment node
 */
import { jest } from "@jest/globals";

jest.unstable_mockModule("./getter.js", () => {
    return {
        default: () => Promise.resolve([
            {
                assetZoomable: true,
                from: {
                    name: "Udemy",
                    icon: "/icons/achievements/udemy.webp"
                },
                image: "/images/pentest.jpg",
                name: "Pentesting with Kali",
                type: "Certificate",
                year: "2020"
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
    it("should return achievements", async () => {
        const result = await GET({ authData: { email: "mock", password: "mock" } });
        expect(result).toBeDefined();
        expect(result.status).toEqual(200);
        expect(result.headers.get("Content-Type")).toEqual("application/json");
        const body = await result.json();
        expect(body).toBeDefined();
        expect(body[0]).toMatchObject({
            assetZoomable: expect.any(Boolean),
            from: {
                name: expect.any(String),
                icon: expect.any(String)
            },
            image: expect.any(String),
            name: expect.any(String)
        });
        expect(["Certificate", "Achievement"]).toContain(body[0].type);
        expect(body[0].year).toMatch(/^\d{4}$/);
    });
});
