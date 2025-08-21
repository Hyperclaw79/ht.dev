/**
 * @jest-environment node
 */
import getEducation from './getter.js';

describe('education getter', () => {
    it('should be a function', () => {
        expect(typeof getEducation).toBe('function');
    });

    it('should be async function', () => {
        expect(getEducation.constructor.name).toBe('AsyncFunction');
    });

    it('should return education data when called', async () => {
        const authData = { email: 'test@test.com', password: 'test123' };
        const result = await getEducation(authData);

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
        // Verify the structure of education objects
        expect(result[0]).toMatchObject({
            specialization: expect.any(String),
            institution: expect.any(String),
            period: expect.any(String)
        });
    });

    it('should sort education records by end year', async () => {
        const authData = { email: 'test@test.com', password: 'test123' };
        const result = await getEducation(authData);

        // Verify sorting by checking that each subsequent record has an earlier or equal end year
        for (let i = 1; i < result.length; i++) {
            const currentYear = parseInt(result[i].period.split(' – ')[1]);
            const previousYear = parseInt(result[i-1].period.split(' – ')[1]);
            expect(currentYear).toBeLessThanOrEqual(previousYear);
        }
    });

    it('should handle different auth data', async () => {
        const authData = { email: 'different@test.com', password: 'diff123' };
        const result = await getEducation(authData);
        
        // Should still return education data (fallback behavior)
        expect(Array.isArray(result)).toBe(true);
    });
});