import getEducation from './getter.js';

describe('education getter', () => {
    it('should be a function', () => {
        expect(typeof getEducation).toBe('function');
    });

    it('should be async function', () => {
        expect(getEducation.constructor.name).toBe('AsyncFunction');
    });
});