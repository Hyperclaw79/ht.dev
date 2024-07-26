/**
 * @jest-environment node
 */
import { jest } from "@jest/globals";

jest.unstable_mockModule("./getter.js", () => {
    return {
        default: () => Promise.resolve([
            {
                specialization: "B.E Electronics & Communication Engineering",
                institution: "P.E.S INSTITUTE OF TECHNOLOGY, BANGALORE",
                period: "2014 – 2018"
            },
            {
                specialization: "Intermediate Education, MPC",
                institution: "Sri Gayatri Junior College",
                period: "2011 – 2013"
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
    it("should return Education", async () => {
        const result = await GET({ authData: { email: "mock", password: "mock" } });
        expect(result).toBeDefined();
        expect(result.status).toEqual(200);
        expect(result.headers.get("Content-Type")).toEqual("application/json");
        const body = await result.json();
        expect(body).toBeDefined();
        Array.isArray(body);
        expect(body[0]).toMatchObject({
            specialization: expect.any(String),
            institution: expect.any(String),
            period: expect.any(String)
        });
    });
});
