import getSocials from './getter.js';

describe('socials getter', () => {
    it('should be a function', () => {
        expect(typeof getSocials).toBe('function');
    });

    it('should be async function', () => {
        expect(getSocials.constructor.name).toBe('AsyncFunction');
    });
});