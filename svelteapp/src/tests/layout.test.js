import { ssr } from '../routes/+layout.js';

describe('Layout configuration', () => {
    it('should disable server-side rendering', () => {
        expect(ssr).toBe(false);
    });

    it('should export ssr configuration', () => {
        expect(typeof ssr).toBe('boolean');
    });
});