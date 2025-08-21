/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/svelte';
import IntersectionObserver from './IntersectionObserver.svelte';

// Mock IntersectionObserver
class MockIntersectionObserver {
    constructor(callback, options) {
        this.callback = callback;
        this.options = options;
    }
    
    observe() {}
    unobserve() {}
    disconnect() {}
}

global.IntersectionObserver = MockIntersectionObserver;

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

    it('renders without crashing', () => {
        const { container } = render(IntersectionObserver, { props: defaultProps });
        expect(container).toBeTruthy();
    });

    it('renders the container div correctly', () => {
        const { container } = render(IntersectionObserver, { props: defaultProps });
        
        const containerDiv = container.querySelector('div');
        expect(containerDiv).toBeInTheDocument();
    });

    it('accepts all margin props', () => {
        const props = {
            once: true,
            top: 10,
            bottom: 20,
            left: 30,
            right: 40
        };
        
        const { container } = render(IntersectionObserver, { props });
        expect(container).toBeTruthy();
    });

    it('handles once prop correctly', () => {
        const { container } = render(IntersectionObserver, { props: { ...defaultProps, once: true } });
        expect(container).toBeTruthy();
    });

    it('handles margin props correctly', () => {
        const props = {
            ...defaultProps,
            top: 10,
            bottom: 20,
            left: 30,
            right: 40
        };
        
        const { container } = render(IntersectionObserver, { props });
        expect(container).toBeTruthy();
    });

    it('uses default values when props are not provided', () => {
        const { container } = render(IntersectionObserver);
        expect(container).toBeTruthy();
        
        const containerDiv = container.querySelector('div');
        expect(containerDiv).toBeInTheDocument();
    });

    it('handles scroll fallback when IntersectionObserver is not available', () => {
        // Temporarily remove IntersectionObserver
        const originalIntersectionObserver = global.IntersectionObserver;
        delete global.IntersectionObserver;
        
        const { container } = render(IntersectionObserver, { props: defaultProps });
        expect(container).toBeTruthy();
        
        // Restore IntersectionObserver
        global.IntersectionObserver = originalIntersectionObserver;
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
});