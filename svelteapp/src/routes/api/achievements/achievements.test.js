/**
 * @jest-environment node
 */
import { jest } from "@jest/globals";

jest.unstable_mockModule("./getter.js", () => {
    return {
        default: jest.fn().mockResolvedValue([
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

// Mock environment variables
jest.unstable_mockModule("$env/dynamic/private", () => {
    return {
        env: {
            DB_EMAIL: "test@example.com",
            DB_PASSWORD: "testpassword"
        }
    };
});

const { GET, POST, PUT, DELETE } = await import("./+server.js");

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

    it("should return achievements with provided authData", async () => {
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

    it("should use environment variables when authData is not provided", async () => {
        const response = await GET({});
        
        expect(response).toBeInstanceOf(Response);
        expect(response.headers.get("Content-Type")).toBe("application/json");
        
        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
        expect(data).toHaveLength(1);
    });

    it("should handle getter function being called with correct parameters", async () => {
        const authData = { email: "custom@example.com", password: "custompass" };
        await GET({ authData });
        
        const getterModule = await import("./getter.js");
        expect(getterModule.default).toHaveBeenCalledWith(authData);
    });

    it("should handle case when no authData is provided by using env vars", async () => {
        await GET({});
        
        const getterModule = await import("./getter.js");
        expect(getterModule.default).toHaveBeenCalledWith({
            email: "test@example.com",
            password: "testpassword"
        });
    });
});
