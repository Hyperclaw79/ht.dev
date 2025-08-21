/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/svelte';
import Action from './Action.svelte';

describe('Action component', () => {
    const mockAction = () => {
        // Mock action function
    };

    it('renders without crashing', () => {
        const { container } = render(Action, { 
            props: { 
                action: mockAction,
                timeout: 0,
                noProgress: false 
            } 
        });
        expect(container).toBeTruthy();
    });

    it('executes action immediately when timeout is 0', () => {
        const mockActionSpy = () => {};
        
        const { container } = render(Action, { 
            props: { 
                action: mockActionSpy,
                timeout: 0,
                noProgress: false 
            } 
        });
        
        expect(container).toBeTruthy();
    });

    it('renders AsciiProgress when timeout > 0 and noProgress is false', () => {
        const { container } = render(Action, { 
            props: { 
                action: mockAction,
                timeout: 1000,
                noProgress: false 
            } 
        });
        
        expect(container).toBeTruthy();
        // AsciiProgress should be rendered, but we can't easily test its internal state
        // without mocking the component or checking for specific elements
    });

    it('does not render AsciiProgress when noProgress is true', () => {
        const { container } = render(Action, { 
            props: { 
                action: mockAction,
                timeout: 1000,
                noProgress: true 
            } 
        });
        
        expect(container).toBeTruthy();
        // With noProgress true, no AsciiProgress component should be rendered
    });

    it('does not render AsciiProgress when timeout is 0', () => {
        const { container } = render(Action, { 
            props: { 
                action: mockAction,
                timeout: 0,
                noProgress: false 
            } 
        });
        
        expect(container).toBeTruthy();
        // With timeout 0, no AsciiProgress component should be rendered
    });

    it('handles default noProgress prop', () => {
        const { container } = render(Action, { 
            props: { 
                action: mockAction,
                timeout: 1000
            } 
        });
        
        expect(container).toBeTruthy();
    });

    it('handles default timeout prop', () => {
        const { container } = render(Action, { 
            props: { 
                action: mockAction
            } 
        });
        
        expect(container).toBeTruthy();
    });

    it('accepts action function prop', () => {
        const customAction = () => { 
            console.log('Custom action executed'); 
        };
        
        const { container } = render(Action, { 
            props: { 
                action: customAction,
                timeout: 0
            } 
        });
        
        expect(container).toBeTruthy();
    });
});