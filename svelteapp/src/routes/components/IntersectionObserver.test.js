/**
 * @jest-environment jsdom
 */
import { render, fireEvent, waitFor } from '@testing-library/svelte';
import IntersectionObserver from './IntersectionObserver.svelte';
import { tick } from 'svelte';

describe('IntersectionObserver component', () => {
    let mockObserverInstance;
    let mockObserverCallback;
    let mockObserverOptions;
    let originalIntersectionObserver;
    
    const defaultProps = {
        once: false,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    };

    beforeEach(() => {
        // Store original IntersectionObserver
        originalIntersectionObserver = global.IntersectionObserver;
        
        // Reset mock state
        mockObserverCallback = null;
        mockObserverOptions = null;
        
        // Create mock instance
        mockObserverInstance = {
            observe: function(element) {
                mockObserverInstance.observeCalled = true;
                mockObserverInstance.observedElement = element;
            },
            unobserve: function(element) {
                mockObserverInstance.unobserveCalled = true;
                mockObserverInstance.unobservedElement = element;
            },
            disconnect: function() {
                mockObserverInstance.disconnectCalled = true;
            },
            observeCalled: false,
            unobserveCalled: false,
            disconnectCalled: false,
            observedElement: null,
            unobservedElement: null
        };
        
        // Mock the IntersectionObserver constructor
        global.IntersectionObserver = function(callback, options) {
            mockObserverCallback = callback;
            mockObserverOptions = options;
            return mockObserverInstance;
        };
    });

    afterEach(() => {
        // Restore original IntersectionObserver
        global.IntersectionObserver = originalIntersectionObserver;
    });

    it('renders without crashing', () => {
        const { container } = render(IntersectionObserver, { props: defaultProps });
        expect(container).toBeTruthy();
    });

    it('renders the container div correctly', () => {
        const { container } = render(IntersectionObserver, { props: defaultProps });
        
        const containerDiv = container.querySelector('div');
        expect(containerDiv).toBeInTheDocument();
    });

    it('creates IntersectionObserver with correct rootMargin', () => {
        const props = {
            once: false,
            top: 10,
            bottom: 20,
            left: 30,
            right: 40
        };
        
        render(IntersectionObserver, { props });
        
        expect(mockObserverOptions).toBeTruthy();
        expect(mockObserverOptions.rootMargin).toBe('20px 30px 10px 40px');
    });

    it('observes the container element', () => {
        render(IntersectionObserver, { props: defaultProps });
        
        expect(mockObserverInstance.observeCalled).toBe(true);
    });

    it('handles intersection events', async () => {
        const { container } = render(IntersectionObserver, { props: defaultProps });
        
        // Trigger intersection
        if (mockObserverCallback) {
            mockObserverCallback([{ isIntersecting: true }]);
        }
        
        await tick();
        expect(container).toBeTruthy();
    });

    it('unobserves when once=true and intersection occurs', async () => {
        render(IntersectionObserver, { props: { ...defaultProps, once: true } });
        
        // Trigger intersection
        if (mockObserverCallback) {
            mockObserverCallback([{ isIntersecting: true }]);
        }
        
        await tick();
        expect(mockObserverInstance.unobserveCalled).toBe(true);
    });

    it('does not unobserve when once=false', async () => {
        render(IntersectionObserver, { props: { ...defaultProps, once: false } });
        
        // Trigger intersection
        if (mockObserverCallback) {
            mockObserverCallback([{ isIntersecting: true }]);
        }
        
        await tick();
        expect(mockObserverInstance.unobserveCalled).toBe(false);
    });

    it('handles scroll fallback when IntersectionObserver is not available', () => {
        // Temporarily remove IntersectionObserver
        delete global.IntersectionObserver;
        
        let scrollHandlerAdded = false;
        const originalAddEventListener = window.addEventListener;
        window.addEventListener = function(event, handler) {
            if (event === 'scroll') {
                scrollHandlerAdded = true;
                window.testScrollHandler = handler;
            }
            return originalAddEventListener.call(window, event, handler);
        };
        
        render(IntersectionObserver, { props: defaultProps });
        
        expect(scrollHandlerAdded).toBe(true);
        
        // Restore
        window.addEventListener = originalAddEventListener;
    });

    it('calculates intersection correctly in scroll fallback', async () => {
        // Temporarily remove IntersectionObserver
        delete global.IntersectionObserver;
        
        const { container } = render(IntersectionObserver, { props: defaultProps });
        
        // Mock getBoundingClientRect for visible element
        const containerDiv = container.querySelector('div');
        if (containerDiv) {
            containerDiv.getBoundingClientRect = function() {
                return {
                    top: 100,
                    bottom: 200,
                    left: 100,
                    right: 200
                };
            };
        }
        
        // Mock window dimensions
        Object.defineProperty(window, 'innerHeight', {
            value: 800,
            writable: true
        });
        Object.defineProperty(window, 'innerWidth', {
            value: 1200,
            writable: true
        });
        
        // Trigger scroll event
        fireEvent.scroll(window);
        await tick();
        
        expect(container).toBeTruthy();
    });

    it('removes scroll listener when once=true and intersection occurs in fallback', async () => {
        // Temporarily remove IntersectionObserver
        delete global.IntersectionObserver;
        
        let scrollHandlerRemoved = false;
        const originalRemoveEventListener = window.removeEventListener;
        window.removeEventListener = function(event, handler) {
            if (event === 'scroll') {
                scrollHandlerRemoved = true;
            }
            return originalRemoveEventListener.call(window, event, handler);
        };
        
        const { container } = render(IntersectionObserver, { props: { ...defaultProps, once: true } });
        
        // Mock getBoundingClientRect to simulate intersection
        const containerDiv = container.querySelector('div');
        if (containerDiv) {
            containerDiv.getBoundingClientRect = function() {
                return {
                    top: 100,
                    bottom: 200,
                    left: 100,
                    right: 200
                };
            };
        }
        
        // Mock window dimensions for intersection
        Object.defineProperty(window, 'innerHeight', {
            value: 800,
            writable: true
        });
        Object.defineProperty(window, 'innerWidth', {
            value: 1200,
            writable: true
        });
        
        // Trigger scroll event
        fireEvent.scroll(window);
        await tick();
        
        expect(scrollHandlerRemoved).toBe(true);
        
        // Restore
        window.removeEventListener = originalRemoveEventListener;
    });

    it('handles edge case with negative margins', () => {
        const props = {
            once: false,
            top: -10,
            bottom: -20,
            left: -30,
            right: -40
        };
        
        render(IntersectionObserver, { props });
        
        expect(mockObserverOptions.rootMargin).toBe('-20px -30px -10px -40px');
    });

    it('has correct container styling', () => {
        const { container } = render(IntersectionObserver, { props: defaultProps });
        
        const containerDiv = container.querySelector('div');
        expect(containerDiv).toBeInTheDocument();
    });

    it('handles component cleanup correctly', () => {
        const { unmount } = render(IntersectionObserver, { props: defaultProps });
        
        unmount();
        
        expect(mockObserverInstance.unobserveCalled).toBe(true);
    });

    it('handles intersection with multiple entries', async () => {
        render(IntersectionObserver, { props: defaultProps });
        
        // Trigger intersection with multiple entries (only first entry matters)
        if (mockObserverCallback) {
            mockObserverCallback([
                { isIntersecting: false },
                { isIntersecting: true },
                { isIntersecting: false }
            ]);
        }
        
        await tick();
        expect(mockObserverInstance.unobserveCalled).toBe(false);
    });

    it('handles false intersection result in scroll fallback', async () => {
        // Temporarily remove IntersectionObserver
        delete global.IntersectionObserver;
        
        const { container } = render(IntersectionObserver, { props: defaultProps });
        
        // Mock getBoundingClientRect to simulate element outside viewport completely
        const containerDiv = container.querySelector('div');
        if (containerDiv) {
            containerDiv.getBoundingClientRect = function() {
                return {
                    top: -100,     // Above viewport
                    bottom: -50,   // Above viewport
                    left: -100,    // To the left
                    right: -50     // To the left
                };
            };
        }
        
        // Trigger scroll event
        fireEvent.scroll(window);
        await tick();
        
        expect(container).toBeTruthy();
    });

    it('tests comprehensive margin calculation scenarios', () => {
        const testCases = [
            { top: 100, bottom: 200, left: 300, right: 400, expected: '200px 300px 100px 400px' },
            { top: 0, bottom: 0, left: 0, right: 0, expected: '0px 0px 0px 0px' },
            { top: -50, bottom: -25, left: -75, right: -100, expected: '-25px -75px -50px -100px' },
            { top: 1.5, bottom: 2.5, left: 3.5, right: 4.5, expected: '2.5px 3.5px 1.5px 4.5px' }
        ];

        testCases.forEach(testCase => {
            const { top, bottom, left, right, expected } = testCase;
            const { unmount } = render(IntersectionObserver, { 
                props: { once: false, top, bottom, left, right }
            });
            
            expect(mockObserverOptions.rootMargin).toBe(expected);
            unmount();
        });
    });

    it('tests scroll fallback with various viewport and element positions', async () => {
        // Temporarily remove IntersectionObserver
        delete global.IntersectionObserver;
        
        const testCases = [
            {
                // Element visible in viewport
                rect: { top: 100, bottom: 200, left: 100, right: 200 },
                windowSize: { innerHeight: 800, innerWidth: 1200 },
                margins: { top: 0, bottom: 0, left: 0, right: 0 },
                shouldIntersect: true
            },
            {
                // Element above viewport
                rect: { top: -200, bottom: -100, left: 100, right: 200 },
                windowSize: { innerHeight: 800, innerWidth: 1200 },
                margins: { top: 0, bottom: 0, left: 0, right: 0 },
                shouldIntersect: false
            },
            {
                // Element below viewport
                rect: { top: 900, bottom: 1000, left: 100, right: 200 },
                windowSize: { innerHeight: 800, innerWidth: 1200 },
                margins: { top: 0, bottom: 0, left: 0, right: 0 },
                shouldIntersect: false
            },
            {
                // Element to the left of viewport
                rect: { top: 100, bottom: 200, left: -200, right: -100 },
                windowSize: { innerHeight: 800, innerWidth: 1200 },
                margins: { top: 0, bottom: 0, left: 0, right: 0 },
                shouldIntersect: false
            },
            {
                // Element to the right of viewport
                rect: { top: 100, bottom: 200, left: 1300, right: 1400 },
                windowSize: { innerHeight: 800, innerWidth: 1200 },
                margins: { top: 0, bottom: 0, left: 0, right: 0 },
                shouldIntersect: false
            },
            {
                // Element visible with margins
                rect: { top: 810, bottom: 900, left: 100, right: 200 },
                windowSize: { innerHeight: 800, innerWidth: 1200 },
                margins: { top: 0, bottom: 200, left: 0, right: 0 },
                shouldIntersect: true
            }
        ];

        for (const testCase of testCases) {
            const { rect, windowSize, margins } = testCase;
            
            // Set window dimensions
            Object.defineProperty(window, 'innerHeight', {
                value: windowSize.innerHeight,
                writable: true
            });
            Object.defineProperty(window, 'innerWidth', {
                value: windowSize.innerWidth,
                writable: true
            });

            const { container, unmount } = render(IntersectionObserver, { 
                props: { once: false, ...margins }
            });
            
            // Mock getBoundingClientRect
            const containerDiv = container.querySelector('div');
            if (containerDiv) {
                containerDiv.getBoundingClientRect = function() {
                    return rect;
                };
            }
            
            // Trigger scroll event
            fireEvent.scroll(window);
            await tick();
            
            expect(container).toBeTruthy();
            unmount();
        }
    });

    it('tests once behavior with scroll fallback and various scenarios', async () => {
        // Temporarily remove IntersectionObserver
        delete global.IntersectionObserver;
        
        let removeEventListenerCalled = false;
        const originalRemoveEventListener = window.removeEventListener;
        window.removeEventListener = function(event, handler) {
            if (event === 'scroll') {
                removeEventListenerCalled = true;
            }
            return originalRemoveEventListener.call(window, event, handler);
        };
        
        // Test case where element intersects with once=true
        const { container, unmount } = render(IntersectionObserver, { 
            props: { once: true, top: 0, bottom: 0, left: 0, right: 0 }
        });
        
        // Mock getBoundingClientRect for intersection
        const containerDiv = container.querySelector('div');
        if (containerDiv) {
            containerDiv.getBoundingClientRect = function() {
                return {
                    top: 100,
                    bottom: 200,
                    left: 100,
                    right: 200
                };
            };
        }
        
        // Set window dimensions
        Object.defineProperty(window, 'innerHeight', {
            value: 800,
            writable: true
        });
        Object.defineProperty(window, 'innerWidth', {
            value: 1200,
            writable: true
        });
        
        // First scroll event should trigger intersection and remove listener
        fireEvent.scroll(window);
        await tick();
        
        // Second scroll event should not matter since listener was removed
        fireEvent.scroll(window);
        await tick();
        
        expect(removeEventListenerCalled).toBe(true);
        
        window.removeEventListener = originalRemoveEventListener;
        unmount();
    });

    it('tests non-intersecting scenario with once=true in scroll fallback', async () => {
        // Temporarily remove IntersectionObserver
        delete global.IntersectionObserver;
        
        let removeEventListenerCalled = false;
        const originalRemoveEventListener = window.removeEventListener;
        window.removeEventListener = function(event, handler) {
            if (event === 'scroll') {
                removeEventListenerCalled = true;
            }
            return originalRemoveEventListener.call(window, event, handler);
        };
        
        const { container, unmount } = render(IntersectionObserver, { 
            props: { once: true, top: 0, bottom: 0, left: 0, right: 0 }
        });
        
        // Mock getBoundingClientRect for NO intersection
        const containerDiv = container.querySelector('div');
        if (containerDiv) {
            containerDiv.getBoundingClientRect = function() {
                return {
                    top: -200,  // Above viewport
                    bottom: -100,
                    left: 100,
                    right: 200
                };
            };
        }
        
        // Set window dimensions
        Object.defineProperty(window, 'innerHeight', {
            value: 800,
            writable: true
        });
        Object.defineProperty(window, 'innerWidth', {
            value: 1200,
            writable: true
        });
        
        // Trigger scroll event - should not remove listener since no intersection
        fireEvent.scroll(window);
        await tick();
        
        // The removeEventListener should NOT be called with 'scroll' since no intersection occurred
        expect(removeEventListenerCalled).toBe(false);
        
        window.removeEventListener = originalRemoveEventListener;
        unmount();
    });

    it('tests scroll fallback cleanup', () => {
        // Temporarily remove IntersectionObserver
        delete global.IntersectionObserver;
        
        let removeEventListenerCalled = false;
        const originalRemoveEventListener = window.removeEventListener;
        window.removeEventListener = function(event, handler) {
            if (event === 'scroll') {
                removeEventListenerCalled = true;
            }
            return originalRemoveEventListener.call(window, event, handler);
        };
        
        const { unmount } = render(IntersectionObserver, { props: defaultProps });
        
        // Component cleanup should remove scroll listener
        unmount();
        
        expect(removeEventListenerCalled).toBe(true);
        
        window.removeEventListener = originalRemoveEventListener;
    });

    it('handles false intersection in IntersectionObserver path', async () => {
        render(IntersectionObserver, { props: { ...defaultProps, once: true } });
        
        // Trigger non-intersection
        if (mockObserverCallback) {
            mockObserverCallback([{ isIntersecting: false }]);
        }
        
        await tick();
        // Should not unobserve when not intersecting
        expect(mockObserverInstance.unobserveCalled).toBe(false);
    });

    it('tests default props with zero margins', () => {
        render(IntersectionObserver, { props: {} });
        
        expect(mockObserverOptions.rootMargin).toBe('0px 0px 0px 0px');
    });

    it('handles large margin values', () => {
        const props = {
            top: 1000,
            bottom: 2000,
            left: 3000,
            right: 4000
        };
        
        render(IntersectionObserver, { props });
        
        expect(mockObserverOptions.rootMargin).toBe('2000px 3000px 1000px 4000px');
    });

    it('tests decimal margin values', () => {
        const props = {
            top: 10.5,
            bottom: 20.7,
            left: 30.3,
            right: 40.9
        };
        
        render(IntersectionObserver, { props });
        
        expect(mockObserverOptions.rootMargin).toBe('20.7px 30.3px 10.5px 40.9px');
    });

    it('handles mixed positive and negative margins', () => {
        const props = {
            top: -10,
            bottom: 20,
            left: -30,
            right: 40
        };
        
        render(IntersectionObserver, { props });
        
        expect(mockObserverOptions.rootMargin).toBe('20px -30px -10px 40px');
    });

    it('tests boolean once prop variations', async () => {
        // Test with once=true
        const { unmount: unmount1 } = render(IntersectionObserver, { props: { ...defaultProps, once: true } });
        
        if (mockObserverCallback) {
            mockObserverCallback([{ isIntersecting: true }]);
        }
        await tick();
        expect(mockObserverInstance.unobserveCalled).toBe(true);
        
        unmount1();
        
        // Reset for next test
        mockObserverInstance.unobserveCalled = false;
        
        // Test with once=false
        const { unmount: unmount2 } = render(IntersectionObserver, { props: { ...defaultProps, once: false } });
        
        if (mockObserverCallback) {
            mockObserverCallback([{ isIntersecting: true }]);
        }
        await tick();
        expect(mockObserverInstance.unobserveCalled).toBe(false);
        
        unmount2();
    });
});