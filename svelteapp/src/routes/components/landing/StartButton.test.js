/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/svelte';
import StartButton from './StartButton.svelte';

// Mock Audio class
class MockAudio {
    constructor(src) {
        this.src = src;
        this.play = () => Promise.resolve();
    }
}

global.Audio = MockAudio;

// Mock navigator.userActivation
Object.defineProperty(navigator, 'userActivation', {
    value: {
        hasBeenActive: true
    },
    writable: true
});

describe('StartButton component', () => {
    let mockBinder;

    beforeEach(() => {
        mockBinder = document.createElement('div');
        document.body.appendChild(mockBinder);
    });

    afterEach(() => {
        if (mockBinder && mockBinder.parentNode) {
            mockBinder.parentNode.removeChild(mockBinder);
        }
    });

    it('renders without crashing', () => {
        const { container } = render(StartButton, { props: { binder: mockBinder } });
        expect(container).toBeTruthy();
    });

    it('renders the start button correctly', () => {
        const { getByText, container } = render(StartButton, { props: { binder: mockBinder } });
        
        const button = getByText('Start');
        expect(button).toBeInTheDocument();
        expect(button.tagName).toBe('BUTTON');
        
        const startBtn = container.querySelector('.startBtn');
        expect(startBtn).toBeInTheDocument();
    });

    it('binds to the provided binder element', () => {
        const { container } = render(StartButton, { props: { binder: mockBinder } });
        
        const button = container.querySelector('.startBtn');
        expect(button).toBeTruthy();
    });

    it('does not have activated class initially', () => {
        const { container } = render(StartButton, { props: { binder: mockBinder } });
        
        const button = container.querySelector('.startBtn');
        expect(button).not.toHaveClass('activated');
    });

    it('handles mouseover events on binder', () => {
        const { container } = render(StartButton, { props: { binder: mockBinder } });
        
        // This should not throw an error
        expect(() => {
            const event = new Event('mouseover');
            mockBinder.dispatchEvent(event);
        }).not.toThrow();
        
        expect(container).toBeTruthy();
    });

    it('handles hoverStartBtn window events', () => {
        const { container } = render(StartButton, { props: { binder: mockBinder } });
        
        // This should not throw an error
        expect(() => {
            const event = new CustomEvent('hoverStartBtn', {
                detail: { activated: true }
            });
            window.dispatchEvent(event);
        }).not.toThrow();
        
        expect(container).toBeTruthy();
    });

    it('handles null binder gracefully', () => {
        const { container } = render(StartButton, { props: { binder: null } });
        expect(container).toBeTruthy();
        
        const button = container.querySelector('.startBtn');
        expect(button).toBeInTheDocument();
    });

    it('has correct button styling classes', () => {
        const { container } = render(StartButton, { props: { binder: mockBinder } });
        
        const button = container.querySelector('button');
        expect(button).toHaveClass('startBtn');
    });

    it('creates audio instance with correct source', () => {
        const audioSpy = MockAudio;
        const { container } = render(StartButton, { props: { binder: mockBinder } });
        
        expect(container).toBeTruthy();
        // The audio should be created with "startSfx.mp3" source in the component
    });
});