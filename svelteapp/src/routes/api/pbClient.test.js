import { _cleanRecord, _fallback } from "./pbClient.js";

describe("_fallback", () => {
    it("returns an object with a default property", async () => {
        const result = await _fallback("socials");
        Array.isArray(result);
        expect(result[0]).toMatchObject({
            name: expect.any(String),
            icon: expect.any(String),
            url: expect.any(String)
        });
    });

    it("returns an empty array when a module cannot be imported", async () => {
        const result = await _fallback("invalid_module");
        Array.isArray(result);
        expect(result).toHaveLength(0);
    });
});

describe("_cleanRecord", () => {
    const record = {
        collectionId: "123",
        description: "This is a test record",
        name: "Test Record",
        id: "456",
        created: "2023-02-10T00:00:00.000Z",
        updated: "2023-02-10T00:00:00.000Z",
        collectionName: "example",
        expand: {
            children: [
                { name: "child" }
            ]
        }
    };

    it("removes specified fields and renames children property", () => {
        const cleaned = _cleanRecord({ record });
        expect(cleaned.collectionId).toBeUndefined();
        expect(cleaned.id).toBeUndefined();
        expect(cleaned.created).toBeUndefined();
        expect(cleaned.updated).toBeUndefined();
        expect(cleaned.collectionName).toBeUndefined();
        expect(cleaned.expand).toBeUndefined();
        expect(cleaned.children).toEqual(record.expand.children);
    });

    it("reorders fields based on keyOrder argument", () => {
        const keyOrder = ["name", "description", "children"];
        const cleaned = _cleanRecord({ record, keyOrder });
        expect(Object.keys(cleaned)).toEqual(keyOrder);
    });

    it("recursively cleans children", () => {
        const cleaned = _cleanRecord({ record });
        expect(cleaned.children[0].collectionId).toBeUndefined();
        expect(cleaned.children[0].id).toBeUndefined();
        expect(cleaned.children[0].created).toBeUndefined();
        expect(cleaned.children[0].updated).toBeUndefined();
        expect(cleaned.children[0].collectionName).toBeUndefined();
        expect(cleaned.children[0].expand).toBeUndefined();
    });
});
