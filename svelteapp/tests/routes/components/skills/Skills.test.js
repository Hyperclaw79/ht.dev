/**
 * @jest-environment jsdom
 */
import { fireEvent, render, waitFor } from '@testing-library/svelte';
import Skills from 'src/routes/components/skills/Skills.svelte';
import { writable } from 'svelte/store';

const payload = {
    totalSkills: 5,
    categories: [
        { name: 'Languages', order: 10, skills: [
            { name: 'Python', order: 10, icon: '/icons/python.webp' },
            { name: 'TypeScript', order: 20 }
        ] },
        { name: 'Backend', order: 20, skills: [
            { name: 'Django REST Framework (DRF)', order: 10 },
            { name: 'FastAPI', order: 20 }
        ] },
        { name: 'Data', order: 30, skills: [{ name: 'PostgreSQL', order: 10 }] }
    ]
};

const renderSkills = (value = payload, props = {}) => render(Skills, {
    props,
    context: new Map([['api', new Map([['skills', writable(value)]])]])
});

describe('Skills explorer', () => {
    test('renders API-provided categories and counts', async () => {
        const { container } = renderSkills();
        await waitFor(() => {
            expect(container.querySelector('h1')).toHaveTextContent('SKILLS');
            expect(container.textContent).toContain('5 skills');
            expect(container.textContent).toContain('3 categories');
            expect([...container.querySelectorAll('.group-title')].map((node) => node.textContent.trim()))
                .toEqual(['Languages', 'Backend', 'Data']);
        });
    });

    test('uses category terminology rather than domain terminology', () => {
        const { container } = renderSkills();
        expect(container.textContent).toContain('Category index');
        expect(container.textContent).toContain('CATEGORY / 02');
        expect(container.textContent).not.toMatch(/domain/i);
    });

    test('defaults to the second API category and renders its skill cards', async () => {
        const { container } = renderSkills();
        await waitFor(() => {
            expect(container.querySelector('.stage-title')).toHaveTextContent('Backend');
            expect(container.querySelectorAll('.skill-card')).toHaveLength(2);
            expect(container.textContent).toContain('Django REST Framework (DRF)');
            expect(container.textContent).toContain('FastAPI');
        });
    });

    test('switches categories from the API-driven rail', async () => {
        const { container, getByRole } = renderSkills();
        await fireEvent.click(getByRole('button', { name: /Languages/i }));
        await waitFor(() => {
            expect(container.querySelector('.stage-title')).toHaveTextContent('Languages');
            expect(container.textContent).toContain('Python');
        });
    });

    test('shows overview and drills back into a category', async () => {
        const { container, getByRole } = renderSkills();
        await fireEvent.click(getByRole('button', { name: /Overview \/ all categories/i }));
        await waitFor(() => {
            expect(container.querySelector('.stage-title')).toHaveTextContent('Skill Map');
            expect(container.querySelectorAll('.overview-card')).toHaveLength(3);
        });
        const dataOverview = [...container.querySelectorAll('.overview-card')]
            .find((node) => node.textContent.includes('Data'));
        await fireEvent.click(dataOverview);
        await waitFor(() => expect(container.querySelector('.stage-title')).toHaveTextContent('Data'));
    });

    test('filters across all categories using live search', async () => {
        const { container, getByLabelText } = renderSkills();
        await fireEvent.input(getByLabelText('Filter skills'), { target: { value: 'post' } });
        await waitFor(() => {
            expect(container.querySelector('.eyebrow')).toHaveTextContent('SEARCH / LIVE');
            expect(container.querySelector('.stage-title')).toHaveTextContent('1 Match');
            expect(container.textContent).toContain('PostgreSQL');
        });
    });

    test('uses the inview prop on the explorer shell', () => {
        const { container } = renderSkills(payload, { inview: true });
        expect(container.querySelector('.skills-shell')).toHaveClass('inview');
    });

    test('renders nothing when API has no categories', () => {
        const { container } = renderSkills({ totalSkills: 0, categories: [] });
        expect(container.innerHTML.trim()).toBe('');
    });
});
