/**
 * @jest-environment jsdom
 */
import { render, fireEvent } from '@testing-library/svelte';
import Shrinkable from './Shrinkable.svelte';

describe('Shrinkable component', () => {
    it('renders without crashing', () => {
        const { container } = render(Shrinkable, { props: { handle: null } });
        expect(container).toBeTruthy();
    });

    it('renders the shrinkable container correctly', () => {
        const { container } = render(Shrinkable, { props: { handle: null } });
        
        const shrinkableDiv = container.querySelector('.shrinkable');
        expect(shrinkableDiv).toBeInTheDocument();
    });

    it('does not have shrunk class initially', () => {
        const { container } = render(Shrinkable, { props: { handle: null } });
        
        const shrinkableDiv = container.querySelector('.shrinkable');
        expect(shrinkableDiv).not.toHaveClass('shrunk');
    });

    it('handles handle prop correctly', () => {
        const mockHandle = document.createElement('button');
        
        const { container } = render(Shrinkable, { 
            props: { handle: mockHandle } 
        });
        
        expect(container).toBeTruthy();
    });

    it('dispatches shrunkEvent when handle is clicked', () => {
        const mockHandle = document.createElement('button');
        let eventDispatched = false;
        
        const { component } = render(Shrinkable, { 
            props: { handle: mockHandle } 
        });
        
        // Listen for the custom event
        component.$on('shrunkEvent', () => {
            eventDispatched = true;
        });
        
        // Simulate handle click
        fireEvent.click(mockHandle);
        
        expect(eventDispatched).toBe(true);
    });

    it('handles null handle gracefully', () => {
        const { container } = render(Shrinkable, { 
            props: { handle: null } 
        });
        
        expect(container).toBeTruthy();
        
        const shrinkableDiv = container.querySelector('.shrinkable');
        expect(shrinkableDiv).not.toHaveClass('shrunk');
    });

    it('handles undefined handle gracefully', () => {
        const { container } = render(Shrinkable, { 
            props: { handle: undefined } 
        });
        
        expect(container).toBeTruthy();
        
        const shrinkableDiv = container.querySelector('.shrinkable');
        expect(shrinkableDiv).not.toHaveClass('shrunk');
    });
});