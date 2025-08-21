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

    it('handles empty elements array from elementsFromPoint', () => {
        global.document.elementsFromPoint = () => [];

        const { container } = render(Tiltable);
        const tiltingCard = container.querySelector('.tilting-card-content');
        
        expect(() => {
            fireEvent.click(tiltingCard, { x: 100, y: 100 });
        }).not.toThrow();
    });

    it('filters and handles click targeting', () => {
        let buttonClicked = false;
        const mockButton = { 
            tagName: 'BUTTON', 
            click: () => { buttonClicked = true; },
            classList: { contains: () => false }
        };
        const mockTiltingElement = { 
            tagName: 'DIV',
            classList: { contains: (className) => className === 'tilting-card-content' }
        };
        
        global.document.elementsFromPoint = () => [
            mockTiltingElement,
            mockButton
        ];

        const { container } = render(Tiltable);
        const tiltingCard = container.querySelector('.tilting-card-content');
        
        fireEvent.click(tiltingCard, { x: 100, y: 100 });
        
        expect(buttonClicked).toBe(true);
    });

    it('handles elements that throw errors on click', () => {
        const mockElement = { 
            tagName: 'BUTTON', 
            click: () => { throw new Error('Click error'); },
            classList: { contains: () => false }
        };
        
        global.document.elementsFromPoint = () => [mockElement];

        const { container } = render(Tiltable);
        const tiltingCard = container.querySelector('.tilting-card-content');
        
        // Should not throw despite the element's click method throwing
        expect(() => {
            fireEvent.click(tiltingCard, { x: 100, y: 100 });
        }).not.toThrow();
    });

    it('handles elements with missing click method gracefully', () => {
        const mockElement = { 
            tagName: 'BUTTON',
            classList: { contains: () => false }
            // No click method
        };
        
        global.document.elementsFromPoint = () => [mockElement];

        const { container } = render(Tiltable);
        const tiltingCard = container.querySelector('.tilting-card-content');
        
        expect(() => {
            fireEvent.click(tiltingCard, { x: 100, y: 100 });
        }).not.toThrow();
    });
});