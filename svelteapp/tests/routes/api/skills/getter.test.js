/**
 * @jest-environment node
 */
import getSkills, { aggregateByCategory } from 'src/routes/api/skills/getter.js';

describe('skills getter', () => {
    test('exports an async getter', () => {
        expect(typeof getSkills).toBe('function');
        expect(getSkills.constructor.name).toBe('AsyncFunction');
    });

    test('returns raw records by default through the fallback path', async () => {
        const result = await getSkills({ email: 'test@test.com', password: 'test123' });
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
        expect(result[0]).toHaveProperty('category');
        expect(result[0]).toHaveProperty('categoryOrder');
    });

    test('returns aggregated categories when requested', async () => {
        const result = await getSkills(
            { email: 'test@test.com', password: 'test123' },
            { aggregate: 'category' }
        );
        expect(result.totalSkills).toBe(55);
        expect(result.categories).toHaveLength(9);
        expect(result.categories[0].name).toBe('Languages');
        expect(result.categories[1].name).toBe('Backend');
    });
});

describe('aggregateByCategory', () => {
    test('derives category order from the records and sorts skills inside each category', () => {
        const result = aggregateByCategory([
            { category: 'Data', categoryOrder: 30, name: 'PostgreSQL', order: 20 },
            { category: 'Languages', categoryOrder: 10, name: 'Python', order: 20 },
            { category: 'Languages', categoryOrder: 10, name: 'SQL', order: 10 },
            { category: 'Backend', categoryOrder: 20, name: 'Django', order: 10 }
        ]);

        expect(result.totalSkills).toBe(4);
        expect(result.categories.map(({ name }) => name)).toEqual(['Languages', 'Backend', 'Data']);
        expect(result.categories[0].skills.map(({ name }) => name)).toEqual(['SQL', 'Python']);
    });

    test('removes aggregation metadata from nested skills while preserving skill fields', () => {
        const result = aggregateByCategory([{
            id: 'skill1', category: 'Languages', categoryOrder: 10,
            name: 'Python', order: 10, icon: '/icons/technical/python.webp'
        }]);

        expect(result.categories[0]).toEqual({
            name: 'Languages',
            order: 10,
            skills: [{ id: 'skill1', name: 'Python', order: 10, icon: '/icons/technical/python.webp' }]
        });
    });

    test('does not invent categories for malformed records', () => {
        expect(aggregateByCategory([{ name: 'No category', order: 10 }])).toEqual({
            totalSkills: 0,
            categories: []
        });
    });
});
