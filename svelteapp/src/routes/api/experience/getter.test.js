import getExperience from './getter.js';

describe('experience getter', () => {
    it('should be a function', () => {
        expect(typeof getExperience).toBe('function');
    });

    it('should be async function', () => {
        expect(getExperience.constructor.name).toBe('AsyncFunction');
    });
});