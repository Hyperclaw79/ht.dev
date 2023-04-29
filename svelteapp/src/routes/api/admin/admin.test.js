/**
 * @jest-environment node
 */
import { jest } from "@jest/globals";
import { GET, POST, PUT, DELETE } from "./+server.js";

describe("Unallowed Methods", () => {
    it("should throw error with status code 405 for POST, PUT and DELETE", () => {
        expect(() => GET()).toThrowError(/Method not allowed/);
        expect(() => PUT()).toThrowError(/Method not allowed/);
        expect(() => DELETE()).toThrowError(/Method not allowed/);
    });
});

describe("POST function", () => {
    it("should throw an error with status code 401 when username is incorrect", async () => {
        const request = {
            json: jest.fn().mockResolvedValue({
                username: "incorrect_username",
                password: "correct_password"
            })
        };
        const storedUsername = "correct_username";
        const storedPassword = "correct_password";
        await expect(POST({ request, storedUsername, storedPassword })).rejects.toEqual({
            status: 401,
            body: { message: "Unauthorized", error: "username" }
        });
    });

    it("should throw an error with status code 401 when password is incorrect", async () => {
        const request = {
            json: jest.fn().mockResolvedValue({
                username: "correct_username",
                password: "incorrect_password"
            })
        };
        const storedUsername = "correct_username";
        const storedPassword = "correct_password";
        await expect(POST({ request, storedUsername, storedPassword })).rejects.toEqual({
            status: 401,
            body: { message: "Unauthorized", error: "password" }
        });
    });

    it("should return a response with success message and redirect URL when both username and password are correct", async () => {
        const request = {
            json: jest.fn().mockResolvedValue({
                username: "correct_username",
                password: "correct_password"
            })
        };
        const storedUsername = "correct_username";
        const storedPassword = "correct_password";
        const dbHost = "https://example.com";
        const dbPort = "1234";
        const result = await POST({ request, storedUsername, storedPassword, dbHost, dbPort });
        const data = await result.json();
        await expect(data).toEqual({ message: "Success", redirectUrl: "https://example.com:1234/_/" });
    });
});
