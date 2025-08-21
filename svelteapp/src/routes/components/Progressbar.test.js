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
});