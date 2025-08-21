/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/svelte';
import AsciiProgress from './AsciiProgress.svelte';

describe('AsciiProgress component', () => {
    const defaultProps = {
        startProgress: 0,
        endProgress: 90,
        timeout: 1000,
        callback: null
    };

    it('renders without crashing', () => {
        const { container } = render(AsciiProgress, { props: defaultProps });
        expect(container).toBeTruthy();
    });

    it('renders progress bar structure correctly', () => {
        const { container } = render(AsciiProgress, { props: defaultProps });
        
        const progress = container.querySelector('.progress');
        expect(progress).toBeInTheDocument();
        
        const progressBar = container.querySelector('.progress-bar');
        expect(progressBar).toBeInTheDocument();
    });

    it('starts with startProgress width', () => {
        const { container } = render(AsciiProgress, { 
            props: { 
                ...defaultProps, 
                startProgress: 25 
            } 
        });
        
        const progressBar = container.querySelector('.progress-bar');
        expect(progressBar).toHaveStyle('width: 25%');
    });

    it('applies correct transition duration', () => {
        const { container } = render(AsciiProgress, { 
            props: { 
                ...defaultProps,
                timeout: 2000
            } 
        });
        
        const progressBar = container.querySelector('.progress-bar');
        expect(progressBar).toHaveStyle('transition: width 2000ms ease');
    });

    it('handles custom start progress values', () => {
        const { container } = render(AsciiProgress, { 
            props: {
                startProgress: 10,
                endProgress: 50,
                timeout: 1000,
                callback: null
            } 
        });
        
        const progressBar = container.querySelector('.progress-bar');
        expect(progressBar).toHaveStyle('width: 10%');
    });

    it('uses default props when not provided', () => {
        const { container } = render(AsciiProgress);
        
        const progressBar = container.querySelector('.progress-bar');
        expect(progressBar).toHaveStyle('width: 0%');
        expect(progressBar).toHaveStyle('transition: width 1000ms ease');
    });

    it('handles callback prop correctly', () => {
        const mockCallback = () => {};
        
        const { container } = render(AsciiProgress, { 
            props: { 
                ...defaultProps,
                callback: mockCallback
            } 
        });
        
        expect(container).toBeTruthy();
    });

    it('handles null callback gracefully', () => {
        const { container } = render(AsciiProgress, { 
            props: { 
                ...defaultProps,
                callback: null
            } 
        });
        
        expect(container).toBeTruthy();
    });
});