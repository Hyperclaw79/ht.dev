/**
 * @jest-environment node
 */
import { jest } from '@jest/globals';

const records = [
    { category: 'Data', categoryOrder: 30, name: 'PostgreSQL', order: 20 },
    { category: 'Languages', categoryOrder: 10, name: 'Python', order: 20 },
    { category: 'Languages', categoryOrder: 10, name: 'SQL', order: 10 }
];
const getRecords = jest.fn().mockResolvedValue(records);

jest.unstable_mockModule('src/routes/api/pbClient.js', () => ({ getRecords }));

describe('skills getter record path', () => {
    test('requests category-aware ordering and returns raw records by default', async () => {
        const { default: getSkills } = await import('src/routes/api/skills/getter.js');
        const authData = { email: 'test@test.com', password: 'test123' };

        const result = await getSkills(authData);

        expect(getRecords).toHaveBeenCalledWith({
            collection: 'skills',
            authData,
            sort: 'categoryOrder,order'
        });
        expect(result).toEqual(records);
    });

    test('aggregates only when aggregate=category is requested', async () => {
        const { default: getSkills } = await import('src/routes/api/skills/getter.js');
        const result = await getSkills(
            { email: 'test@test.com', password: 'test123' },
            { aggregate: 'category' }
        );

        expect(result.categories.map(({ name }) => name)).toEqual(['Languages', 'Data']);
        expect(result.categories[0].skills.map(({ name }) => name)).toEqual(['SQL', 'Python']);
    });
});
