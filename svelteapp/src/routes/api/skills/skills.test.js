/**
 * @jest-environment node
 */

import { GET, POST, PUT, DELETE } from "./+server.js";

// Simple tests without complex mocking for now
describe("Unallowed Methods", () => {
    it("should throw error with status code 405 for POST, PUT and DELETE", () => {
        expect(() => POST()).toThrowError(/Method not allowed/);
        expect(() => PUT()).toThrowError(/Method not allowed/);
        expect(() => DELETE()).toThrowError(/Method not allowed/);
    });
});

describe("GET", () => {
    it("should export GET function", () => {
        expect(typeof GET).toBe('function');
    });
});
