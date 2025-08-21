/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/svelte';
import Progressbar from './Progressbar.svelte';

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

    it('accepts value prop updates', () => {
        const { container, component } = render(Progressbar, { props: defaultProps });
        
        // Update the value
        component.$set({ value: 75 });
        
        expect(container).toBeTruthy(); // Component should handle the update without crashing
    });
});