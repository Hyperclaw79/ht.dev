/**
 * @jest-environment node
 */
import getExperience from 'src/routes/api/experience/getter.js';

describe('experience getter', () => {
    it('should be a function', () => {
        expect(typeof getExperience).toBe('function');
    });

    it('should be async function', () => {
        expect(getExperience.constructor.name).toBe('AsyncFunction');
    });

    it('should return experience data when called', async () => {
        const authData = { email: 'test@test.com', password: 'test123' };
        const result = await getExperience(authData);

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
        // Verify the structure of experience objects
        expect(result[0]).toMatchObject({
            name: expect.any(String),
            year: expect.any(String),
            type: expect.any(String)
        });
    });

    it('should sort experience records by end year in descending order', async () => {
        const authData = { email: 'test@test.com', password: 'test123' };
        const result = await getExperience(authData);

        // Since extractEndYear is used for sorting, we should verify the sorting works
        // by checking that most recent job comes first
        expect(result.length).toBeGreaterThan(1);
        const firstJob = result[0];
        const secondJob = result[1];
        
        // Verify that first job has more recent or equal year compared to second
        const firstJobYear = firstJob.year.includes('Present') ? 
            new Date().getFullYear() : 
            parseInt(firstJob.year.split(' – ')[1] || firstJob.year);
        const secondJobYear = secondJob.year.includes('Present') ? 
            new Date().getFullYear() : 
            parseInt(secondJob.year.split(' – ')[1] || secondJob.year);
            
        expect(firstJobYear).toBeGreaterThanOrEqual(secondJobYear);
    });

    it('should handle different auth data', async () => {
        const authData = { email: 'different@test.com', password: 'diff123' };
        const result = await getExperience(authData);
        
        // Should still return experience data (fallback behavior)
        expect(Array.isArray(result)).toBe(true);
    });
});