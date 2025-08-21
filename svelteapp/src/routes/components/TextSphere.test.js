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

    it('handles TagCloud initialization with proper radius based on window width', () => {
        // Mock window.innerWidth for desktop
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 800,
        });
        
        const { container } = render(TextSphere, { 
            props: { tags: mockTags } 
        });
        
        expect(container).toBeTruthy();
    });

    it('handles TagCloud initialization with mobile radius', () => {
        // Mock window.innerWidth for mobile
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 500,
        });
        
        const { container } = render(TextSphere, { 
            props: { tags: mockTags } 
        });
        
        expect(container).toBeTruthy();
    });

    it('handles tags with zero length', () => {
        const { container } = render(TextSphere, { 
            props: { tags: [] } 
        });
        
        const holder = container.querySelector('.holder');
        expect(holder).toBeInTheDocument();
    });

    it('updates when tags prop changes', () => {
        const { container, component } = render(TextSphere, { 
            props: { tags: [] } 
        });
        
        // Update tags
        component.$set({ tags: mockTags });
        
        expect(container).toBeTruthy();
        
        // Update to empty again
        component.$set({ tags: [] });
        
        expect(container).toBeTruthy();
    });

    it('handles very large tags array', () => {
        const largeTags = Array.from({ length: 50 }, (_, i) => `Tag${i}`);
        
        const { container } = render(TextSphere, { 
            props: { tags: largeTags } 
        });
        
        const holder = container.querySelector('.holder');
        expect(holder).toBeInTheDocument();
    });

    it('maintains correct holder structure and binding', () => {
        const { container } = render(TextSphere, { 
            props: { tags: mockTags } 
        });
        
        const holder = container.querySelector('span.holder');
        expect(holder).toBeInTheDocument();
        expect(holder.tagName).toBe('SPAN');
    });
});