/**
 * @jest-environment node
 */
import getProjects from 'src/routes/api/projects/getter.js';

describe('projects getter', () => {
    it('should be a function', () => {
        expect(typeof getProjects).toBe('function');
    });

    it('should be async function', () => {
        expect(getProjects.constructor.name).toBe('AsyncFunction');
    });

    it('should return projects data when called', async () => {
        const authData = { email: 'test@test.com', password: 'test123' };
        const result = await getProjects(authData);

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
        // Verify the structure of project objects
        expect(result[0]).toMatchObject({
            name: expect.any(String),
            alias: expect.any(String),
            description: expect.any(String)
        });
    });

    it('should handle different auth data', async () => {
        const authData = { email: 'different@test.com', password: 'diff123' };
        const result = await getProjects(authData);
        
        // Should still return projects data (fallback behavior)
        expect(Array.isArray(result)).toBe(true);
    });
});