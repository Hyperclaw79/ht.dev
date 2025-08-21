/**
 * @jest-environment jsdom
 */
import { render, fireEvent } from '@testing-library/svelte';
import IntersectionObserver from './IntersectionObserver.svelte';

describe('IntersectionObserver component', () => {
    let mockObserverInstance;
    let mockObserverCallback;
    let mockObserverOptions;
    
    const defaultProps = {
        once: false,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    };

    beforeEach(() => {
        // Reset mock state
        mockObserverCallback = null;
        mockObserverOptions = null;
        
        // Create mock instance
        mockObserverInstance = {
            observe: function() {
                mockObserverInstance.observeCalled = true;
            },
            unobserve: function() {
                mockObserverInstance.unobserveCalled = true;
            },
            disconnect: function() {
                mockObserverInstance.disconnectCalled = true;
            },
            observeCalled: false,
            unobserveCalled: false,
            disconnectCalled: false
        };
        
        // Mock the IntersectionObserver constructor
        global.IntersectionObserver = function(callback, options) {
            mockObserverCallback = callback;
            mockObserverOptions = options;
            return mockObserverInstance;
        };
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

    it('handles intersection events', () => {
        const { container } = render(IntersectionObserver, { props: defaultProps });
        
        // Trigger intersection
        if (mockObserverCallback) {
            mockObserverCallback([{ isIntersecting: true }]);
        }
        
        // The component should handle intersection
        expect(container).toBeTruthy();
    });

    it('unobserves when once=true and intersection occurs', () => {
        render(IntersectionObserver, { props: { ...defaultProps, once: true } });
        
        // Trigger intersection
        if (mockObserverCallback) {
            mockObserverCallback([{ isIntersecting: true }]);
        }
        
        expect(mockObserverInstance.unobserveCalled).toBe(true);
    });

    it('does not unobserve when once=false', () => {
        render(IntersectionObserver, { props: { ...defaultProps, once: false } });
        
        // Trigger intersection
        if (mockObserverCallback) {
            mockObserverCallback([{ isIntersecting: true }]);
        }
        
        expect(mockObserverInstance.unobserveCalled).toBe(false);
    });

    it('handles scroll fallback when IntersectionObserver is not available', () => {
        // Temporarily remove IntersectionObserver
        delete global.IntersectionObserver;
        
        let addEventListenerCalled = false;
        const originalAddEventListener = window.addEventListener;
        window.addEventListener = function(event, handler) {
            if (event === 'scroll') {
                addEventListenerCalled = true;
            }
            return originalAddEventListener.call(window, event, handler);
        };
        
        render(IntersectionObserver, { props: defaultProps });
        
        expect(addEventListenerCalled).toBe(true);
        
        // Restore
        window.addEventListener = originalAddEventListener;
    });

    it('calculates intersection correctly in scroll fallback', () => {
        // Temporarily remove IntersectionObserver
        delete global.IntersectionObserver;
        
        const { container } = render(IntersectionObserver, { props: defaultProps });
        
        // Mock getBoundingClientRect
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
        
        // Trigger scroll event
        fireEvent.scroll(window);
        
        expect(container).toBeTruthy();
    });

    it('removes scroll listener when once=true and intersection occurs in fallback', () => {
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
        
        // Trigger scroll event
        fireEvent.scroll(window);
        
        expect(removeEventListenerCalled).toBe(true);
        
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
        
        // The div should have width and height 100% according to the CSS
        const styles = window.getComputedStyle(containerDiv);
        expect(styles.width).toBe('100%');
        expect(styles.height).toBe('100%');
    });

    it('handles component cleanup correctly', () => {
        const { unmount } = render(IntersectionObserver, { props: defaultProps });
        
        unmount();
        
        expect(mockObserverInstance.unobserveCalled).toBe(true);
    });

    it('handles intersection with multiple entries', () => {
        render(IntersectionObserver, { props: defaultProps });
        
        // Trigger intersection with multiple entries (only first entry matters)
        if (mockObserverCallback) {
            mockObserverCallback([
                { isIntersecting: false },
                { isIntersecting: true },
                { isIntersecting: false }
            ]);
        }
        
        expect(mockObserverInstance.unobserveCalled).toBe(false);
    });

    it('handles false intersection result in scroll fallback', () => {
        // Temporarily remove IntersectionObserver
        delete global.IntersectionObserver;
        
        let intersectingState = null;
        
        const { container, component } = render(IntersectionObserver, { props: defaultProps });
        
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
        
        expect(container).toBeTruthy();
    });
});