/**
 * @jest-environment node
 */
import { jest } from '@jest/globals';

// Mock pbClient to return array format instead of object format
jest.unstable_mockModule('src/routes/api/pbClient.js', () => {
    return {
        getRecords: jest.fn().mockResolvedValue([
            { category: 'Languages', name: 'JavaScript', level: 'Advanced' },
            { category: 'Frameworks', name: 'React', level: 'Intermediate' },
            { category: 'Databases', name: 'MongoDB', level: 'Beginner' }
        ])
    };
});

describe('skills getter with array data (line 11 coverage)', () => {
    it('should categorize array data when Technical Skills key does not exist', async () => {
        // Import after the mock is set up
        const getSkills = (await import('./getter.js')).default;
        
        const authData = { email: 'test@test.com', password: 'test123' };
        const result = await getSkills(authData);
        
        // Since we mocked getRecords to return array format (no "Technical Skills" key),
        // this should trigger line 11: return _categorize(records);
        expect(typeof result).toBe('object');
        expect(result).not.toBeNull();
        
        // The result should be categorized into an object structure
        expect(result).toHaveProperty('Languages');
        expect(result).toHaveProperty('Frameworks');
        expect(result).toHaveProperty('Databases');
        
        // Verify categorization worked correctly
        expect(Array.isArray(result['Languages'])).toBe(true);
        expect(result['Languages']).toHaveLength(1);
        expect(result['Languages'][0]).toMatchObject({
            name: 'JavaScript',
            level: 'Advanced'
        });
        
        // Verify category property was removed
        expect(result['Languages'][0]).not.toHaveProperty('category');
    });
});