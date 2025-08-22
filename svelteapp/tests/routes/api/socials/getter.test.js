/**
 * @jest-environment node
 */
import getSocials from '../../../../src/routes/api/socials/getter.js';

describe('socials getter', () => {
    it('should be a function', () => {
        expect(typeof getSocials).toBe('function');
    });

    it('should be async function', () => {
        expect(getSocials.constructor.name).toBe('AsyncFunction');
    });

    it('should return socials data when called', async () => {
        const authData = { email: 'test@test.com', password: 'test123' };
        const result = await getSocials(authData);

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
        // Verify the structure of social objects
        expect(result[0]).toMatchObject({
            name: expect.any(String),
            icon: expect.any(String),
            url: expect.any(String)
        });
    });

    it('should handle different auth data', async () => {
        const authData = { email: 'different@test.com', password: 'diff123' };
        const result = await getSocials(authData);
        
        // Should still return socials data (fallback behavior)
        expect(Array.isArray(result)).toBe(true);
    });
});