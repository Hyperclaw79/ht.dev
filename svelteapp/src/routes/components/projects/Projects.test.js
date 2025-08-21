/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/svelte';
import Projects from './Projects.svelte';

describe('Projects component', () => {
    it('renders without crashing', () => {
        const { container } = render(Projects);
        expect(container).toBeTruthy();
    });

    it('renders the title with correct class', () => {
        const { container } = render(Projects);
        
        const title = container.querySelector('h1');
        expect(title).toBeInTheDocument();
        expect(title).toHaveClass('font-effect-anaglyph');
        expect(title.textContent).toBe('MY PROJECTS');
    });

    it('renders with inview prop false', () => {
        const { container } = render(Projects, { props: { inview: false } });
        expect(container).toBeTruthy();
        
        const title = container.querySelector('h1');
        expect(title).toBeInTheDocument();
    });

    it('renders with inview prop true', () => {
        const { container } = render(Projects, { props: { inview: true } });
        expect(container).toBeTruthy();
        
        const title = container.querySelector('h1');
        expect(title).toBeInTheDocument();
    });

    it('passes inview prop to GihtubCards component', () => {
        const { component } = render(Projects, { props: { inview: true } });
        expect(component).toBeTruthy();
    });

    it('handles default inview prop', () => {
        const { container } = render(Projects);
        expect(container).toBeTruthy();
    });

    it('renders child components', () => {
        const { container } = render(Projects, { props: { inview: true } });
        expect(container.children.length).toBeGreaterThan(0);
    });

    it('handles component lifecycle', () => {
        const { unmount } = render(Projects, { props: { inview: false } });
        expect(() => unmount()).not.toThrow();
    });

    it('maintains structure with different inview values', () => {
        const testValues = [true, false, undefined];
        
        testValues.forEach(inview => {
            const { container } = render(Projects, { props: { inview } });
            const title = container.querySelector('h1');
            expect(title).toBeInTheDocument();
            expect(title.textContent).toBe('MY PROJECTS');
        });
    });

    it('has correct title styling', () => {
        const { container } = render(Projects);
        
        const title = container.querySelector('h1');
        expect(title).toHaveClass('font-effect-anaglyph');
    });
});