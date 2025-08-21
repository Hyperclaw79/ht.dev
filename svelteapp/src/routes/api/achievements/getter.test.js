import getAchievements from './getter.js';

describe('achievements getter', () => {
    it('should be a function', () => {
        expect(typeof getAchievements).toBe('function');
    });

    it('should be async function', () => {
        expect(getAchievements.constructor.name).toBe('AsyncFunction');
    });
});