import getProjects from './getter.js';

describe('projects getter', () => {
    it('should be a function', () => {
        expect(typeof getProjects).toBe('function');
    });

    it('should be async function', () => {
        expect(getProjects.constructor.name).toBe('AsyncFunction');
    });
});