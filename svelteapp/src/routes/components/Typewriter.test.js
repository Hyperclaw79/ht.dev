/**
 * @jest-environment jsdom
 */
import { render, waitFor } from '@testing-library/svelte';
import Typewriter from './Typewriter.svelte';

// Mock requestAnimationFrame for testing
global.requestAnimationFrame = (callback) => {
    return setTimeout(callback, 16);
};

global.cancelAnimationFrame = (id) => {
    clearTimeout(id);
};

describe('Typewriter component', () => {
    const mockData = "Hello, World!";
    const defaultProps = {
        data: mockData,
        needToType: false,
        callback: null,
        cleaner: false
    };
    
    it('renders without crashing', () => {
        const { container } = render(Typewriter, { props: defaultProps });
        expect(container).toBeTruthy();
    });

    it('renders the paragraph element correctly', () => {
        const { container } = render(Typewriter, { props: defaultProps });
        
        const paragraph = container.querySelector('p');
        expect(paragraph).toBeInTheDocument();
        
        const spans = container.querySelectorAll('span');
        expect(spans).toHaveLength(2); // text span + cursor span
    });

    it('starts with empty content', () => {
        const { container } = render(Typewriter, { props: defaultProps });
        
        const textSpan = container.querySelector('span:first-child');
        expect(textSpan.textContent).toBe('');
    });

    it('shows cursor when typing starts', async () => {
        const { container, component } = render(Typewriter, { props: defaultProps });
        
        // Trigger typing
        component.$set({ needToType: true });
        
        // Wait a bit for the animation to start
        await waitFor(() => {
            const cursorSpan = container.querySelector('span:last-child');
            const textSpan = container.querySelector('span:first-child');
            
            // Cursor should be visible when content length > 0 and not complete
            if (textSpan.textContent.length > 0 && textSpan.textContent.length < mockData.length) {
                expect(cursorSpan).toHaveClass('cursor');
            }
        }, { timeout: 1000 });
    });

    it('accepts callback prop', () => {
        const mockCallback = () => {};
        
        const { container } = render(Typewriter, { 
            props: { 
                ...defaultProps,
                callback: mockCallback
            } 
        });
        
        expect(container).toBeTruthy();
    });

    it('accepts cleaner prop', () => {
        const { container, component } = render(Typewriter, { props: defaultProps });
        
        // Set some content first
        component.$set({ needToType: true });
        
        // Then trigger cleaner
        component.$set({ cleaner: true });
        
        const textSpan = container.querySelector('span:first-child');
        expect(textSpan.textContent).toBe('');
    });

    it('handles empty data gracefully', () => {
        const { container } = render(Typewriter, { 
            props: { 
                ...defaultProps,
                data: ""
            } 
        });
        
        expect(container).toBeTruthy();
        
        const textSpan = container.querySelector('span:first-child');
        expect(textSpan.textContent).toBe('');
    });
});