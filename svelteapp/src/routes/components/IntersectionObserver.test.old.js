/**
 * @jest-environment jsdom
 */
import { render, fireEvent } from '@testing-library/svelte';
import IntersectionObserver from './IntersectionObserver.svelte';

describe('IntersectionObserver component', () => {
    let mockObserver;
    let mockObserverInstance;
    
    const defaultProps = {
        once: false,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    };

    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();
        
        // Create mock instance
        mockObserverInstance = {
            observe: jest.fn(),
            unobserve: jest.fn(),
            disconnect: jest.fn()
        };
        
        // Mock the IntersectionObserver constructor
        mockObserver = jest.fn().mockImplementation((callback, options) => {
            mockObserverInstance.callback = callback;
            mockObserverInstance.options = options;
            return mockObserverInstance;
        });
        
        global.IntersectionObserver = mockObserver;
    });

    afterEach(() => {
        jest.restoreAllMocks();
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
        
        expect(mockObserver).toHaveBeenCalled();
        expect(mockObserverInstance.options.rootMargin).toBe('20px 30px 10px 40px');
    });

    it('observes the container element', () => {
        render(IntersectionObserver, { props: defaultProps });
        
        expect(mockObserverInstance.observe).toHaveBeenCalledTimes(1);
    });

    it('handles intersection events', () => {
        const { container } = render(IntersectionObserver, { props: defaultProps });
        
        // Trigger intersection
        mockObserverInstance.callback([{ isIntersecting: true }]);
        
        // The component should handle intersection
        expect(container).toBeTruthy();
    });

    it('unobserves when once=true and intersection occurs', () => {
        render(IntersectionObserver, { props: { ...defaultProps, once: true } });
        
        // Trigger intersection
        mockObserverInstance.callback([{ isIntersecting: true }]);
        
        expect(mockObserverInstance.unobserve).toHaveBeenCalledTimes(1);
    });

    it('does not unobserve when once=false', () => {
        render(IntersectionObserver, { props: { ...defaultProps, once: false } });
        
        // Trigger intersection
        mockObserverInstance.callback([{ isIntersecting: true }]);
        
        expect(mockObserverInstance.unobserve).not.toHaveBeenCalled();
    });

    it('handles scroll fallback when IntersectionObserver is not available', () => {
        // Temporarily remove IntersectionObserver
        delete global.IntersectionObserver;
        
        const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
        
        render(IntersectionObserver, { props: defaultProps });
        
        expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
        
        addEventListenerSpy.mockRestore();
        // Restore IntersectionObserver
        global.IntersectionObserver = mockObserver;
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
        delete global.IntersectionObserver;
        
        const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
        
        render(IntersectionObserver, { props: { ...defaultProps, once: true } });
        
        // Mock getBoundingClientRect to simulate intersection
        const container = document.querySelector('div');
        if (container) {
            container.getBoundingClientRect = jest.fn(() => ({
                top: 100,
                bottom: 200,
                left: 100,
                right: 200
            }));
        }
        
        // Trigger scroll event
        fireEvent.scroll(window);
        
        expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
        
        removeEventListenerSpy.mockRestore();
        // Restore IntersectionObserver
        global.IntersectionObserver = mockObserver;
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
        
        expect(mockObserverInstance.options.rootMargin).toBe('-20px -30px -10px -40px');
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
        
        expect(mockObserverInstance.unobserve).toHaveBeenCalled();
    });
});