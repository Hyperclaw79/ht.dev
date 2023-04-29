/**
 * @jest-environment node
 */
import constructUrl from "./utils";

describe("constructUrl", () => {
    const testCases = [
        {
            host: "example.com",
            port: null,
            expectedUrl: new URL("http://example.com/")
        },
        {
            host: "example.com",
            port: 3000,
            expectedUrl: new URL("http://example.com:3000/")
        },
        {
            host: "https://example.com",
            port: null,
            expectedUrl: new URL("https://example.com/")
        },
        {
            host: "https://example.com",
            port: 3000,
            expectedUrl: new URL("https://example.com:3000/")
        },
        {
            host: "https://example.com",
            port: 3000,
            path: "test",
            expectedUrl: new URL("https://example.com:3000/test")
        }
    ];

    it.each(testCases)("should return a URL object with the correct path%s when given host %s", ({ host, port, path, expectedUrl }) => {
        const result = constructUrl(host, port, path);
        expect(result).toEqual(expectedUrl);
    });
});
