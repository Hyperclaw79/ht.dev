/**
 * @jest-environment node
 */
import { jest } from '@jest/globals';
import { _cleanRecord, _fallback } from "src/routes/api/pbClient.js";

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

    it("handles records without expand property", () => {
        const recordWithoutExpand = {
            collectionId: "123",
            name: "Test Record",
            description: "Test Description"
        };
        
        const cleaned = _cleanRecord({ record: recordWithoutExpand });
        expect(cleaned.collectionId).toBeUndefined();
        expect(cleaned.children).toBeUndefined();
        expect(cleaned.name).toBe("Test Record");
        expect(cleaned.description).toBe("Test Description");
    });

    it("handles custom dirty fields", () => {
        const customDirtyFields = ["collectionId", "customField"];
        const recordWithCustomField = {
            ...record,
            customField: "should be removed"
        };
        
        const cleaned = _cleanRecord({ 
            record: recordWithCustomField, 
            dirtyFields: customDirtyFields 
        });
        
        expect(cleaned.collectionId).toBeUndefined();
        expect(cleaned.customField).toBeUndefined();
        expect(cleaned.id).toBeDefined(); // Should still exist since not in customDirtyFields
    });

    it("handles keyOrder with missing properties", () => {
        const keyOrder = ["name", "nonexistent", "description"];
        const cleaned = _cleanRecord({ record, keyOrder });
        
        // Should only include keys that exist in the record
        const expectedKeys = ["name", "description"];
        expect(Object.keys(cleaned)).toEqual(expectedKeys);
    });
});

// Integration test for getRecords using the actual function
describe("getRecords integration", () => {
    it("should handle connection and fallback properly", async () => {
        // Import the actual getRecords function
        const { getRecords } = await import("src/routes/api/pbClient.js");
        
        const authData = { email: "test@test.com", password: "test123" };
        const result = await getRecords({ 
            authData, 
            collection: "socials", // Use a collection that has fallback data
            sort: "created"
        });

        // Should return fallback data when PocketBase connection fails
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
        
        // Should have proper structure for socials
        if (result.length > 0) {
            expect(result[0]).toMatchObject({
                name: expect.any(String),
                icon: expect.any(String),
                url: expect.any(String)
            });
        }
    });

    it("should handle invalid collection gracefully", async () => {
        const { getRecords } = await import("src/routes/api/pbClient.js");
        
        const authData = { email: "test@test.com", password: "test123" };
        const result = await getRecords({ 
            authData, 
            collection: "nonexistent_collection"
        });

        // Should return empty array for invalid collection
        expect(Array.isArray(result)).toBe(true);
        expect(result).toHaveLength(0);
    });

    it("should handle different parameters in getRecords", async () => {
        const { getRecords } = await import("src/routes/api/pbClient.js");
        
        const authData = { email: "admin@test.com", password: "admin123" };
        const result = await getRecords({ 
            authData, 
            collection: "skills",
            sort: "-created",
            skipFields: ["expand", "collectionName"],
            keyOrder: ["name", "confidence", "icon"]
        });

        // Should return skills data (either from PB or fallback)
        expect(typeof result).toBe('object');
        expect(result).not.toBeNull();
    });

    it("should attempt PocketBase connection before falling back", async () => {
        const { getRecords } = await import("src/routes/api/pbClient.js");
        
        // Test with valid credentials that will attempt real connection first
        const authData = { email: "real@test.com", password: "realpass" };
        
        // This will try to connect to PocketBase, fail, then fallback
        const result = await getRecords({ 
            authData, 
            collection: "education",
            sort: "created"
        });

        // Should still return data via fallback
        expect(Array.isArray(result)).toBe(true);
    });
});
