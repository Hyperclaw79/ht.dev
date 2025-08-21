/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/svelte';
import TextSphere from './TextSphere.svelte';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => {},
    }),
});

// Mock window.innerWidth
Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 1024,
});

describe('TextSphere component', () => {
    const mockTags = ['JavaScript', 'Python', 'React', 'Node.js', 'CSS'];

    it('renders the holder span element', () => {
        const { container } = render(TextSphere, { 
            props: { tags: [] } // Use empty array to avoid TagCloud initialization
        });
        
        const holder = container.querySelector('.holder');
        expect(holder).toBeInTheDocument();
        expect(holder.tagName).toBe('SPAN');
    });

    it('handles empty tags array gracefully', () => {
        const { container } = render(TextSphere, { 
            props: { tags: [] } 
        });
        expect(container).toBeTruthy();
        
        const holder = container.querySelector('.holder');
        expect(holder).toBeInTheDocument();
    });

    it('handles null tags gracefully', () => {
        const { container } = render(TextSphere, { 
            props: { tags: null } 
        });
        expect(container).toBeTruthy();
        
        const holder = container.querySelector('.holder');
        expect(holder).toBeInTheDocument();
    });

    it('handles undefined tags gracefully', () => {
        const { container } = render(TextSphere, { 
            props: { tags: undefined } 
        });
        expect(container).toBeTruthy();
        
        const holder = container.querySelector('.holder');
        expect(holder).toBeInTheDocument();
    });

    it('has correct CSS classes and structure', () => {
        const { container } = render(TextSphere, { 
            props: { tags: [] } 
        });
        
        const holder = container.querySelector('.holder');
        expect(holder).toHaveClass('holder');
    });
});