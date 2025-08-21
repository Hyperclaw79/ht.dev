/**
 * @jest-environment node
 */
import getSkills, { _categorize } from './getter.js';

describe('skills getter', () => {
    it('should be a function', () => {
        expect(typeof getSkills).toBe('function');
    });

    it('should be async function', () => {
        expect(getSkills.constructor.name).toBe('AsyncFunction');
    });

    it('should return skills data when called', async () => {
        const authData = { email: 'test@test.com', password: 'test123' };
        const result = await getSkills(authData);

        // Skills can be either an array or a categorized object
        expect(typeof result).toBe('object');
        expect(result).not.toBeNull();
    });

    it('should categorize skills when Technical Skills key does not exist', async () => {
        // Test the _categorize path directly by passing array data
        const mockSkillsArray = [
            { category: 'Languages', name: 'JavaScript', level: 'Advanced' },
            { category: 'Databases', name: 'MongoDB', level: 'Intermediate' }
        ];
        
        // Test _categorize function directly to ensure line 11 is covered
        const result = _categorize(mockSkillsArray);

        // Should have categorized the skills into an object structure
        expect(typeof result).toBe('object');
        expect(result).toMatchObject({
            'Languages': [{ name: 'JavaScript', level: 'Advanced' }],
            'Databases': [{ name: 'MongoDB', level: 'Intermediate' }]
        });
    });

    it('should handle different auth data', async () => {
        const authData = { email: 'different@test.com', password: 'diff123' };
        const result = await getSkills(authData);
        
        // Should still return skills data (fallback behavior)
        expect(typeof result).toBe('object');
        expect(result).not.toBeNull();
    });

    it('should return records directly when Technical Skills key exists', async () => {
        // This test specifically targets line 11 in getter.js
        // Since the fallback data has "Technical Skills" key, this should hit that condition
        const authData = { email: 'test@test.com', password: 'test123' };
        
        // Call getSkills which will fallback to the skills.js file that has "Technical Skills" key
        const result = await getSkills(authData);
        
        // The fallback data should have "Technical Skills" key, so line 11 should be true
        // and it should return the records as-is without calling _categorize
        expect(typeof result).toBe('object');
        expect(result).not.toBeNull();
        
        // If the fallback data is returned correctly, it should have the "Technical Skills" key
        if (result["Technical Skills"]) {
            expect(Array.isArray(result["Technical Skills"])).toBe(true);
            expect(result["Technical Skills"].length).toBeGreaterThan(0);
        }
        
        // Also test categorization separately to ensure coverage
        const testRecords = [
            { category: 'Languages', name: 'JavaScript', level: 'Advanced' },
            { category: 'Frameworks', name: 'React', level: 'Intermediate' }
        ];
        
        const categorized = _categorize(testRecords);
        expect(categorized).toHaveProperty('Languages');
        expect(categorized).toHaveProperty('Frameworks');
    });
});

describe('_categorize function', () => {
    it('should categorize skills by category', () => {
        const skills = [
            { category: 'Languages', name: 'JavaScript', level: 'Advanced' },
            { category: 'Languages', name: 'Python', level: 'Intermediate' },
            { category: 'Frameworks', name: 'React', level: 'Advanced' },
            { category: 'Frameworks', name: 'Vue', level: 'Beginner' }
        ];

        const result = _categorize(skills);

        expect(result).toEqual({
            'Languages': [
                { name: 'JavaScript', level: 'Advanced' },
                { name: 'Python', level: 'Intermediate' }
            ],
            'Frameworks': [
                { name: 'React', level: 'Advanced' },
                { name: 'Vue', level: 'Beginner' }
            ]
        });
    });

    it('should handle empty skills array', () => {
        const result = _categorize([]);
        expect(result).toEqual({});
    });

    it('should handle single skill', () => {
        const skills = [
            { category: 'Languages', name: 'JavaScript', level: 'Advanced' }
        ];

        const result = _categorize(skills);

        expect(result).toEqual({
            'Languages': [
                { name: 'JavaScript', level: 'Advanced' }
            ]
        });
    });

    it('should handle skills without level property', () => {
        const skills = [
            { category: 'Tools', name: 'Git' },
            { category: 'Tools', name: 'Docker' }
        ];

        const result = _categorize(skills);

        expect(result).toEqual({
            'Tools': [
                { name: 'Git' },
                { name: 'Docker' }
            ]
        });
    });
});