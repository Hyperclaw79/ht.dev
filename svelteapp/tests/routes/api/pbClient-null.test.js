/**
 * @jest-environment node
 */
import { jest } from '@jest/globals';

// Mock PocketBase to return null for records
jest.unstable_mockModule('pocketbase', () => ({
    default: jest.fn().mockImplementation(() => ({
        autoCancellation: jest.fn(),
        authStore: { token: 'existing_token' }, // Skip auth step
        admins: {
            authWithPassword: jest.fn()
        },
        collection: jest.fn().mockReturnValue({
            getFullList: jest.fn().mockResolvedValue(null) // Return null to test line 24
        })
    }))
}));

jest.unstable_mockModule('$env/dynamic/private', () => ({
    env: {
        DB_HOST: 'localhost',
        DB_PORT: '8090'
    }
}));

describe('pbClient getRecords null records (line 24)', () => {
    it('should return empty array when PocketBase returns null records', async () => {
        const { getRecords } = await import('src/routes/api/pbClient.js');
        
        const authData = { email: 'test@test.com', password: 'testpass' };
        const result = await getRecords({ 
            authData, 
            collection: 'test_collection'
        });

        // Should return empty array when records is null (covering line 24)
        expect(Array.isArray(result)).toBe(true);
        expect(result).toHaveLength(0);
    });
});