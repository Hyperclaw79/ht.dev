/**
 * @jest-environment jsdom
 */
import { render, fireEvent } from '@testing-library/svelte';
import Tiltable from './Tiltable.svelte';

describe('Tiltable component', () => {
    it('renders without crashing', () => {
        const { container } = render(Tiltable);
        expect(container).toBeTruthy();
    });

    it('has the correct CSS classes', () => {
        const { container } = render(Tiltable);
        
        const tiltingCard = container.querySelector('.tilting-card-content');
        expect(tiltingCard).toBeInTheDocument();
        
        const mouseTracker = container.querySelector('.mouse-position-tracker');
        expect(mouseTracker).toBeInTheDocument();
    });

    it('creates 9 tracker divs', () => {
        const { container } = render(Tiltable);
        
        const trackers = container.querySelectorAll('.tracker');
        expect(trackers).toHaveLength(9);
    });

    it('has proper accessibility attributes', () => {
        const { container } = render(Tiltable);
        
        const tiltingCard = container.querySelector('.tilting-card-content');
        expect(tiltingCard).toHaveAttribute('role', 'button');
        expect(tiltingCard).toHaveAttribute('tabindex', '0');
    });

    it('handles click events without errors', () => {
        // Mock document.elementsFromPoint to avoid errors
        global.document.elementsFromPoint = global.document.elementsFromPoint || (() => []);

        const { container } = render(Tiltable);
        const tiltingCard = container.querySelector('.tilting-card-content');
        
        // This should not throw an error
        expect(() => {
            fireEvent.click(tiltingCard, { x: 100, y: 100 });
        }).not.toThrow();
    });
});