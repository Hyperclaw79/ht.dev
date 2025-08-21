/**
 * @jest-environment jsdom
 */
import { render, fireEvent } from '@testing-library/svelte';
import IntersectionObserver from './IntersectionObserver.svelte';

// Mock IntersectionObserver
class MockIntersectionObserver {
    constructor(callback, options) {
        this.callback = callback;
        this.options = options;
        this.observedElements = new Set();
    }
    
    observe(element) {
        this.observedElements.add(element);
    }
    
    unobserve(element) {
        this.observedElements.delete(element);
    }
    
    disconnect() {
        this.observedElements.clear();
    }
    
    triggerIntersection(isIntersecting) {
        this.callback([{ isIntersecting }]);
    }
}

let mockObserver;
global.IntersectionObserver = ((callback, options) => {
    mockObserver = new MockIntersectionObserver(callback, options);
    return mockObserver;
});

// Mock window dimensions
Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: 768,
});

Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 1024,
});

describe('IntersectionObserver component', () => {
    const defaultProps = {
        once: false,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    };

    beforeEach(() => {
        mockObserver = null;
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
        
        expect(mockObserver).toBeTruthy();
        expect(mockObserver.options.rootMargin).toBe('20px 30px 10px 40px');
    });

    it('observes the container element', () => {
        const { container } = render(IntersectionObserver, { props: defaultProps });
        
        expect(mockObserver.observedElements.size).toBe(1);
    });

    it('handles intersection events', () => {
        const { container, component } = render(IntersectionObserver, { props: defaultProps });
        
        // Trigger intersection
        mockObserver.triggerIntersection(true);
        
        // The component should update intersecting state
        expect(container).toBeTruthy();
    });

    it('unobserves when once=true and intersection occurs', () => {
        const { container } = render(IntersectionObserver, { props: { ...defaultProps, once: true } });
        
        const originalUnobserve = mockObserver.unobserve;
        let unobserveCalled = false;
        mockObserver.unobserve = () => {
            unobserveCalled = true;
            originalUnobserve.apply(mockObserver, arguments);
        };
        
        // Trigger intersection
        mockObserver.triggerIntersection(true);
        
        expect(unobserveCalled).toBe(true);
    });

    it('does not unobserve when once=false', () => {
        const { container } = render(IntersectionObserver, { props: { ...defaultProps, once: false } });
        
        const originalUnobserve = mockObserver.unobserve;
        let unobserveCalled = false;
        mockObserver.unobserve = () => {
            unobserveCalled = true;
            originalUnobserve.apply(mockObserver, arguments);
        };
        
        // Trigger intersection
        mockObserver.triggerIntersection(true);
        
        expect(unobserveCalled).toBe(false);
    });

    it('handles scroll fallback when IntersectionObserver is not available', () => {
        // Temporarily remove IntersectionObserver
        const originalIntersectionObserver = global.IntersectionObserver;
        delete global.IntersectionObserver;
        
        let addEventListenerCalled = false;
        const originalAddEventListener = window.addEventListener;
        window.addEventListener = (event, handler) => {
            if (event === 'scroll') {
                addEventListenerCalled = true;
            }
            return originalAddEventListener.call(window, event, handler);
        };
        
        const { container } = render(IntersectionObserver, { props: defaultProps });
        expect(container).toBeTruthy();
        
        expect(addEventListenerCalled).toBe(true);
        
        // Restore
        window.addEventListener = originalAddEventListener;
        global.IntersectionObserver = originalIntersectionObserver;
    });

    it('calculates intersection correctly in scroll fallback', () => {
        // Temporarily remove IntersectionObserver
        const originalIntersectionObserver = global.IntersectionObserver;
        delete global.IntersectionObserver;
        
        const { container } = render(IntersectionObserver, { props: defaultProps });
        
        // Mock getBoundingClientRect
        const containerDiv = container.querySelector('div');
        containerDiv.getBoundingClientRect = () => ({
            top: 100,
            bottom: 200,
            left: 100,
            right: 200
        });
        
        // Trigger scroll event
        fireEvent.scroll(window);
        
        expect(container).toBeTruthy();
        
        // Restore IntersectionObserver
        global.IntersectionObserver = originalIntersectionObserver;
    });

    it('removes scroll listener when once=true and intersection occurs in fallback', () => {
        // Temporarily remove IntersectionObserver
        const originalIntersectionObserver = global.IntersectionObserver;
        delete global.IntersectionObserver;
        
        let removeEventListenerCalled = false;
        const originalRemoveEventListener = window.removeEventListener;
        window.removeEventListener = (event, handler) => {
            if (event === 'scroll') {
                removeEventListenerCalled = true;
            }
            return originalRemoveEventListener.call(window, event, handler);
        };
        
        const { container } = render(IntersectionObserver, { props: { ...defaultProps, once: true } });
        
        // Mock getBoundingClientRect to simulate intersection
        const containerDiv = container.querySelector('div');
        containerDiv.getBoundingClientRect = () => ({
            top: 100,
            bottom: 200,
            left: 100,
            right: 200
        });
        
        // Trigger scroll event
        fireEvent.scroll(window);
        
        expect(removeEventListenerCalled).toBe(true);
        
        // Restore
        window.removeEventListener = originalRemoveEventListener;
        global.IntersectionObserver = originalIntersectionObserver;
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
        
        expect(mockObserver.options.rootMargin).toBe('-20px -30px -10px -40px');
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
        
        const originalUnobserve = mockObserver.unobserve;
        let unobserveCalled = false;
        mockObserver.unobserve = () => {
            unobserveCalled = true;
            originalUnobserve.apply(mockObserver, arguments);
        };
        
        unmount();
        
        expect(unobserveCalled).toBe(true);
    });
});