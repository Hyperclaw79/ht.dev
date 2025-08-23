/**
 * @jest-environment node
 */
import getAchievements from 'src/routes/api/achievements/getter.js';

describe('achievements getter', () => {
    it('should be a function', () => {
        expect(typeof getAchievements).toBe('function');
    });

    it('should be async function', () => {
        expect(getAchievements.constructor.name).toBe('AsyncFunction');
    });

    it('should return achievements data when called', async () => {
        const authData = { email: 'test@test.com', password: 'test123' };
        const result = await getAchievements(authData);

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
        // Verify the structure of achievement objects
        expect(result[0]).toMatchObject({
            name: expect.any(String),
            type: expect.any(String),
            year: expect.any(String)
        });
    });

    it('should handle different auth data', async () => {
        const authData = { email: 'different@test.com', password: 'diff123' };
        const result = await getAchievements(authData);
        
        // Should still return achievements data (fallback behavior)
        expect(Array.isArray(result)).toBe(true);
    });
});