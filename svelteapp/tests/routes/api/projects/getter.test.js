/**
 * @jest-environment node
 */
import { jest } from '@jest/globals';
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

        expect(result[0]).toMatchObject({
            name: expect.any(String),
            alias: expect.any(String),
            description: expect.any(String)
        });
    });

    it('should filter out hidden projects', async () => {
        const authData = {
            email: 'test@test.com',
            password: 'test123'
        };

        const mockGetRecords = jest.fn().mockResolvedValue([
            { name: 'Visible Project', hidden: false },
            { name: 'Hidden Project', hidden: true }
        ]);

        // Clear the already-loaded getter/pbClient modules.
        jest.resetModules();

        // Mock pbClient BEFORE importing a fresh getter.
        jest.unstable_mockModule('src/routes/api/pbClient.js', () => ({
            getRecords: mockGetRecords
        }));

        const { default: mockedGetProjects } = await import(
            'src/routes/api/projects/getter.js'
        );

        const result = await mockedGetProjects(authData);

        // This assertion is important: it proves we're actually using the mock.
        expect(mockGetRecords).toHaveBeenCalledTimes(1);

        expect(result).toHaveLength(1);
        expect(result[0].name).toBe('Visible Project');
        expect(result.some(project => project.hidden === true)).toBe(false);
    });

    it('should handle different auth data', async () => {
        const authData = {
            email: 'different@test.com',
            password: 'diff123'
        };

        const result = await getProjects(authData);

        expect(Array.isArray(result)).toBe(true);
    });
});