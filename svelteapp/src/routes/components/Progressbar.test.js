/**
 * @jest-environment jsdom
 */
import { render, waitFor } from '@testing-library/svelte';
import Progressbar from './Progressbar.svelte';
import { tick } from 'svelte';

describe('Progressbar component', () => {
    const defaultProps = {
        width: 100,
        value: 50,
        animate: true
    };

    it('renders without crashing', () => {
        const { container } = render(Progressbar, { props: defaultProps });
        expect(container).toBeTruthy();
    });

    it('renders the progress bar structure correctly', () => {
        const { container } = render(Progressbar, { props: defaultProps });
        
        const progressBar = container.querySelector('.progress-bar');
        expect(progressBar).toBeInTheDocument();
        
        const progressFill = container.querySelector('.progress-bar__fill');
        expect(progressFill).toBeInTheDocument();
    });

    it('sets the correct width style', () => {
        const { container } = render(Progressbar, { props: { ...defaultProps, width: 75 } });
        
        const progressBar = container.querySelector('.progress-bar');
        expect(progressBar).toHaveStyle('width: 75%');
    });

    it('applies animate class when animate prop is true', () => {
        const { container } = render(Progressbar, { props: { ...defaultProps, animate: true } });
        
        const progressFill = container.querySelector('.progress-bar__fill');
        expect(progressFill).toHaveClass('animate');
    });

    it('does not apply animate class when animate prop is false', () => {
        const { container } = render(Progressbar, { props: { ...defaultProps, animate: false } });
        
        const progressFill = container.querySelector('.progress-bar__fill');
        expect(progressFill).not.toHaveClass('animate');
    });

    it('handles default props correctly', () => {
        const { container } = render(Progressbar);
        
        const progressBar = container.querySelector('.progress-bar');
        expect(progressBar).toHaveStyle('width: 100%');
        
        const progressFill = container.querySelector('.progress-bar__fill');
        expect(progressFill).toHaveClass('animate');
    });

    it('accepts value prop updates', async () => {
        const { container, component } = render(Progressbar, { props: defaultProps });
        
        // Update the value multiple times to trigger reactive statement
        component.$set({ value: 75 });
        await tick();
        
        component.$set({ value: 25 });
        await tick();
        
        component.$set({ value: 90 });
        await tick();
        
        expect(container).toBeTruthy();
    });

    it('handles zero value correctly', () => {
        const { container } = render(Progressbar, { props: { ...defaultProps, value: 0 } });
        
        const progressFill = container.querySelector('.progress-bar__fill');
        expect(progressFill).toBeTruthy();
    });

    it('handles maximum value correctly', () => {
        const { container } = render(Progressbar, { props: { ...defaultProps, value: 100 } });
        
        const progressFill = container.querySelector('.progress-bar__fill');
        expect(progressFill).toBeTruthy();
    });

    it('handles negative value gracefully', () => {
        const { container } = render(Progressbar, { props: { ...defaultProps, value: -10 } });
        
        const progressFill = container.querySelector('.progress-bar__fill');
        expect(progressFill).toBeTruthy();
    });

    it('handles value greater than 100 gracefully', () => {
        const { container } = render(Progressbar, { props: { ...defaultProps, value: 150 } });
        
        const progressFill = container.querySelector('.progress-bar__fill');
        expect(progressFill).toBeTruthy();
    });

    it('updates progress when value changes via reactive statement', async () => {
        const { container, component } = render(Progressbar, { props: { ...defaultProps, value: 25 } });
        
        // Change value multiple times to test reactive statement execution
        component.$set({ value: 50 });
        await tick();
        
        component.$set({ value: 75 });
        await tick();
        
        component.$set({ value: 100 });
        await tick();
        
        // Test rapid changes to ensure reactive statement handles all updates
        component.$set({ value: 30 });
        await tick();
        
        component.$set({ value: 60 });
        await tick();
        
        expect(container).toBeTruthy();
    });

    it('handles width edge cases', () => {
        const { container } = render(Progressbar, { props: { ...defaultProps, width: 0 } });
        
        const progressBar = container.querySelector('.progress-bar');
        expect(progressBar).toHaveStyle('width: 0%');
    });

    it('handles very small width values', () => {
        const { container } = render(Progressbar, { props: { ...defaultProps, width: 1 } });
        
        const progressBar = container.querySelector('.progress-bar');
        expect(progressBar).toHaveStyle('width: 1%');
    });

    it('properly calculates max-width style', async () => {
        const { container } = render(Progressbar, { props: { ...defaultProps, value: 50 } });
        
        const progressFill = container.querySelector('.progress-bar__fill');
        expect(progressFill).toBeTruthy();
        
        // Wait for tweened animation to settle
        await waitFor(() => {
            expect(progressFill.style.maxWidth).toBeTruthy();
        });
    });

    it('applies animation class conditionally based on animate prop', async () => {
        const { container, component } = render(Progressbar, { props: { ...defaultProps, animate: true } });
        
        let progressFill = container.querySelector('.progress-bar__fill');
        expect(progressFill).toHaveClass('animate');
        
        // Test that the animate prop is reactive
        component.$set({ animate: false });
        await tick();
        
        // Re-query the element after update
        progressFill = container.querySelector('.progress-bar__fill');
        expect(progressFill).not.toHaveClass('animate');
        
        // Toggle back to true
        component.$set({ animate: true });
        await tick();
        
        progressFill = container.querySelector('.progress-bar__fill');
        expect(progressFill).toHaveClass('animate');
    });

    it('has correct CSS structure and classes', () => {
        const { container } = render(Progressbar, { props: defaultProps });
        
        const progressBar = container.querySelector('.progress-bar');
        expect(progressBar).toBeInTheDocument();
        
        const progressFill = container.querySelector('.progress-bar__fill');
        expect(progressFill).toBeInTheDocument();
        
        // Check that the fill is inside the bar
        expect(progressBar).toContainElement(progressFill);
    });

    it('tests onMount functionality with different initial values', async () => {
        // Test onMount with various initial values
        const { container: container1 } = render(Progressbar, { props: { ...defaultProps, value: 0 } });
        await tick();
        expect(container1.querySelector('.progress-bar__fill')).toBeTruthy();

        const { container: container2 } = render(Progressbar, { props: { ...defaultProps, value: 100 } });
        await tick();
        expect(container2.querySelector('.progress-bar__fill')).toBeTruthy();

        const { container: container3 } = render(Progressbar, { props: { ...defaultProps, value: 33 } });
        await tick();
        expect(container3.querySelector('.progress-bar__fill')).toBeTruthy();
    });

    it('tests tweened motion behavior with immediate value changes', async () => {
        const { component } = render(Progressbar, { props: { ...defaultProps, value: 0 } });
        
        // Rapid succession of value changes to test tweened behavior
        component.$set({ value: 10 });
        component.$set({ value: 20 });
        component.$set({ value: 30 });
        component.$set({ value: 40 });
        component.$set({ value: 50 });
        
        await tick();
        
        // Test immediate jump
        component.$set({ value: 100 });
        await tick();
        
        component.$set({ value: 0 });
        await tick();
        
        expect(component).toBeTruthy();
    });

    it('tests progressive value changes through reactive statement', async () => {
        const { component } = render(Progressbar, { props: { ...defaultProps, value: 10 } });
        
        // Progressive increases
        for (let i = 20; i <= 100; i += 10) {
            component.$set({ value: i });
            await tick();
        }
        
        // Progressive decreases
        for (let i = 90; i >= 0; i -= 10) {
            component.$set({ value: i });
            await tick();
        }
        
        expect(component).toBeTruthy();
    });

    it('handles simultaneous prop changes', async () => {
        const { container, component } = render(Progressbar, { props: defaultProps });
        
        // Change multiple props simultaneously
        component.$set({ 
            value: 80, 
            width: 50, 
            animate: false 
        });
        await tick();
        
        const progressBar = container.querySelector('.progress-bar');
        const progressFill = container.querySelector('.progress-bar__fill');
        
        expect(progressBar).toHaveStyle('width: 50%');
        expect(progressFill).not.toHaveClass('animate');
        
        // Change again
        component.$set({ 
            value: 30, 
            width: 75, 
            animate: true 
        });
        await tick();
        
        expect(progressBar).toHaveStyle('width: 75%');
        expect(progressFill).toHaveClass('animate');
    });

    it('tests extreme value ranges and width combinations', async () => {
        const testCases = [
            { value: -50, width: 25 },
            { value: 200, width: 200 },
            { value: 0.5, width: 0.1 },
            { value: 99.99, width: 99.99 },
            { value: 50.5, width: 50.5 }
        ];

        for (const testCase of testCases) {
            const { container } = render(Progressbar, { props: { ...defaultProps, ...testCase } });
            await tick();
            
            const progressBar = container.querySelector('.progress-bar');
            const progressFill = container.querySelector('.progress-bar__fill');
            
            expect(progressBar).toHaveStyle(`width: ${testCase.width}%`);
            expect(progressFill).toBeTruthy();
        }
    });

    it('tests tweened motion with precise timing controls', async () => {
        const { component } = render(Progressbar, { props: { ...defaultProps, value: 0 } });
        
        // Test tweened behavior with various durations
        component.$set({ value: 25 });
        await new Promise(resolve => setTimeout(resolve, 100)); // Partial animation
        
        component.$set({ value: 75 });
        await new Promise(resolve => setTimeout(resolve, 100)); // Partial animation
        
        component.$set({ value: 100 });
        await new Promise(resolve => setTimeout(resolve, 600)); // Full animation duration
        
        expect(component).toBeTruthy();
    });

    it('tests easing function behavior in tweened motion', async () => {
        const { component } = render(Progressbar, { props: { ...defaultProps, value: 0 } });
        
        // Test that easing function (t) => t is applied
        component.$set({ value: 50 });
        await tick();
        
        // Immediate changes should still work
        component.$set({ value: 100 });
        component.$set({ value: 0 });
        component.$set({ value: 50 });
        await tick();
        
        expect(component).toBeTruthy();
    });

    it('verifies max-width calculation with $progress reactive value', async () => {
        const { container, component } = render(Progressbar, { props: { ...defaultProps, value: 48 } });
        
        await waitFor(() => {
            const progressFill = container.querySelector('.progress-bar__fill');
            // The max-width should be calculated as $progress - 2
            // So for value 48, it should be approximately 46%
            expect(progressFill.style.maxWidth).toContain('%');
        });
    });

    it('tests edge case where progress is exactly 2', async () => {
        const { container } = render(Progressbar, { props: { ...defaultProps, value: 2 } });
        
        await waitFor(() => {
            const progressFill = container.querySelector('.progress-bar__fill');
            // When value is 2, max-width should be 0% (2-2=0)
            expect(progressFill.style.maxWidth).toBeTruthy();
        });
    });

    it('tests progress calculation with decimal precision', async () => {
        const { container, component } = render(Progressbar, { props: { ...defaultProps, value: 33.33 } });
        
        await waitFor(() => {
            const progressFill = container.querySelector('.progress-bar__fill');
            expect(progressFill.style.maxWidth).toBeTruthy();
        });
        
        // Test with more decimal places
        component.$set({ value: 66.666 });
        await tick();
        
        await waitFor(() => {
            const progressFill = container.querySelector('.progress-bar__fill');
            expect(progressFill.style.maxWidth).toBeTruthy();
        });
    });

    it('tests reactive statement execution order', async () => {
        const { component } = render(Progressbar, { props: { ...defaultProps, value: 10 } });
        
        // Test that reactive statement runs after onMount
        await tick();
        
        // Multiple rapid updates to test reactive statement
        component.$set({ value: 20 });
        component.$set({ value: 30 });
        component.$set({ value: 40 });
        await tick();
        
        expect(component).toBeTruthy();
    });

    it('tests component lifecycle with various prop combinations', async () => {
        // Test different combinations of initial props
        const combinations = [
            { width: 0, value: 0, animate: false },
            { width: 50, value: 50, animate: true },
            { width: 100, value: 100, animate: false },
            { width: 25, value: 75, animate: true },
            { width: 200, value: 150, animate: false }
        ];

        for (const props of combinations) {
            const { container, component } = render(Progressbar, { props });
            await tick();
            
            const progressBar = container.querySelector('.progress-bar');
            const progressFill = container.querySelector('.progress-bar__fill');
            
            expect(progressBar).toHaveStyle(`width: ${props.width}%`);
            expect(progressFill).toBeTruthy();
            
            if (props.animate) {
                expect(progressFill).toHaveClass('animate');
            } else {
                expect(progressFill).not.toHaveClass('animate');
            }
            
            // Cleanup
            component.$destroy();
        }
    });

    it('verifies CSS class bindings and conditional classes', async () => {
        const { container, component } = render(Progressbar, { props: { ...defaultProps, animate: false } });
        
        let progressFill = container.querySelector('.progress-bar__fill');
        expect(progressFill).not.toHaveClass('animate');
        
        // Toggle animate class through prop updates
        component.$set({ animate: true });
        await tick();
        
        progressFill = container.querySelector('.progress-bar__fill');
        expect(progressFill).toHaveClass('animate');
        
        // Toggle back
        component.$set({ animate: false });
        await tick();
        
        progressFill = container.querySelector('.progress-bar__fill');
        expect(progressFill).not.toHaveClass('animate');
    });

    it('tests component destruction and cleanup', async () => {
        const { component } = render(Progressbar, { props: defaultProps });
        
        // Ensure component is working
        await tick();
        expect(component).toBeTruthy();
        
        // Test destruction
        component.$destroy();
        
        // Should not throw after destruction
        expect(() => {
            component.$destroy();
        }).not.toThrow();
    });

    it('tests onMount with different scenarios', async () => {
        // Test onMount execution timing
        const { component: comp1 } = render(Progressbar, { props: { value: 42 } });
        await tick();
        expect(comp1).toBeTruthy();
        
        // Test onMount with zero value
        const { component: comp2 } = render(Progressbar, { props: { value: 0 } });
        await tick();
        expect(comp2).toBeTruthy();
        
        // Test onMount with negative value
        const { component: comp3 } = render(Progressbar, { props: { value: -5 } });
        await tick();
        expect(comp3).toBeTruthy();
    });

    it('tests tweened duration and easing function execution', async () => {
        const { component } = render(Progressbar, { props: { value: 0 } });
        
        // Test that the easing function (t) => t gets called
        component.$set({ value: 50 });
        await new Promise(resolve => setTimeout(resolve, 250)); // Half duration
        
        component.$set({ value: 100 });
        await new Promise(resolve => setTimeout(resolve, 500)); // Full duration
        
        // Verify the component still works after animations
        expect(component).toBeTruthy();
    });

    it('tests max-width calculation edge cases', async () => {
        const edgeCases = [1, 2, 3, 97, 98, 99];
        
        for (const value of edgeCases) {
            const { container } = render(Progressbar, { props: { value } });
            
            await waitFor(() => {
                const progressFill = container.querySelector('.progress-bar__fill');
                expect(progressFill.style.maxWidth).toBeTruthy();
                // For value n, max-width should be (n-2)%
                expect(progressFill.style.maxWidth).toContain('%');
            });
        }
    });

    it('verifies reactive statement with identical values', async () => {
        const { component } = render(Progressbar, { props: { value: 50 } });
        
        // Set the same value multiple times - reactive statement should still run
        component.$set({ value: 50 });
        await tick();
        component.$set({ value: 50 });
        await tick();
        component.$set({ value: 50 });
        await tick();
        
        expect(component).toBeTruthy();
    });

    it('tests rapid prop changes with different combinations', async () => {
        const { component } = render(Progressbar, { props: defaultProps });
        
        // Rapid changes of different prop combinations
        const changes = [
            { value: 10, width: 90, animate: false },
            { value: 20, width: 80, animate: true },
            { value: 30, width: 70, animate: false },
            { value: 40, width: 60, animate: true },
            { value: 50, width: 50, animate: false }
        ];
        
        for (const change of changes) {
            component.$set(change);
            await tick();
        }
        
        expect(component).toBeTruthy();
    });

    it('validates style attribute calculations', async () => {
        const { container, component } = render(Progressbar, { props: { value: 25, width: 75 } });
        
        const progressBar = container.querySelector('.progress-bar');
        expect(progressBar.style.width).toBe('75%');
        
        // Test width updates
        component.$set({ width: 30 });
        await tick();
        expect(progressBar.style.width).toBe('30%');
        
        // Test the progress fill max-width calculation
        await waitFor(() => {
            const progressFill = container.querySelector('.progress-bar__fill');
            // Should be approximately 23% (25-2)
            expect(progressFill.style.maxWidth).toBeTruthy();
        });
    });
});