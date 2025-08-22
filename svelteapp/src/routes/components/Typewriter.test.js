/**
 * @jest-environment jsdom
 */
import { render, waitFor } from '@testing-library/svelte';
import Typewriter from './Typewriter.svelte';

// Mock requestAnimationFrame for testing
global.requestAnimationFrame = ((callback) => {
    return setTimeout(callback, 16);
});

global.cancelAnimationFrame = ((id) => {
    clearTimeout(id);
});

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

    it('shows cursor correctly based on content length', () => {
        const { container } = render(Typewriter, { props: defaultProps });
        
        const cursorSpan = container.querySelector('span:last-child');
        
        // Initially no cursor (content length is 0)
        expect(cursorSpan).not.toHaveClass('cursor');
    });

    it('triggers typing animation when needToType is true', async () => {
        let animationFrameCalled = false;
        global.requestAnimationFrame = (callback) => {
            animationFrameCalled = true;
            return setTimeout(callback, 16);
        };
        
        const { component } = render(Typewriter, { props: defaultProps });
        
        // Trigger typing - wait a tick for reactivity
        component.$set({ needToType: true });
        await new Promise(resolve => setTimeout(resolve, 0));
        
        expect(animationFrameCalled).toBe(true);
    });

    it('calls callback when typing is complete', async () => {
        let callbackCalled = false;
        const mockCallback = () => {
            callbackCalled = true;
        };
        
        const { component } = render(Typewriter, { 
            props: { 
                ...defaultProps,
                data: "Hi", // Short data for faster completion
                callback: mockCallback
            } 
        });
        
        // Trigger typing
        component.$set({ needToType: true });
        
        // Wait for callback to be called
        await waitFor(() => {
            expect(callbackCalled).toBe(true);
        }, { timeout: 2000 });
    });

    it('handles cleaner prop to clear content', async () => {
        const { container, component } = render(Typewriter, { 
            props: { 
                ...defaultProps,
                data: "Hello"
            }
        });
        
        // Start typing to get some content
        component.$set({ needToType: true });
        await new Promise(resolve => setTimeout(resolve, 50)); // Give it time to type something
        
        // Now trigger cleaner
        component.$set({ cleaner: true });
        await new Promise(resolve => setTimeout(resolve, 0)); // Wait for reactive update
        
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

    it('handles null data gracefully', () => {
        const { container } = render(Typewriter, { 
            props: { 
                ...defaultProps,
                data: null
            } 
        });
        
        expect(container).toBeTruthy();
    });

    it('handles very long data', async () => {
        const longData = "A".repeat(100);
        
        let animationFrameCalled = false;
        global.requestAnimationFrame = (callback) => {
            animationFrameCalled = true;
            return setTimeout(callback, 16);
        };
        
        const { component } = render(Typewriter, { 
            props: { 
                ...defaultProps,
                data: longData
            } 
        });
        
        // Trigger typing - wait a tick for reactivity
        component.$set({ needToType: true });
        await new Promise(resolve => setTimeout(resolve, 0));
        
        expect(animationFrameCalled).toBe(true);
    });

    it('has correct cursor animation styling', () => {
        const { container } = render(Typewriter, { props: defaultProps });
        
        const cursorSpan = container.querySelector('span:last-child');
        expect(cursorSpan).toBeInTheDocument();
        
        // Check if cursor class is not applied initially
        expect(cursorSpan).not.toHaveClass('cursor');
    });

    it('handles component cleanup correctly', () => {
        const { unmount } = render(Typewriter, { props: defaultProps });
        
        // Should not throw when unmounting
        expect(() => unmount()).not.toThrow();
    });

    it('handles default props correctly', () => {
        const { container } = render(Typewriter, { 
            props: { 
                data: "Test"
            } 
        });
        
        expect(container).toBeTruthy();
        
        const paragraph = container.querySelector('p');
        expect(paragraph).toBeInTheDocument();
    });

    it('handles undefined callback gracefully', async () => {
        const { component } = render(Typewriter, { 
            props: { 
                ...defaultProps,
                data: "Hi",
                callback: undefined
            } 
        });
        
        // Trigger typing
        component.$set({ needToType: true });
        
        // Wait and ensure no crash
        await new Promise(resolve => setTimeout(resolve, 1000));
        expect(true).toBe(true);
    });

    it('handles multiple typing cycles', async () => {
        const { component } = render(Typewriter, { 
            props: { 
                ...defaultProps,
                data: "Test"
            } 
        });
        
        // Trigger typing multiple times
        component.$set({ needToType: true });
        component.$set({ needToType: false });
        component.$set({ needToType: true });
        
        expect(true).toBe(true); // Should not crash
    });

    it('handles text updates during typing', () => {
        const { container, component } = render(Typewriter, { 
            props: { 
                ...defaultProps,
                data: "Initial"
            } 
        });
        
        // Update data while typing
        component.$set({ data: "Updated" });
        
        expect(container).toBeTruthy();
    });

    it('handles rapid property changes', () => {
        const { component } = render(Typewriter, { props: defaultProps });
        
        // Rapidly change properties
        component.$set({ needToType: true, cleaner: true, callback: () => {} });
        component.$set({ needToType: false, cleaner: false, callback: null });
        
        expect(true).toBe(true); // Should not crash
    });

    it('cancels animation frame when appropriate', async () => {
        let cancelAnimationFrameCalled = false;
        global.cancelAnimationFrame = (id) => {
            cancelAnimationFrameCalled = true;
            clearTimeout(id);
        };
        
        const { component } = render(Typewriter, { 
            props: { 
                ...defaultProps,
                data: "Short"
            } 
        });
        
        // Trigger typing
        component.$set({ needToType: true });
        
        // Wait for completion
        await waitFor(() => {
            expect(cancelAnimationFrameCalled).toBe(true);
        }, { timeout: 2000 });
    });

    it('handles content length edge cases', () => {
        const { container } = render(Typewriter, { 
            props: { 
                ...defaultProps,
                data: "A" // Single character
            } 
        });
        
        const spans = container.querySelectorAll('span');
        expect(spans).toHaveLength(2);
    });
});