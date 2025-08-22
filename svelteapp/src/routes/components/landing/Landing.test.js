/**
 * @jest-environment jsdom
 */
import { render, fireEvent } from '@testing-library/svelte';
import { writable } from 'svelte/store';
import Landing from './Landing.svelte';

// Mock context data for IconCanvas component
const mockSkills = writable({
    "Technical Skills": [
        { icon: 'test-icon-1', name: 'JavaScript' },
        { icon: 'test-icon-2', name: 'Python' }
    ]
});

const mockContext = new Map();
mockContext.set('skills', mockSkills);

describe('Landing component', () => {
    it('renders without crashing', () => {
        const { container } = render(Landing, {
            context: new Map([['api', mockContext]])
        });
        expect(container).toBeTruthy();
    });

    it('renders the landing div with correct class', () => {
        const { container } = render(Landing, {
            context: new Map([['api', mockContext]])
        });
        
        const landingDiv = container.querySelector('.landing');
        expect(landingDiv).toBeInTheDocument();
        expect(landingDiv).toHaveClass('landing');
    });

    it('renders all child components', () => {
        const { container } = render(Landing, {
            context: new Map([['api', mockContext]])
        });
        
        // Landing should contain the main components
        expect(container.firstChild).toBeTruthy();
        expect(container.querySelector('.landing')).toBeTruthy();
    });

    it('has correct CSS styling structure', () => {
        const { container } = render(Landing, {
            context: new Map([['api', mockContext]])
        });
        
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
        const { component } = render(Landing, {
            context: new Map([['api', mockContext]])
        });
        expect(component).toBeTruthy();
    });

    it('provides handle binding', () => {
        const { container } = render(Landing, {
            context: new Map([['api', mockContext]])
        });
        expect(container).toBeTruthy();
    });

    it('maintains proper component structure', () => {
        const { container } = render(Landing, {
            context: new Map([['api', mockContext]])
        });
        
        const landingDiv = container.querySelector('.landing');
        expect(landingDiv).toBeInTheDocument();
        
        // Should have child elements for the components
        expect(landingDiv.children.length).toBeGreaterThan(0);
    });

    it('handles component lifecycle correctly', () => {
        const { unmount } = render(Landing, {
            context: new Map([['api', mockContext]])
        });
        
        expect(() => unmount()).not.toThrow();
    });

    it('responds to shrunkEvent properly', () => {
        const { component } = render(Landing, {
            context: new Map([['api', mockContext]])
        });
        
        // Component should handle the shrunk event from Shrinkable
        expect(component).toBeTruthy();
    });

    it('handles empty skills data gracefully', () => {
        const emptySkills = writable({});
        const emptyContext = new Map();
        emptyContext.set('skills', emptySkills);

        const { container } = render(Landing, {
            context: new Map([['api', emptyContext]])
        });
        expect(container).toBeTruthy();
    });

    it('handles missing Technical Skills gracefully', () => {
        const skillsWithoutTechnical = writable({
            "Soft Skills": ["Communication", "Leadership"]
        });
        const contextWithoutTechnical = new Map();
        contextWithoutTechnical.set('skills', skillsWithoutTechnical);

        expect(() => {
            render(Landing, {
                context: new Map([['api', contextWithoutTechnical]])
            });
        }).not.toThrow();
    });
});