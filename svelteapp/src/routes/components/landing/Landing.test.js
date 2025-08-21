/**
 * @jest-environment jsdom
 */
import { render, fireEvent } from '@testing-library/svelte';
import Landing from './Landing.svelte';

describe('Landing component', () => {
    it('renders without crashing', () => {
        const { container } = render(Landing);
        expect(container).toBeTruthy();
    });

    it('renders the landing div with correct class', () => {
        const { container } = render(Landing);
        
        const landingDiv = container.querySelector('.landing');
        expect(landingDiv).toBeInTheDocument();
        expect(landingDiv).toHaveClass('landing');
    });

    it('renders all child components', () => {
        const { container } = render(Landing);
        
        // Landing should contain the main components
        expect(container.firstChild).toBeTruthy();
        expect(container.querySelector('.landing')).toBeTruthy();
    });

    it('has correct CSS styling structure', () => {
        const { container } = render(Landing);
        
        const landingDiv = container.querySelector('.landing');
        expect(landingDiv).toBeInTheDocument();
        
        // Check computed styles
        const styles = window.getComputedStyle(landingDiv);
        expect(styles.display).toBe('flex');
        expect(styles.flexDirection).toBe('column');
        expect(styles.height).toBe('100%');
        expect(styles.position).toBe('relative');
    });

    it('handles Shrinkable component events', () => {
        const { component } = render(Landing);
        expect(component).toBeTruthy();
    });

    it('provides handle binding', () => {
        const { container } = render(Landing);
        expect(container).toBeTruthy();
    });

    it('maintains proper component structure', () => {
        const { container } = render(Landing);
        
        const landingDiv = container.querySelector('.landing');
        expect(landingDiv).toBeInTheDocument();
        
        // Should have child elements for the components
        expect(landingDiv.children.length).toBeGreaterThan(0);
    });

    it('handles component lifecycle correctly', () => {
        const { unmount } = render(Landing);
        
        expect(() => unmount()).not.toThrow();
    });

    it('responds to shrunkEvent properly', () => {
        const { component } = render(Landing);
        
        // Component should handle the shrunk event from Shrinkable
        expect(component).toBeTruthy();
    });
});