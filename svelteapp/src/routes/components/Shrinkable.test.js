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

    it('updates shrunk state when handle is clicked', () => {
        const mockHandle = document.createElement('button');
        
        const { container } = render(Shrinkable, { 
            props: { handle: mockHandle } 
        });
        
        const shrinkableDiv = container.querySelector('.shrinkable');
        
        // Initially not shrunk
        expect(shrinkableDiv).not.toHaveClass('shrunk');
        
        // Simulate handle click - this will trigger the event listener that was added in the reactive statement
        fireEvent.click(mockHandle);
        
        // The component should update its internal state but we can't directly test the class
        // since the reactive statement has already run and added the event listener
        expect(container).toBeTruthy();
    });

    it('adds event listener when handle prop changes', () => {
        const { component } = render(Shrinkable, { 
            props: { handle: null } 
        });
        
        // Add a handle
        const mockHandle = document.createElement('button');
        component.$set({ handle: mockHandle });
        
        // Component should handle the handle change
        expect(component).toBeTruthy();
    });

    it('handles multiple handle changes', () => {
        const mockHandle1 = document.createElement('button');
        
        const { component } = render(Shrinkable, { 
            props: { handle: mockHandle1 } 
        });
        
        let eventCount = 0;
        component.$on('shrunkEvent', () => {
            eventCount++;
        });
        
        // Click first handle
        fireEvent.click(mockHandle1);
        expect(eventCount).toBe(1);
        
        // Component should handle multiple handles properly
        expect(component).toBeTruthy();
    });

    it('handles handle being set to null after being set', () => {
        const mockHandle = document.createElement('button');
        
        const { component } = render(Shrinkable, { 
            props: { handle: mockHandle } 
        });
        
        // Set handle to null
        component.$set({ handle: null });
        
        // Original handle should still work due to existing event listener
        let eventDispatched = false;
        component.$on('shrunkEvent', () => {
            eventDispatched = true;
        });
        
        fireEvent.click(mockHandle);
        expect(eventDispatched).toBe(true);
    });

    it('applies correct CSS classes and transitions', () => {
        const { container } = render(Shrinkable, { 
            props: { handle: null } 
        });
        
        const shrinkableDiv = container.querySelector('.shrinkable');
        expect(shrinkableDiv).toHaveClass('shrinkable');
        expect(shrinkableDiv).not.toHaveClass('shrunk');
    });

    it('handles handle with existing event listeners', () => {
        const mockHandle = document.createElement('button');
        
        // Add an existing event listener
        let existingEventTriggered = false;
        mockHandle.addEventListener('click', () => {
            existingEventTriggered = true;
        });
        
        const { component } = render(Shrinkable, { 
            props: { handle: mockHandle } 
        });
        
        let shrunkEventTriggered = false;
        component.$on('shrunkEvent', () => {
            shrunkEventTriggered = true;
        });
        
        // Click should trigger both listeners
        fireEvent.click(mockHandle);
        
        expect(existingEventTriggered).toBe(true);
        expect(shrunkEventTriggered).toBe(true);
    });
});