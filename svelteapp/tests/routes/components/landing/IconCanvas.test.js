/**
 * @jest-environment jsdom
 */
import { render, waitFor } from '@testing-library/svelte';
import { jest } from '@jest/globals';
import { writable } from 'svelte/store';

jest.unstable_mockModule('src/routes/components/landing/utils.js', () => ({
    getIconData: jest.fn((icons) => icons.map((icon, index) => ({
        icon,
        position: { x: index * 10, y: index * 20 },
        rotation: index * 15
    })))
}));

const { getIconData } = await import('src/routes/components/landing/utils.js');
const { default: IconCanvas } = await import('src/routes/components/landing/IconCanvas.svelte');

const renderCanvas = (categories) => render(IconCanvas, {
    context: new Map([['api', new Map([['skills', writable({
        totalSkills: categories.reduce((n, category) => n + category.skills.length, 0),
        categories
    })]])]])
});

describe('IconCanvas aggregated skill schema', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(Math, 'random').mockReturnValue(0.5);
    });

    afterEach(() => jest.restoreAllMocks());

    test('collects icons across API-provided categories', async () => {
        const { container } = renderCanvas([
            { name: 'Languages', skills: [
                { name: 'Python', icon: '/icons/python.webp' },
                { name: 'SQL' }
            ] },
            { name: 'Frontend', skills: [{ name: 'React', icon: '/icons/react.png' }] },
            { name: 'DevOps', skills: [{ name: 'Git', icon: '/icons/git.png' }] }
        ]);

        await waitFor(() => expect(container.querySelectorAll('img.icon')).toHaveLength(3));
        expect(getIconData).toHaveBeenCalledWith([
            '/icons/python.webp', '/icons/react.png', '/icons/git.png'
        ]);
    });

    test('filters skills without icons', async () => {
        const { container } = renderCanvas([
            { name: 'Systems', skills: [{ name: 'Serial Communication' }] },
            { name: 'Languages', skills: [{ name: 'Python', icon: '/icons/python.webp' }] }
        ]);

        await waitFor(() => expect(container.querySelectorAll('img.icon')).toHaveLength(1));
        expect(getIconData).toHaveBeenCalledWith(['/icons/python.webp']);
    });

    test('renders no icons when no aggregated skill has an icon', () => {
        const { container } = renderCanvas([
            { name: 'Languages', skills: [{ name: 'SQL' }] },
            { name: 'Networking', skills: [{ name: 'DNS' }] }
        ]);
        expect(container.querySelectorAll('img.icon')).toHaveLength(0);
        expect(getIconData).not.toHaveBeenCalled();
    });
});
