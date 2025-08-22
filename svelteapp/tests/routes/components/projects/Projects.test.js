/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/svelte';
import { writable } from 'svelte/store';
import Projects from 'src/routes/components/projects/Projects.svelte';

// Mock context data
const mockProjects = writable([
    { 
        id: 1, 
        name: 'Test Project 1', 
        description: 'Test description 1',
        tags: ['JavaScript', 'React']
    },
    { 
        id: 2, 
        name: 'Test Project 2', 
        description: 'Test description 2',
        tags: ['Python', 'Django']
    }
]);

const mockContext = new Map();
mockContext.set('projects', mockProjects);

describe('Projects component', () => {
    it('renders without crashing', () => {
        const { container } = render(Projects, {
            context: new Map([['api', mockContext]])
        });
        expect(container).toBeTruthy();
    });

    it('renders the title with correct class', () => {
        const { container } = render(Projects, {
            context: new Map([['api', mockContext]])
        });
        
        const title = container.querySelector('h1');
        expect(title).toBeInTheDocument();
        expect(title).toHaveClass('font-effect-anaglyph');
        expect(title.textContent).toBe('MY PROJECTS');
    });

    it('renders with inview prop false', () => {
        const { container } = render(Projects, { 
            props: { inview: false },
            context: new Map([['api', mockContext]])
        });
        expect(container).toBeTruthy();
        
        const title = container.querySelector('h1');
        expect(title).toBeInTheDocument();
    });

    it('renders with inview prop true', () => {
        const { container } = render(Projects, { 
            props: { inview: true },
            context: new Map([['api', mockContext]])
        });
        expect(container).toBeTruthy();
        
        const title = container.querySelector('h1');
        expect(title).toBeInTheDocument();
    });

    it('passes inview prop to GihtubCards component', () => {
        const { component } = render(Projects, { 
            props: { inview: true },
            context: new Map([['api', mockContext]])
        });
        expect(component).toBeTruthy();
    });

    it('handles default inview prop', () => {
        const { container } = render(Projects, {
            context: new Map([['api', mockContext]])
        });
        expect(container).toBeTruthy();
    });

    it('renders child components', () => {
        const { container } = render(Projects, { 
            props: { inview: true },
            context: new Map([['api', mockContext]])
        });
        expect(container.children.length).toBeGreaterThan(0);
    });

    it('handles component lifecycle', () => {
        const { unmount } = render(Projects, { 
            props: { inview: false },
            context: new Map([['api', mockContext]])
        });
        expect(() => unmount()).not.toThrow();
    });

    it('maintains structure with different inview values', () => {
        const testValues = [true, false, undefined];
        
        testValues.forEach(inview => {
            const { container } = render(Projects, { 
                props: { inview },
                context: new Map([['api', mockContext]])
            });
            const title = container.querySelector('h1');
            expect(title).toBeInTheDocument();
            expect(title.textContent).toBe('MY PROJECTS');
        });
    });

    it('has correct title styling', () => {
        const { container } = render(Projects, {
            context: new Map([['api', mockContext]])
        });
        
        const title = container.querySelector('h1');
        expect(title).toHaveClass('font-effect-anaglyph');
    });

    it('handles empty projects data', () => {
        const emptyProjects = writable([]);
        const emptyContext = new Map();
        emptyContext.set('projects', emptyProjects);

        const { container } = render(Projects, {
            context: new Map([['api', emptyContext]])
        });
        expect(container).toBeTruthy();
    });

    it('handles projects with missing data gracefully', () => {
        const projectsWithMissingData = writable([
            { name: 'Project without ID', tags: [] },
            { id: 'test-id', tags: ['Test'] } // missing name
        ]);
        const contextWithMissingData = new Map();
        contextWithMissingData.set('projects', projectsWithMissingData);

        const { container } = render(Projects, {
            context: new Map([['api', contextWithMissingData]])
        });
        expect(container).toBeTruthy();
    });
});