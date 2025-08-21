/**
 * @jest-environment node
 */

import { jest } from "@jest/globals";

// Mock the getter function
jest.unstable_mockModule("./getter.js", () => {
    return {
        default: jest.fn().mockResolvedValue([
            {
                id: "1",
                category: "Frontend",
                name: "JavaScript",
                level: "Expert"
            },
            {
                id: "2", 
                category: "Backend",
                name: "Node.js",
                level: "Advanced"
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

// Simple tests without complex mocking for now
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

    it("should export GET function", () => {
        expect(typeof GET).toBe('function');
    });

    it("should return skills data when authData is provided", async () => {
        const authData = { email: "test@example.com", password: "testpass" };
        const response = await GET({ authData });
        
        expect(response).toBeInstanceOf(Response);
        expect(response.headers.get("Content-Type")).toBe("application/json");
        
        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
        expect(data).toHaveLength(2);
        expect(data[0]).toMatchObject({
            id: "1",
            category: "Frontend",
            name: "JavaScript",
            level: "Expert"
        });
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
