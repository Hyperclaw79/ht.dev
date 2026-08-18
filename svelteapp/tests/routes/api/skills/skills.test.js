/**
 * @jest-environment node
 */
import { jest } from "@jest/globals";

const getter = jest.fn().mockImplementation(async (_auth, { aggregate } = {}) => {
    if (aggregate === "category") {
        return {
            totalSkills: 2,
            categories: [{
                name: "Backend",
                order: 10,
                skills: [
                    { name: "Django", order: 10 },
                    { name: "FastAPI", order: 20 }
                ]
            }]
        };
    }
    return [
        { category: "Backend", categoryOrder: 10, name: "Django", order: 10 },
        { category: "Backend", categoryOrder: 10, name: "FastAPI", order: 20 }
    ];
});

jest.unstable_mockModule("src/routes/api/skills/getter.js", () => ({ default: getter }));
jest.unstable_mockModule("$env/dynamic/private", () => ({
    env: { DB_EMAIL: "test@example.com", DB_PASSWORD: "testpassword" }
}));

const { GET, POST, PUT, DELETE } = await import("src/routes/api/skills/+server.js");
const requestUrl = (query = "") => new URL(`http://localhost/api/skills${query}`);

describe("Unallowed Methods", () => {
    it("returns 405 for POST, PUT and DELETE", () => {
        expect(() => POST()).toThrowError(/Method not allowed/);
        expect(() => PUT()).toThrowError(/Method not allowed/);
        expect(() => DELETE()).toThrowError(/Method not allowed/);
    });
});

describe("GET method", () => {
    beforeEach(() => jest.clearAllMocks());

    it("returns raw skills when no aggregate is requested", async () => {
        const authData = { email: "custom@example.com", password: "custompass" };
        const response = await GET({ authData, url: requestUrl() });
        const data = await response.json();

        expect(Array.isArray(data)).toBe(true);
        expect(data[0]).toMatchObject({ category: "Backend", categoryOrder: 10, name: "Django" });
        expect(getter).toHaveBeenCalledWith(authData, { aggregate: undefined });
    });

    it("returns API-owned category aggregation for aggregate=category", async () => {
        const authData = { email: "custom@example.com", password: "custompass" };
        const response = await GET({ authData, url: requestUrl("?aggregate=category") });
        const data = await response.json();

        expect(data.totalSkills).toBe(2);
        expect(data.categories[0].name).toBe("Backend");
        expect(getter).toHaveBeenCalledWith(authData, { aggregate: "category" });
    });

    it("uses environment credentials when authData is absent", async () => {
        await GET({ url: requestUrl("?aggregate=category") });
        expect(getter).toHaveBeenCalledWith(
            { email: "test@example.com", password: "testpassword" },
            { aggregate: "category" }
        );
    });

    it("rejects unsupported aggregation modes", async () => {
        await expect(GET({
            authData: { email: "x", password: "y" },
            url: requestUrl("?aggregate=magic")
        })).rejects.toMatchObject({ status: 400 });
    });
});
