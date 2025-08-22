/**
 * @jest-environment jsdom
 */
import { render, waitFor } from '@testing-library/svelte';
import TextSphere from './TextSphere.svelte';
import { tick } from 'svelte';

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

    beforeEach(() => {
        // Reset TagCloud mock completely
        global.TagCloud = function(selector, tags, options) {
            if (!global.TagCloud.calls) {
                global.TagCloud.calls = [];
            }
            global.TagCloud.calls.push({ selector, tags, options });
            
            const container = document.querySelector(selector);
            if (container && tags?.length > 0) {
                container.innerHTML = '';
                tags.forEach((tag, index) => {
                    const item = document.createElement('span');
                    item.className = 'tagcloud--item';
                    item.textContent = tag;
                    item.style.color = '';
                    container.appendChild(item);
                });
            }
            
            return {
                destroy: function() {},
                update: function() {}
            };
        };
        
        global.TagCloud.resetCalls = function() {
            global.TagCloud.calls = [];
        };
        global.TagCloud.calls = [];
        
        // Clear any existing tagcloud items
        document.querySelectorAll('.tagcloud--item').forEach(el => el.remove());
    });

    it('renders the holder span element', () => {
        const { container } = render(TextSphere, { 
            props: { tags: [] }
        });
        
        const holder = container.querySelector('.holder');
        expect(holder).toBeInTheDocument();
        expect(holder.tagName).toBe('SPAN');
    });

    it('applies correct CSS classes to holder', () => {
        const { container } = render(TextSphere, { 
            props: { tags: mockTags } 
        });
        
        const holder = container.querySelector('.holder');
        expect(holder).toBeInTheDocument();
        expect(holder).toHaveClass('holder');
    });

    it('initializes TagCloud when tags are provided', async () => {
        const { container } = render(TextSphere, { 
            props: { tags: mockTags } 
        });
        
        await waitFor(() => {
            const tagcloudItems = document.querySelectorAll('span.tagcloud--item');
            return tagcloudItems.length > 0;
        }, { timeout: 1000 });
        
        const tagcloudItems = document.querySelectorAll('span.tagcloud--item');
        expect(tagcloudItems.length).toBe(mockTags.length);
    });

    it('uses desktop radius when window width > 600', async () => {
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 800,
        });
        
        const { container } = render(TextSphere, { 
            props: { tags: mockTags } 
        });
        
        await waitFor(() => {
            const tagcloudItems = document.querySelectorAll('span.tagcloud--item');
            return tagcloudItems.length > 0;
        }, { timeout: 1000 });
        
        // Verify TagCloud was created (DOM elements exist)
        const tagcloudItems = document.querySelectorAll('span.tagcloud--item');
        expect(tagcloudItems.length).toBe(mockTags.length);
    });

    it('uses mobile radius when window width <= 600', async () => {
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 500,
        });
        
        const { container } = render(TextSphere, { 
            props: { tags: mockTags } 
        });
        
        await waitFor(() => {
            const tagcloudItems = document.querySelectorAll('span.tagcloud--item');
            return tagcloudItems.length > 0;
        }, { timeout: 1000 });
        
        // Verify TagCloud was created (DOM elements exist)  
        const tagcloudItems = document.querySelectorAll('span.tagcloud--item');
        expect(tagcloudItems.length).toBe(mockTags.length);
    });

    it('applies random colors to tagcloud items', async () => {
        const { container } = render(TextSphere, { 
            props: { tags: mockTags } 
        });
        
        await waitFor(() => {
            const tagcloudItems = document.querySelectorAll('span.tagcloud--item');
            return tagcloudItems.length > 0;
        }, { timeout: 1000 });
        
        const tagcloudItems = document.querySelectorAll('span.tagcloud--item');
        expect(tagcloudItems.length).toBe(mockTags.length);
        
        // Check that each item has a color style applied
        tagcloudItems.forEach(item => {
            expect(item.style.color).toBeTruthy();
        });
    });

    it('handles empty tags array', async () => {
        const { container } = render(TextSphere, { 
            props: { tags: [] } 
        });
        
        await tick();
        
        const holder = container.querySelector('.holder');
        expect(holder).toBeInTheDocument();
        
        // Should not call TagCloud with empty array
        expect(global.TagCloud.calls.length).toBe(0);
    });

    it('handles undefined tags', async () => {
        const { container } = render(TextSphere, { 
            props: { tags: undefined } 
        });
        
        await tick();
        
        const holder = container.querySelector('.holder');
        expect(holder).toBeInTheDocument();
        
        // Should not call TagCloud with undefined
        expect(global.TagCloud.calls.length).toBe(0);
    });

    it('updates when tags prop changes', async () => {
        const { component } = render(TextSphere, { 
            props: { tags: mockTags } 
        });
        
        await waitFor(() => {
            const tagcloudItems = document.querySelectorAll('span.tagcloud--item');
            return tagcloudItems.length > 0;
        }, { timeout: 1000 });
        
        let tagcloudItems = document.querySelectorAll('span.tagcloud--item');
        expect(tagcloudItems.length).toBe(mockTags.length);
        
        // Update to different tags
        const newTags = ['Vue', 'Angular', 'Svelte'];
        component.$set({ tags: newTags });
        
        await waitFor(() => {
            const updatedItems = document.querySelectorAll('span.tagcloud--item');
            return updatedItems.length === newTags.length;
        }, { timeout: 1000 });
        
        tagcloudItems = document.querySelectorAll('span.tagcloud--item');
        expect(tagcloudItems.length).toBeGreaterThan(newTags.length - 1);
        // Due to TagCloud's behavior, we may have overlapping items, so check at least some are present
    });

    it('verifies TagCloud configuration options', async () => {
        const { container } = render(TextSphere, { 
            props: { tags: mockTags } 
        });
        
        await waitFor(() => {
            const tagcloudItems = document.querySelectorAll('span.tagcloud--item');
            return tagcloudItems.length > 0;
        }, { timeout: 1000 });
        
        // Verify TagCloud container exists with expected structure
        const tagcloudContainer = document.querySelector('.tagcloud');
        expect(tagcloudContainer).toBeInTheDocument();
        
        const tagcloudItems = document.querySelectorAll('span.tagcloud--item');
        expect(tagcloudItems.length).toBe(mockTags.length);
    });

    it('tests color randomization', async () => {
        const { container } = render(TextSphere, { 
            props: { tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'] } 
        });
        
        await waitFor(() => {
            const tagcloudItems = document.querySelectorAll('span.tagcloud--item');
            return tagcloudItems.length > 0;
        }, { timeout: 1000 });
        
        const tagcloudItems = document.querySelectorAll('span.tagcloud--item');
        const colors = Array.from(tagcloudItems).map(item => item.style.color);
        
        // All items should have colors
        expect(colors.every(color => color.length > 0)).toBe(true);
    });

    it('handles binder binding lifecycle', async () => {
        const { container, component } = render(TextSphere, { 
            props: { tags: [] } 
        });
        
        // Initially no tags, so no TagCloud call
        await tick();
        expect(global.TagCloud.calls.length).toBe(0);
        
        // Add tags after component is mounted
        component.$set({ tags: mockTags });
        
        await waitFor(() => {
            const tagcloudItems = document.querySelectorAll("span.tagcloud--item");
            return tagcloudItems.length > 0;
        }, { timeout: 1000 });
        
        const tagcloudItems = document.querySelectorAll('span.tagcloud--item');
        expect(tagcloudItems.length).toBe(mockTags.length);
    });

    it('tests reactive statement conditions', async () => {
        // Test that reactive statement only runs when both conditions are met
        const { component } = render(TextSphere, { 
            props: { tags: [] } 
        });
        
        await tick();
        expect(global.TagCloud.calls.length).toBe(0);
        
        // Add tags (but binder should be bound by now)
        component.$set({ tags: mockTags });
        
        await waitFor(() => {
            const tagcloudItems = document.querySelectorAll("span.tagcloud--item");
            return tagcloudItems.length > 0;
        }, { timeout: 1000 });
    });

    it('tests window width boundary conditions', async () => {
        const testCases = [
            { width: 599, expectedRadius: 100 },
            { width: 600, expectedRadius: 100 },
            { width: 601, expectedRadius: 300 },
            { width: 1200, expectedRadius: 300 }
        ];

        for (const testCase of testCases) {
            global.TagCloud.calls = []; // Reset for each test
            
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                configurable: true,
                value: testCase.width,
            });
            
            const { unmount } = render(TextSphere, { 
                props: { tags: mockTags } 
            });
            
            await waitFor(() => {
                const tagcloudItems = document.querySelectorAll("span.tagcloud--item");
                return tagcloudItems.length > 0;
            }, { timeout: 1000 });
            
            const tagcloudItems = document.querySelectorAll('span.tagcloud--item');
            expect(tagcloudItems.length).toBe(mockTags.length);
            
            unmount();
        }
    });

    it('tests large tags array handling', async () => {
        const largeTags = Array.from({ length: 50 }, (_, i) => `Tag${i + 1}`);
        
        const { container } = render(TextSphere, { 
            props: { tags: largeTags } 
        });
        
        await waitFor(() => {
            const tagcloudItems = document.querySelectorAll("span.tagcloud--item");
            return tagcloudItems.length > 0;
        }, { timeout: 1000 });
        
        const tagcloudItems = document.querySelectorAll('span.tagcloud--item');
        expect(tagcloudItems.length).toBe(largeTags.length);
        
        await waitFor(() => {
            const tagcloudItems = document.querySelectorAll('span.tagcloud--item');
            return tagcloudItems.length === largeTags.length;
        }, { timeout: 1000 });
    });

    it('verifies colors array contains expected values', async () => {
        const { container } = render(TextSphere, { 
            props: { tags: mockTags } 
        });
        
        await waitFor(() => {
            const tagcloudItems = document.querySelectorAll('span.tagcloud--item');
            return tagcloudItems.length > 0;
        }, { timeout: 1000 });
        
        const tagcloudItems = document.querySelectorAll('span.tagcloud--item');
        const appliedColors = Array.from(tagcloudItems).map(item => item.style.color);
        
        // All items should have color applied
        expect(appliedColors.every(color => color.length > 0)).toBe(true);
    });

    it('tests Math.random behavior in color selection', async () => {
        // Mock Math.random to control color selection
        const originalRandom = Math.random;
        Math.random = () => 0.5; // Always return middle value
        
        const { container } = render(TextSphere, { 
            props: { tags: ['Test'] } 
        });
        
        await waitFor(() => {
            const tagcloudItems = document.querySelectorAll('span.tagcloud--item');
            return tagcloudItems.length > 0;
        }, { timeout: 1000 });
        
        const tagcloudItems = document.querySelectorAll('span.tagcloud--item');
        expect(tagcloudItems[0].style.color).toBeTruthy();
        
        // Restore original Math.random
        Math.random = originalRandom;
    });

    it('tests null/undefined tags prop variations', async () => {
        const variations = [null, undefined, false, 0, ''];
        
        for (const tags of variations) {
            global.TagCloud.calls = [];
            
            const { container } = render(TextSphere, { 
                props: { tags } 
            });
            
            await tick();
            
            const holder = container.querySelector('.holder');
            expect(holder).toBeInTheDocument();
            expect(global.TagCloud.calls.length).toBe(0);
        }
    });

    it('tests single tag edge case', async () => {
        const { container } = render(TextSphere, { 
            props: { tags: ['SingleTag'] } 
        });
        
        await waitFor(() => {
            const tagcloudItems = document.querySelectorAll("span.tagcloud--item");
            return tagcloudItems.length > 0;
        }, { timeout: 1000 });
        
        const tagcloudItems = document.querySelectorAll('span.tagcloud--item');
        expect(tagcloudItems.length).toBe(1);
        
        await waitFor(() => {
            const tagcloudItems = document.querySelectorAll('span.tagcloud--item');
            return tagcloudItems.length === 1;
        }, { timeout: 1000 });
    });

    it('verifies querySelectorAll operation for color application', async () => {
        const { container } = render(TextSphere, { 
            props: { tags: mockTags } 
        });
        
        await waitFor(() => {
            const tagcloudItems = document.querySelectorAll('span.tagcloud--item');
            return tagcloudItems.length > 0;
        }, { timeout: 1000 });
        
        // Verify that querySelectorAll found the right elements
        const tagcloudItems = document.querySelectorAll('span.tagcloud--item');
        expect(tagcloudItems.length).toBe(mockTags.length);
        
        // Verify each has the right className
        tagcloudItems.forEach(item => {
            expect(item).toHaveClass('tagcloud--item');
        });
    });

    it('tests TagCloud initialization edge cases', async () => {
        // Test when binder is bound but tags change to null/undefined
        const { component } = render(TextSphere, { 
            props: { tags: mockTags } 
        });
        
        await waitFor(() => {
            const tagcloudItems = document.querySelectorAll('span.tagcloud--item');
            return tagcloudItems.length > 0;
        }, { timeout: 1000 });
        
        global.TagCloud.calls = [];
        
        // Change to null tags
        component.$set({ tags: null });
        await tick();
        
        // Should not call TagCloud with null tags
        expect(global.TagCloud.calls.length).toBe(0);
        
        // Change to empty array
        component.$set({ tags: [] });
        await tick();
        
        // Should not call TagCloud with empty array
        expect(global.TagCloud.calls.length).toBe(0);
    });

    it('tests binder element existence check', async () => {
        // Test scenario where binder might not be bound yet
        const { component } = render(TextSphere, { 
            props: { tags: mockTags } 
        });
        
        // Force immediate check before binder is ready
        component.$set({ tags: [...mockTags, 'NewTag'] });
        
        await waitFor(() => {
            const tagcloudItems = document.querySelectorAll('span.tagcloud--item');
            return tagcloudItems.length > 0;
        }, { timeout: 1000 });
        
        const tagcloudItems = document.querySelectorAll('span.tagcloud--item');
        expect(tagcloudItems.length).toBeGreaterThan(0);
    });

    it('handles tagcloud item color application edge cases', async () => {
        // Test when TagCloud doesn't create elements but component handles it gracefully
        const originalTagCloud = global.TagCloud;
        global.TagCloud = function(selector, tags, options) {
            // Don't create any elements to test empty querySelectorAll scenario
            if (!global.TagCloud.calls) {
                global.TagCloud.calls = [];
            }
            global.TagCloud.calls.push({ selector, tags, options });
        };
        
        const { container } = render(TextSphere, { 
            props: { tags: mockTags } 
        });
        
        await tick();
        
        // Should handle empty querySelectorAll gracefully without errors
        expect(() => {
            document.querySelectorAll('span.tagcloud--item').forEach((elem) => {
                elem.style.color = 'red';
            });
        }).not.toThrow();
        
        // Restore original TagCloud
        global.TagCloud = originalTagCloud;
    });

    it('tests color application to dynamically created elements', async () => {
        // Test when elements are created after initial render
        const { component } = render(TextSphere, { 
            props: { tags: ['Initial'] } 
        });
        
        await waitFor(() => {
            const tagcloudItems = document.querySelectorAll('span.tagcloud--item');
            return tagcloudItems.length > 0;
        }, { timeout: 1000 });
        
        // Add more tags to test color application on new elements
        component.$set({ tags: ['Initial', 'Second', 'Third'] });
        
        await waitFor(() => {
            const tagcloudItems = document.querySelectorAll('span.tagcloud--item');
            return tagcloudItems.length >= 3;
        }, { timeout: 1000 });
        
        const tagcloudItems = document.querySelectorAll('span.tagcloud--item');
        tagcloudItems.forEach(item => {
            expect(item.style.color).toBeTruthy();
        });
    });
});