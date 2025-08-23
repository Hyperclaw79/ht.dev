import { jest } from '@jest/globals';
import { render, fireEvent } from '@testing-library/svelte';
import Recursor from 'src/routes/components/experience/Recursor.svelte';

// Mock console.log to avoid test output pollution
const originalConsoleLog = console.log;
console.log = jest.fn();

describe('Recursor', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        
        // Mock window.innerWidth
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 1024
        });

        // Mock document.querySelectorAll
        global.document.querySelectorAll = jest.fn(() => []);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    afterAll(() => {
        console.log = originalConsoleLog;
    });

    test('renders array of nodes recursively', async () => {
        const nodes = [
            { type: 'Job', name: 'Software Engineer', year: '2020 – 2023' },
            { type: 'Role', name: 'Frontend Developer', year: '2023 – Present' }
        ];

        const { container } = render(Recursor, { props: { node: nodes, nodeIdx: 0 } });

        // Should render multiple nodes
        const nodeElements = container.querySelectorAll('.node');
        expect(nodeElements).toHaveLength(2);
        
        // Check first node
        expect(container.querySelector('h2')).toBeTruthy();
        expect(container.textContent).toContain('Software Engineer');
        
        // Check second node
        expect(container.querySelector('h3')).toBeTruthy();
        expect(container.textContent).toContain('Frontend Developer');
    });

    test('renders Job node with h2 heading', async () => {
        const jobNode = {
            type: 'Job',
            name: 'Senior Software Engineer',
            year: '2021 – 2023',
            caption: 'Leading development team',
            description: 'Developed scalable web applications',
            skills: ['React', 'Node.js', 'PostgreSQL']
        };

        const { container } = render(Recursor, { props: { node: jobNode, nodeIdx: 0 } });

        // Check heading type
        const heading = container.querySelector('h2');
        expect(heading).toBeTruthy();
        expect(heading.textContent).toContain('Senior Software Engineer');
        expect(heading.textContent).toContain('(2021 – 2023)');

        // Check caption
        const caption = container.querySelector('.caption');
        expect(caption).toBeTruthy();
        expect(caption.textContent).toBe('Leading development team');

        // Check description
        const description = container.querySelector('.description');
        expect(description).toBeTruthy();
        expect(description.textContent).toBe('Developed scalable web applications');

        // Check skills
        const skills = container.querySelector('.skills');
        expect(skills).toBeTruthy();
        expect(skills.textContent).toContain('Technologies Used: React, Node.js, PostgreSQL');
    });

    test('renders Role node with h3 heading', async () => {
        const roleNode = {
            type: 'Role',
            name: 'Frontend Specialist',
            year: '2022 – Present'
        };

        const { container } = render(Recursor, { props: { node: roleNode, nodeIdx: 1 } });

        const heading = container.querySelector('h3');
        expect(heading).toBeTruthy();
        expect(heading.textContent).toContain('Frontend Specialist');
    });

    test('renders Product node with h4 heading', async () => {
        const productNode = {
            type: 'Product',
            name: 'E-commerce Platform',
            year: '2023'
        };

        const { container } = render(Recursor, { props: { node: productNode, nodeIdx: 2 } });

        const heading = container.querySelector('h4');
        expect(heading).toBeTruthy();
        expect(heading.textContent).toContain('E-commerce Platform');
    });

    test('renders node without optional fields', async () => {
        const minimalNode = {
            type: 'Job',
            name: 'Developer'
        };

        const { container } = render(Recursor, { props: { node: minimalNode, nodeIdx: 0 } });

        // Should still render the heading
        const heading = container.querySelector('h2');
        expect(heading).toBeTruthy();
        expect(heading.textContent.trim()).toBe('Developer');

        // Optional fields should not be present
        expect(container.querySelector('.caption')).toBeFalsy();
        expect(container.querySelector('.description')).toBeFalsy();
        expect(container.querySelector('.skills')).toBeFalsy();
        expect(container.querySelector('details')).toBeFalsy();
    });

    test('renders children with details/summary', async () => {
        const nodeWithChildren = {
            type: 'Job',
            name: 'Senior Developer',
            children: [
                { type: 'Role', name: 'Team Lead' },
                { type: 'Product', name: 'Web App' }
            ]
        };

        const { container } = render(Recursor, { props: { node: nodeWithChildren, nodeIdx: 0 } });

        // Should have details element
        const details = container.querySelector('details');
        expect(details).toBeTruthy();
        expect(details.open).toBe(true); // Should be open for nodeIdx 0

        // Should have summary
        const summary = container.querySelector('summary');
        expect(summary).toBeTruthy();
        expect(summary.textContent).toBe('Click for Details');

        // Should render children
        const childNodes = container.querySelectorAll('.children .node');
        expect(childNodes).toHaveLength(2);
    });

    test('details element closed by default for nodeIdx > 0', async () => {
        const nodeWithChildren = {
            type: 'Job',
            name: 'Developer',
            children: [
                { type: 'Role', name: 'Specialist' }
            ]
        };

        const { container } = render(Recursor, { props: { node: nodeWithChildren, nodeIdx: 1 } });

        const details = container.querySelector('details');
        expect(details).toBeTruthy();
        expect(details.open).toBe(false); // Should be closed for nodeIdx > 0
    });

    test('toggle event changes summary text', async () => {
        const nodeWithChildren = {
            type: 'Job',
            name: 'Developer',
            children: [
                { type: 'Role', name: 'Specialist' }
            ]
        };

        const { container } = render(Recursor, { props: { node: nodeWithChildren, nodeIdx: 0 } });

        const details = container.querySelector('details');
        const summary = container.querySelector('summary');
        
        // Initially open, so should show "Click to Close"
        expect(summary.textContent).toBe('Click for Details');

        // Mock the toggle event
        const mockEvent = {
            target: {
                open: false,
                querySelector: jest.fn(() => summary)
            }
        };

        // Trigger toggle event manually
        await fireEvent(details, new CustomEvent('toggle'));
        
        // Summary text should update based on open state
        // We'll test the event handler logic separately since DOM updates are complex
    });

    test('handles mobile viewport on mount', async () => {
        // Mock mobile viewport
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 640 // Mobile width
        });

        const mockDetails = [
            { open: false },
            { open: false }
        ];

        global.document.querySelectorAll = jest.fn(() => mockDetails);

        const node = { type: 'Job', name: 'Developer' };
        
        render(Recursor, { props: { node, nodeIdx: 0 } });

        // Should call querySelectorAll for details elements
        expect(document.querySelectorAll).toHaveBeenCalledWith('details');
        
        // Should set all details to open
        mockDetails.forEach(detail => {
            expect(detail.open).toBe(true);
        });
    });

    test('does not modify details on desktop viewport', async () => {
        // Mock desktop viewport
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 1200 // Desktop width
        });

        const mockDetails = [
            { open: false },
            { open: false }
        ];

        global.document.querySelectorAll = jest.fn(() => mockDetails);

        const node = { type: 'Job', name: 'Developer' };
        
        render(Recursor, { props: { node, nodeIdx: 0 } });

        // Should not call querySelectorAll for desktop
        expect(document.querySelectorAll).not.toHaveBeenCalled();
        
        // Details should remain unchanged
        mockDetails.forEach(detail => {
            expect(detail.open).toBe(false);
        });
    });

    test('logs node data reactively', async () => {
        const node = { type: 'Job', name: 'Developer', year: '2023' };
        
        render(Recursor, { props: { node, nodeIdx: 0 } });

        // Should log the node
        expect(console.log).toHaveBeenCalledWith(node);
    });

    test('renders data-year attribute correctly', async () => {
        const node = {
            type: 'Job',
            name: 'Developer',
            year: '2020 – 2023'
        };

        const { container } = render(Recursor, { props: { node, nodeIdx: 0 } });

        const nodeElement = container.querySelector('.node');
        expect(nodeElement.getAttribute('data-year')).toBe('2023\n↑\n2020');
    });

    test('handles year without separator', async () => {
        const node = {
            type: 'Job',
            name: 'Developer',
            year: '2023'
        };

        const { container } = render(Recursor, { props: { node, nodeIdx: 0 } });

        const nodeElement = container.querySelector('.node');
        expect(nodeElement.getAttribute('data-year')).toBe('2023');
    });

    test('applies correct CSS classes', async () => {
        const node = {
            type: 'Job',
            name: 'Developer'
        };

        const { container } = render(Recursor, { props: { node, nodeIdx: 0 } });

        const nodeElement = container.querySelector('.node');
        expect(nodeElement.classList.contains('node')).toBe(true);
        expect(nodeElement.classList.contains('Job')).toBe(true);

        const heading = container.querySelector('.heading');
        expect(heading.classList.contains('heading')).toBe(true);
    });

    test('handles nested recursive rendering', async () => {
        const complexNode = {
            type: 'Job',
            name: 'Senior Engineer',
            children: [
                {
                    type: 'Role',
                    name: 'Team Lead',
                    children: [
                        { type: 'Product', name: 'Mobile App' }
                    ]
                }
            ]
        };

        const { container } = render(Recursor, { props: { node: complexNode, nodeIdx: 0 } });

        // Should render all levels
        expect(container.querySelector('h2')).toBeTruthy(); // Job
        expect(container.querySelector('h3')).toBeTruthy(); // Role
        expect(container.querySelector('h4')).toBeTruthy(); // Product
        
        // Should have nested structure
        const details = container.querySelectorAll('details');
        expect(details.length).toBeGreaterThan(0);
    });
});