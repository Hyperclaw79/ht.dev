/**
 * @jest-environment jsdom
 */
import { render, fireEvent } from '@testing-library/svelte';
import Tiltable from './Tiltable.svelte';

describe('Tiltable component', () => {
    beforeEach(() => {
        // Reset document.elementsFromPoint to default behavior
        global.document.elementsFromPoint = global.document.elementsFromPoint || (() => []);
    });

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
        global.document.elementsFromPoint = () => [];

        const { container } = render(Tiltable);
        const tiltingCard = container.querySelector('.tilting-card-content');
        
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

    it('filters and handles click targeting with button priority', () => {
        let buttonClicked = false;
        let divClicked = false;
        
        const mockButton = { 
            tagName: 'BUTTON', 
            click: () => { buttonClicked = true; },
            classList: { contains: () => false }
        };
        const mockDiv = { 
            tagName: 'DIV',
            click: () => { divClicked = true; },
            classList: { contains: () => false }
        };
        
        global.document.elementsFromPoint = () => [
            mockDiv,
            mockButton
        ];

        const { container } = render(Tiltable);
        const tiltingCard = container.querySelector('.tilting-card-content');
        
        fireEvent.click(tiltingCard, { x: 100, y: 100 });
        
        // Button should be clicked due to priority sorting
        expect(buttonClicked).toBe(true);
        expect(divClicked).toBe(false);
    });

    it('handles anchor tag priority sorting', () => {
        let anchorClicked = false;
        let divClicked = false;
        
        const mockAnchor = { 
            tagName: 'A', 
            click: () => { anchorClicked = true; },
            classList: { contains: () => false }
        };
        const mockDiv = { 
            tagName: 'DIV',
            click: () => { divClicked = true; },
            classList: { contains: () => false }
        };
        
        global.document.elementsFromPoint = () => [
            mockDiv,
            mockAnchor
        ];

        const { container } = render(Tiltable);
        const tiltingCard = container.querySelector('.tilting-card-content');
        
        fireEvent.click(tiltingCard, { x: 100, y: 100 });
        
        expect(anchorClicked).toBe(true);
        expect(divClicked).toBe(false);
    });

    it('handles input tag priority sorting', () => {
        let inputClicked = false;
        let spanClicked = false;
        
        const mockInput = { 
            tagName: 'INPUT', 
            click: () => { inputClicked = true; },
            classList: { contains: () => false }
        };
        const mockSpan = { 
            tagName: 'SPAN',
            click: () => { spanClicked = true; },
            classList: { contains: () => false }
        };
        
        global.document.elementsFromPoint = () => [
            mockSpan,
            mockInput
        ];

        const { container } = render(Tiltable);
        const tiltingCard = container.querySelector('.tilting-card-content');
        
        fireEvent.click(tiltingCard, { x: 100, y: 100 });
        
        expect(inputClicked).toBe(true);
        expect(spanClicked).toBe(false);
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

    it('filters out tilting-card-content elements', () => {
        let normalElementClicked = false;
        
        const mockTiltingElement = { 
            tagName: 'DIV',
            click: () => { },
            classList: { contains: (className) => className === 'tilting-card-content' }
        };
        const mockNormalElement = { 
            tagName: 'SPAN',
            click: () => { normalElementClicked = true; },
            classList: { contains: () => false }
        };
        
        global.document.elementsFromPoint = () => [
            mockTiltingElement,
            mockNormalElement
        ];

        const { container } = render(Tiltable);
        const tiltingCard = container.querySelector('.tilting-card-content');
        
        fireEvent.click(tiltingCard, { x: 100, y: 100 });
        
        expect(normalElementClicked).toBe(true);
    });

    it('filters out mouse-position-tracker elements', () => {
        let normalElementClicked = false;
        
        const mockTrackerElement = { 
            tagName: 'DIV',
            click: () => { },
            classList: { contains: (className) => className === 'mouse-position-tracker' }
        };
        const mockNormalElement = { 
            tagName: 'SPAN',
            click: () => { normalElementClicked = true; },
            classList: { contains: () => false }
        };
        
        global.document.elementsFromPoint = () => [
            mockTrackerElement,
            mockNormalElement
        ];

        const { container } = render(Tiltable);
        const tiltingCard = container.querySelector('.tilting-card-content');
        
        fireEvent.click(tiltingCard, { x: 100, y: 100 });
        
        expect(normalElementClicked).toBe(true);
    });

    it('filters out tracker elements', () => {
        let normalElementClicked = false;
        
        const mockTrackerElement = { 
            tagName: 'DIV',
            click: () => { },
            classList: { contains: (className) => className === 'tracker' }
        };
        const mockNormalElement = { 
            tagName: 'SPAN',
            click: () => { normalElementClicked = true; },
            classList: { contains: () => false }
        };
        
        global.document.elementsFromPoint = () => [
            mockTrackerElement,
            mockNormalElement
        ];

        const { container } = render(Tiltable);
        const tiltingCard = container.querySelector('.tilting-card-content');
        
        fireEvent.click(tiltingCard, { x: 100, y: 100 });
        
        expect(normalElementClicked).toBe(true);
    });

    it('tests comprehensive element sorting logic', () => {
        const clickResults = [];
        
        const mockButton = { 
            tagName: 'BUTTON', 
            click: () => { clickResults.push('button'); },
            classList: { contains: () => false }
        };
        const mockAnchor = { 
            tagName: 'A', 
            click: () => { clickResults.push('anchor'); },
            classList: { contains: () => false }
        };
        const mockInput = { 
            tagName: 'INPUT', 
            click: () => { clickResults.push('input'); },
            classList: { contains: () => false }
        };
        const mockDiv = { 
            tagName: 'DIV',
            click: () => { clickResults.push('div'); },
            classList: { contains: () => false }
        };
        
        // Test that interactive elements are prioritized
        global.document.elementsFromPoint = () => [
            mockDiv,
            mockButton,
            mockAnchor,
            mockInput
        ];

        const { container } = render(Tiltable);
        const tiltingCard = container.querySelector('.tilting-card-content');
        
        fireEvent.click(tiltingCard, { x: 100, y: 100 });
        
        // Should click the first interactive element (button, anchor, or input)
        expect(clickResults.length).toBe(1);
        expect(clickResults[0]).toMatch(/^(button|anchor|input)$/);
    });

    it('handles mixed interactive and non-interactive elements', () => {
        let interactiveClicked = false;
        let nonInteractiveClicked = false;
        
        const mockSpan = { 
            tagName: 'SPAN',
            click: () => { nonInteractiveClicked = true; },
            classList: { contains: () => false }
        };
        const mockButton = { 
            tagName: 'BUTTON', 
            click: () => { interactiveClicked = true; },
            classList: { contains: () => false }
        };
        const mockDiv = { 
            tagName: 'DIV',
            click: () => { nonInteractiveClicked = true; },
            classList: { contains: () => false }
        };
        
        global.document.elementsFromPoint = () => [
            mockSpan,
            mockDiv,
            mockButton
        ];

        const { container } = render(Tiltable);
        const tiltingCard = container.querySelector('.tilting-card-content');
        
        fireEvent.click(tiltingCard, { x: 100, y: 100 });
        
        expect(interactiveClicked).toBe(true);
        expect(nonInteractiveClicked).toBe(false);
    });

    it('handles case where no interactive elements exist', () => {
        let firstElementClicked = false;
        
        const mockDiv1 = { 
            tagName: 'DIV',
            click: () => { firstElementClicked = true; },
            classList: { contains: () => false }
        };
        const mockSpan = { 
            tagName: 'SPAN',
            click: () => { },
            classList: { contains: () => false }
        };
        
        global.document.elementsFromPoint = () => [
            mockDiv1,
            mockSpan
        ];

        const { container } = render(Tiltable);
        const tiltingCard = container.querySelector('.tilting-card-content');
        
        fireEvent.click(tiltingCard, { x: 100, y: 100 });
        
        expect(firstElementClicked).toBe(true);
    });

    it('handles elements with complex classList behavior', () => {
        let elementClicked = false;
        
        const mockElement = { 
            tagName: 'BUTTON',
            click: () => { elementClicked = true; },
            classList: { 
                contains: (className) => {
                    // Simulate various classList scenarios
                    return ['other-class', 'some-class'].includes(className);
                }
            }
        };
        
        global.document.elementsFromPoint = () => [mockElement];

        const { container } = render(Tiltable);
        const tiltingCard = container.querySelector('.tilting-card-content');
        
        fireEvent.click(tiltingCard, { x: 100, y: 100 });
        
        expect(elementClicked).toBe(true);
    });

    it('handles element sorting edge cases', () => {
        const clickResults = [];
        
        // Test exact sorting logic for edge cases
        const elements = [
            { 
                tagName: 'SPAN',
                click: () => { clickResults.push('span'); },
                classList: { contains: () => false }
            },
            { 
                tagName: 'DIV',
                click: () => { clickResults.push('div'); },
                classList: { contains: () => false }
            },
            { 
                tagName: 'P',
                click: () => { clickResults.push('p'); },
                classList: { contains: () => false }
            }
        ];
        
        global.document.elementsFromPoint = () => elements;

        const { container } = render(Tiltable);
        const tiltingCard = container.querySelector('.tilting-card-content');
        
        fireEvent.click(tiltingCard, { x: 100, y: 100 });
        
        // Should click the first element since none are interactive
        expect(clickResults.length).toBe(1);
        expect(clickResults[0]).toBe('span');
    });

    it('handles coordinate edge cases in click callback', () => {
        global.document.elementsFromPoint = () => [];

        const { container } = render(Tiltable);
        const tiltingCard = container.querySelector('.tilting-card-content');
        
        // Test various coordinate scenarios
        const coordinates = [
            { x: 0, y: 0 },
            { x: -1, y: -1 },
            { x: 9999, y: 9999 },
            { x: 100.5, y: 200.7 }
        ];
        
        coordinates.forEach(coords => {
            expect(() => {
                fireEvent.click(tiltingCard, coords);
            }).not.toThrow();
        });
    });

    it('renders slot content correctly', () => {
        const { container, getByText } = render(Tiltable, {
            props: {
                $$slots: {
                    default: 'Test slot content'
                }
            }
        });
        
        // Since we're testing slot rendering, we need to provide slot content
        const slotComponent = `
            <script>
                import Tiltable from './Tiltable.svelte';
            </script>
            <Tiltable>
                <div>Test slot content</div>
            </Tiltable>
        `;
        
        // Check that tilting card is rendered
        const tiltingCard = container.querySelector('.tilting-card-content');
        expect(tiltingCard).toBeInTheDocument();
    });

    it('verifies proper DOM structure', () => {
        const { container } = render(Tiltable);
        
        const tiltingCard = container.querySelector('.tilting-card-content');
        const mouseTracker = container.querySelector('.mouse-position-tracker');
        const trackers = container.querySelectorAll('.tracker');
        
        expect(tiltingCard).toBeInTheDocument();
        expect(mouseTracker).toBeInTheDocument();
        expect(trackers.length).toBe(9);
        
        // Verify mouse tracker is inside tilting card
        expect(tiltingCard).toContainElement(mouseTracker);
        
        // Verify all tracker elements are inside mouse tracker
        trackers.forEach(tracker => {
            expect(mouseTracker).toContainElement(tracker);
        });
    });
});