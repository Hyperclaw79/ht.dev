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

    it('renders basic structure correctly', () => {
        const { container } = render(Tiltable);
        
        // Check that tilting card is rendered
        const tiltingCard = container.querySelector('.tilting-card-content');
        expect(tiltingCard).toBeInTheDocument();
        
        // Check mouse tracker is present
        const mouseTracker = container.querySelector('.mouse-position-tracker');
        expect(mouseTracker).toBeInTheDocument();
        
        // Check all 9 tracker divs are present
        const trackers = container.querySelectorAll('.tracker');
        expect(trackers).toHaveLength(9);
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

    describe('clickCallback sorting logic', () => {
        it('prioritizes BUTTON elements in sorting', () => {
            const mockDiv = document.createElement('div');
            const mockButton = document.createElement('button');
            const mockSpan = document.createElement('span');
            
            global.document.elementsFromPoint = () => [mockDiv, mockButton, mockSpan];
            
            const { container } = render(Tiltable);
            const tiltingCard = container.querySelector('.tilting-card-content');
            
            let clicked = false;
            mockButton.click = () => { clicked = true; };
            
            fireEvent.click(tiltingCard, { x: 100, y: 100 });
            
            expect(clicked).toBe(true);
        });

        it('prioritizes A (anchor) elements in sorting', () => {
            const mockDiv = document.createElement('div');
            const mockAnchor = document.createElement('a');
            const mockSpan = document.createElement('span');
            
            global.document.elementsFromPoint = () => [mockDiv, mockAnchor, mockSpan];
            
            const { container } = render(Tiltable);
            const tiltingCard = container.querySelector('.tilting-card-content');
            
            let clicked = false;
            mockAnchor.click = () => { clicked = true; };
            
            fireEvent.click(tiltingCard, { x: 100, y: 100 });
            
            expect(clicked).toBe(true);
        });

        it('prioritizes INPUT elements in sorting', () => {
            const mockDiv = document.createElement('div');
            const mockInput = document.createElement('input');
            const mockSpan = document.createElement('span');
            
            global.document.elementsFromPoint = () => [mockDiv, mockInput, mockSpan];
            
            const { container } = render(Tiltable);
            const tiltingCard = container.querySelector('.tilting-card-content');
            
            let clicked = false;
            mockInput.click = () => { clicked = true; };
            
            fireEvent.click(tiltingCard, { x: 100, y: 100 });
            
            expect(clicked).toBe(true);
        });

        it('handles sorting when both elements are priority elements', () => {
            const mockButton = document.createElement('button');
            const mockAnchor = document.createElement('a');
            
            global.document.elementsFromPoint = () => [mockButton, mockAnchor];
            
            const { container } = render(Tiltable);
            const tiltingCard = container.querySelector('.tilting-card-content');
            
            let buttonClicked = false;
            let anchorClicked = false;
            mockButton.click = () => { buttonClicked = true; };
            mockAnchor.click = () => { anchorClicked = true; };
            
            fireEvent.click(tiltingCard, { x: 100, y: 100 });
            
            // With current sorting logic, the first priority element maintains position
            // Since both are priority, button (first) should be clicked
            expect(buttonClicked || anchorClicked).toBe(true); // At least one should be clicked
            if (buttonClicked) {
                expect(anchorClicked).toBe(false);
            } else {
                expect(buttonClicked).toBe(false);
            }
        });

        it('handles sorting when neither element is priority', () => {
            const mockDiv = document.createElement('div');
            const mockSpan = document.createElement('span');
            
            global.document.elementsFromPoint = () => [mockDiv, mockSpan];
            
            const { container } = render(Tiltable);
            const tiltingCard = container.querySelector('.tilting-card-content');
            
            let divClicked = false;
            let spanClicked = false;
            mockDiv.click = () => { divClicked = true; };
            mockSpan.click = () => { spanClicked = true; };
            
            fireEvent.click(tiltingCard, { x: 100, y: 100 });
            
            // First element should be clicked (return 0 in sort)
            expect(divClicked).toBe(true);
            expect(spanClicked).toBe(false);
        });
    });

    describe('clickCallback filtering logic', () => {
        it('filters out tilting-card-content elements', () => {
            const mockElement = document.createElement('div');
            mockElement.classList.add('tilting-card-content');
            const mockValidElement = document.createElement('button');
            
            global.document.elementsFromPoint = () => [mockElement, mockValidElement];
            
            const { container } = render(Tiltable);
            const tiltingCard = container.querySelector('.tilting-card-content');
            
            let clicked = false;
            mockValidElement.click = () => { clicked = true; };
            
            fireEvent.click(tiltingCard, { x: 100, y: 100 });
            
            expect(clicked).toBe(true);
        });

        it('filters out mouse-position-tracker elements', () => {
            const mockElement = document.createElement('div');
            mockElement.classList.add('mouse-position-tracker');
            const mockValidElement = document.createElement('button');
            
            global.document.elementsFromPoint = () => [mockElement, mockValidElement];
            
            const { container } = render(Tiltable);
            const tiltingCard = container.querySelector('.tilting-card-content');
            
            let clicked = false;
            mockValidElement.click = () => { clicked = true; };
            
            fireEvent.click(tiltingCard, { x: 100, y: 100 });
            
            expect(clicked).toBe(true);
        });

        it('filters out tracker elements', () => {
            const mockElement = document.createElement('div');
            mockElement.classList.add('tracker');
            const mockValidElement = document.createElement('button');
            
            global.document.elementsFromPoint = () => [mockElement, mockValidElement];
            
            const { container } = render(Tiltable);
            const tiltingCard = container.querySelector('.tilting-card-content');
            
            let clicked = false;
            mockValidElement.click = () => { clicked = true; };
            
            fireEvent.click(tiltingCard, { x: 100, y: 100 });
            
            expect(clicked).toBe(true);
        });

        it('filters out multiple excluded classes', () => {
            const mockElement1 = document.createElement('div');
            mockElement1.classList.add('tilting-card-content');
            const mockElement2 = document.createElement('div');
            mockElement2.classList.add('mouse-position-tracker');
            const mockElement3 = document.createElement('div');
            mockElement3.classList.add('tracker');
            const mockValidElement = document.createElement('button');
            
            global.document.elementsFromPoint = () => [mockElement1, mockElement2, mockElement3, mockValidElement];
            
            const { container } = render(Tiltable);
            const tiltingCard = container.querySelector('.tilting-card-content');
            
            let clicked = false;
            mockValidElement.click = () => { clicked = true; };
            
            fireEvent.click(tiltingCard, { x: 100, y: 100 });
            
            expect(clicked).toBe(true);
        });
    });

    describe('clickCallback error handling', () => {
        it('handles elements that throw errors on click', () => {
            const mockElement = document.createElement('button');
            mockElement.click = () => {
                throw new Error('Click failed');
            };
            
            global.document.elementsFromPoint = () => [mockElement];
            
            const { container } = render(Tiltable);
            const tiltingCard = container.querySelector('.tilting-card-content');
            
            expect(() => {
                fireEvent.click(tiltingCard, { x: 100, y: 100 });
            }).not.toThrow();
        });

        it('handles elements with missing click method', () => {
            const mockElement = document.createElement('div');
            delete mockElement.click; // Remove click method
            
            global.document.elementsFromPoint = () => [mockElement];
            
            const { container } = render(Tiltable);
            const tiltingCard = container.querySelector('.tilting-card-content');
            
            expect(() => {
                fireEvent.click(tiltingCard, { x: 100, y: 100 });
            }).not.toThrow();
        });

        it('handles empty elements array after filtering', () => {
            const mockElement = document.createElement('div');
            mockElement.classList.add('tracker');
            
            global.document.elementsFromPoint = () => [mockElement];
            
            const { container } = render(Tiltable);
            const tiltingCard = container.querySelector('.tilting-card-content');
            
            expect(() => {
                fireEvent.click(tiltingCard, { x: 100, y: 100 });
            }).not.toThrow();
        });

        it('handles empty array from elementsFromPoint', () => {
            global.document.elementsFromPoint = () => [];
            
            const { container } = render(Tiltable);
            const tiltingCard = container.querySelector('.tilting-card-content');
            
            expect(() => {
                fireEvent.click(tiltingCard, { x: 100, y: 100 });
            }).not.toThrow();
        });

        it('handles null/undefined from elementsFromPoint', () => {
            global.document.elementsFromPoint = () => null;
            
            const { container } = render(Tiltable);
            const tiltingCard = container.querySelector('.tilting-card-content');
            
            expect(() => {
                fireEvent.click(tiltingCard, { x: 100, y: 100 });
            }).not.toThrow();
        });

        it('handles undefined from elementsFromPoint', () => {
            global.document.elementsFromPoint = () => undefined;
            
            const { container } = render(Tiltable);
            const tiltingCard = container.querySelector('.tilting-card-content');
            
            expect(() => {
                fireEvent.click(tiltingCard, { x: 100, y: 100 });
            }).not.toThrow();
        });
    });

    describe('comprehensive edge cases', () => {
        it('handles complex element hierarchies with mixed priorities', () => {
            const mockDiv = document.createElement('div');
            const mockButton = document.createElement('button');
            const mockInput = document.createElement('input');
            const mockAnchor = document.createElement('a');
            const mockSpan = document.createElement('span');
            
            global.document.elementsFromPoint = () => [mockDiv, mockButton, mockInput, mockAnchor, mockSpan];
            
            const { container } = render(Tiltable);
            const tiltingCard = container.querySelector('.tilting-card-content');
            
            let buttonClicked = false;
            let inputClicked = false;
            let anchorClicked = false;
            let divClicked = false;
            let spanClicked = false;
            
            mockButton.click = () => { buttonClicked = true; };
            mockInput.click = () => { inputClicked = true; };
            mockAnchor.click = () => { anchorClicked = true; };
            mockDiv.click = () => { divClicked = true; };
            mockSpan.click = () => { spanClicked = true; };
            
            fireEvent.click(tiltingCard, { x: 100, y: 100 });
            
            // One of the priority elements should be clicked (button, input, or anchor)
            const priorityClicked = buttonClicked || inputClicked || anchorClicked;
            const nonPriorityClicked = divClicked || spanClicked;
            
            expect(priorityClicked).toBe(true);
            expect(nonPriorityClicked).toBe(false);
        });

        it('verifies element attribute accessors work correctly', () => {
            const { container } = render(Tiltable);
            const tiltingCard = container.querySelector('.tilting-card-content');
            
            expect(tiltingCard.getAttribute('role')).toBe('button');
            expect(tiltingCard.getAttribute('tabindex')).toBe('0');
            expect(tiltingCard.tagName.toLowerCase()).toBe('div');
        });

        it('tests coordinate edge cases', () => {
            const mockElement = document.createElement('button');
            let clickCount = 0;
            mockElement.click = () => { clickCount++; };
            
            global.document.elementsFromPoint = () => [mockElement];
            
            const { container } = render(Tiltable);
            const tiltingCard = container.querySelector('.tilting-card-content');
            
            // Test various coordinate values
            const coordinates = [
                { x: 0, y: 0 },
                { x: -1, y: -1 },
                { x: 9999, y: 9999 },
                { x: 100.5, y: 200.7 }
            ];
            
            coordinates.forEach(coords => {
                fireEvent.click(tiltingCard, coords);
            });
            
            expect(clickCount).toBe(coordinates.length);
        });

        it('handles mixed element types in sorting algorithm', () => {
            const mockH1 = document.createElement('h1');
            const mockP = document.createElement('p');
            const mockLi = document.createElement('li');
            const mockInput = document.createElement('input');
            
            global.document.elementsFromPoint = () => [mockH1, mockP, mockLi, mockInput];
            
            const { container } = render(Tiltable);
            const tiltingCard = container.querySelector('.tilting-card-content');
            
            let inputClicked = false;
            let h1Clicked = false;
            let pClicked = false;
            let liClicked = false;
            
            mockInput.click = () => { inputClicked = true; };
            mockH1.click = () => { h1Clicked = true; };
            mockP.click = () => { pClicked = true; };
            mockLi.click = () => { liClicked = true; };
            
            fireEvent.click(tiltingCard, { x: 100, y: 100 });
            
            // INPUT should be prioritized
            expect(inputClicked).toBe(true);
            expect(h1Clicked).toBe(false);
            expect(pClicked).toBe(false);
            expect(liClicked).toBe(false);
        });

        it('verifies complex filtering with nested classList scenarios', () => {
            const mockElement1 = document.createElement('div');
            mockElement1.classList.add('tilting-card-content', 'other-class');
            const mockElement2 = document.createElement('div');
            mockElement2.classList.add('mouse-position-tracker', 'another-class');
            const mockElement3 = document.createElement('div');
            mockElement3.classList.add('tracker', 'third-class');
            const mockValidElement = document.createElement('button');
            mockValidElement.classList.add('valid-class');
            
            global.document.elementsFromPoint = () => [mockElement1, mockElement2, mockElement3, mockValidElement];
            
            const { container } = render(Tiltable);
            const tiltingCard = container.querySelector('.tilting-card-content');
            
            let clicked = false;
            mockValidElement.click = () => { clicked = true; };
            
            fireEvent.click(tiltingCard, { x: 100, y: 100 });
            
            expect(clicked).toBe(true);
        });

        it('tests different priority element combinations', () => {
            // Test when INPUT comes before BUTTON
            const mockInput = document.createElement('input');
            const mockButton = document.createElement('button');
            
            global.document.elementsFromPoint = () => [mockInput, mockButton];
            
            const { container } = render(Tiltable);
            const tiltingCard = container.querySelector('.tilting-card-content');
            
            let inputClicked = false;
            let buttonClicked = false;
            mockInput.click = () => { inputClicked = true; };
            mockButton.click = () => { buttonClicked = true; };
            
            fireEvent.click(tiltingCard, { x: 100, y: 100 });
            
            // One priority element should be clicked, not both
            expect(inputClicked || buttonClicked).toBe(true);
            expect(inputClicked && buttonClicked).toBe(false);
        });

        it('tests anchor element priority', () => {
            const mockSpan = document.createElement('span');
            const mockAnchor = document.createElement('a');
            const mockDiv = document.createElement('div');
            
            global.document.elementsFromPoint = () => [mockSpan, mockAnchor, mockDiv];
            
            const { container } = render(Tiltable);
            const tiltingCard = container.querySelector('.tilting-card-content');
            
            let spanClicked = false;
            let anchorClicked = false;
            let divClicked = false;
            mockSpan.click = () => { spanClicked = true; };
            mockAnchor.click = () => { anchorClicked = true; };
            mockDiv.click = () => { divClicked = true; };
            
            fireEvent.click(tiltingCard, { x: 100, y: 100 });
            
            // Anchor should be prioritized
            expect(anchorClicked).toBe(true);
            expect(spanClicked).toBe(false);
            expect(divClicked).toBe(false);
        });
    });
});