import getSkills from './getter.js';

describe('skills getter', () => {
    it('should be a function', () => {
        expect(typeof getSkills).toBe('function');
    });

    it('should be async function', () => {
        expect(getSkills.constructor.name).toBe('AsyncFunction');
    });
});