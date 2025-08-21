/**
 * @jest-environment node
 */
import { jest } from '@jest/globals';

// Mock PocketBase with more realistic behavior
const mockPocketBase = jest.fn().mockImplementation(() => {
    const instance = {
        autoCancellation: jest.fn(),
        authStore: { token: null },
        admins: {
            authWithPassword: jest.fn().mockImplementation(async (email, password) => {
                if (email === 'success@test.com') {
                    instance.authStore.token = 'mock_token';
                    return true;
                } else {
                    throw new Error('Authentication failed');
                }
            })
        },
        collection: jest.fn().mockImplementation((collectionName) => ({
            getFullList: jest.fn().mockImplementation(async (limit, options) => {
                if (collectionName === 'test_success') {
                    return [
                        {
                            collectionId: "123",
                            id: "456", 
                            name: "Test Record",
                            description: "Test Description",
                            category: "test",
                            created: "2023-02-10T00:00:00.000Z",
                            updated: "2023-02-10T00:00:00.000Z",
                            collectionName: "test_success",
                            expand: {
                                children: [
                                    { name: "Child 1", id: "child1" },
                                    { name: "Child 2", id: "child2" }
                                ]
                            }
                        },
                        {
                            collectionId: "789",
                            id: "101", 
                            name: "Test Record 2",
                            description: "Test Description 2",
                            category: "test2",
                            created: "2023-02-11T00:00:00.000Z",
                            updated: "2023-02-11T00:00:00.000Z",
                            collectionName: "test_success",
                            expand: null
                        }
                    ];
                } else {
                    throw new Error('Collection not found');
                }
            })
        }))
    };
    return instance;
});

jest.unstable_mockModule('pocketbase', () => ({
    default: mockPocketBase
}));

jest.unstable_mockModule('$env/dynamic/private', () => ({
    env: {
        DB_HOST: 'localhost',
        DB_PORT: '8090'
    }
}));

describe('pbClient getRecords success scenarios (lines 20-25)', () => {
    it('should successfully authenticate and fetch records', async () => {
        const { getRecords } = await import('./pbClient.js');
        
        const authData = { email: 'success@test.com', password: 'testpass' };
        const result = await getRecords({ 
            authData, 
            collection: 'test_success',
            sort: 'created',
            skipFields: ['collectionId', 'id'],
            keyOrder: ['name', 'description', 'children']
        });

        // Should successfully fetch and process records (covering lines 20-25)
        expect(Array.isArray(result)).toBe(true);
        expect(result).toHaveLength(2);
        
        // Verify record processing
        expect(result[0]).toMatchObject({
            name: 'Test Record',
            description: 'Test Description',
            children: expect.any(Array)
        });
        
        // Verify dirty fields were removed
        expect(result[0]).not.toHaveProperty('collectionId');
        expect(result[0]).not.toHaveProperty('id');
        
        // Verify children were processed
        expect(result[0].children).toHaveLength(2);
        expect(result[0].children[0]).not.toHaveProperty('id');
    });

    it('should handle records with null response', async () => {
        // This test is covered by a separate test file pbClient-null.test.js
        // to avoid module mocking conflicts
        expect(true).toBe(true);
    });

    it('should process records without keyOrder', async () => {
        const { getRecords } = await import('./pbClient.js');
        
        const authData = { email: 'success@test.com', password: 'testpass' };
        const result = await getRecords({ 
            authData, 
            collection: 'test_success',
            sort: '-created'
        });

        // Should process records without keyOrder (line 25)
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
        
        // All default dirty fields should be removed
        expect(result[0]).not.toHaveProperty('collectionId');
        expect(result[0]).not.toHaveProperty('id');
        expect(result[0]).not.toHaveProperty('created');
        expect(result[0]).not.toHaveProperty('updated');
        expect(result[0]).not.toHaveProperty('collectionName');
    });
});