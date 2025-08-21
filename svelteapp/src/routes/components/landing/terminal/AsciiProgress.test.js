/**
 * @jest-environment jsdom
 */
import { render, waitFor } from '@testing-library/svelte';
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

    it('progresses to endProgress after delay', async () => {
        const { container } = render(AsciiProgress, { 
            props: { 
                ...defaultProps,
                startProgress: 0,
                endProgress: 75
            } 
        });
        
        let progressBar = container.querySelector('.progress-bar');
        expect(progressBar).toHaveStyle('width: 0%');
        
        // Wait for component to update
        await waitFor(() => {
            progressBar = container.querySelector('.progress-bar');
            expect(progressBar).toHaveStyle('width: 75%');
        }, { timeout: 1000 });
    });

    it('calls callback after timeout', async () => {
        let callbackCalled = false;
        const mockCallback = () => {
            callbackCalled = true;
        };
        
        render(AsciiProgress, { 
            props: { 
                ...defaultProps,
                timeout: 200, // Shorter timeout for testing
                callback: mockCallback
            } 
        });
        
        expect(callbackCalled).toBe(false);
        
        // Wait for callback to be called
        await waitFor(() => {
            expect(callbackCalled).toBe(true);
        }, { timeout: 1000 });
    });

    it('does not call callback if callback is null', async () => {
        render(AsciiProgress, { 
            props: { 
                ...defaultProps,
                timeout: 100,
                callback: null
            } 
        });
        
        // Wait and ensure no error occurs
        await new Promise(resolve => setTimeout(resolve, 200));
        expect(true).toBe(true); // Test passes if no error is thrown
    });

    it('handles custom start and end progress values', async () => {
        const { container } = render(AsciiProgress, { 
            props: {
                startProgress: 10,
                endProgress: 50,
                timeout: 200,
                callback: null
            } 
        });
        
        let progressBar = container.querySelector('.progress-bar');
        expect(progressBar).toHaveStyle('width: 10%');
        
        await waitFor(() => {
            progressBar = container.querySelector('.progress-bar');
            expect(progressBar).toHaveStyle('width: 50%');
        }, { timeout: 1000 });
    });

    it('uses default props when not provided', () => {
        // Mock console.warn to avoid warnings in test output
        const originalWarn = console.warn;
        console.warn = () => {};
        
        const { container } = render(AsciiProgress);
        
        const progressBar = container.querySelector('.progress-bar');
        expect(progressBar).toHaveStyle('width: 0%');
        expect(progressBar).toHaveStyle('transition: width 1000ms ease');
        
        // Restore console.warn
        console.warn = originalWarn;
    });

    it('handles zero timeout correctly', async () => {
        let callbackCalled = false;
        const mockCallback = () => {
            callbackCalled = true;
        };
        
        render(AsciiProgress, { 
            props: { 
                ...defaultProps,
                timeout: 0,
                callback: mockCallback
            } 
        });
        
        // Wait a bit and expect callback to be called
        await waitFor(() => {
            expect(callbackCalled).toBe(true);
        }, { timeout: 500 });
    });

    it('has correct CSS classes and styling', () => {
        const { container } = render(AsciiProgress, { props: defaultProps });
        
        const progress = container.querySelector('.progress');
        expect(progress).toHaveClass('progress');
        
        const progressBar = container.querySelector('.progress-bar');
        expect(progressBar).toHaveClass('progress-bar');
        
        // Check background image is applied
        expect(progressBar).toHaveStyle('background-image: linear-gradient(90deg, var(--green) 40%, var(--grey) 40%, var(--grey) 50%, var(--green) 50%, var(--green) 90%, var(--grey) 90%, var(--grey) 100%)');
    });

    it('handles progress values at boundaries', async () => {
        // Test 0% to 100% progress
        const { container } = render(AsciiProgress, { 
            props: {
                startProgress: 0,
                endProgress: 100,
                timeout: 200,
                callback: null
            } 
        });
        
        let progressBar = container.querySelector('.progress-bar');
        expect(progressBar).toHaveStyle('width: 0%');
        
        await waitFor(() => {
            progressBar = container.querySelector('.progress-bar');
            expect(progressBar).toHaveStyle('width: 100%');
        }, { timeout: 1000 });
    });

    it('handles callback that throws error', async () => {
        const mockCallback = () => {
            throw new Error('Callback error');
        };
        
        render(AsciiProgress, { 
            props: { 
                ...defaultProps,
                timeout: 100,
                callback: mockCallback
            } 
        });
        
        // Wait and ensure component doesn't crash when callback throws
        await new Promise(resolve => setTimeout(resolve, 200));
        expect(true).toBe(true);
    });

    it('handles edge case where startProgress equals endProgress', async () => {
        const { container } = render(AsciiProgress, { 
            props: {
                startProgress: 50,
                endProgress: 50,
                timeout: 200,
                callback: null
            } 
        });
        
        let progressBar = container.querySelector('.progress-bar');
        expect(progressBar).toHaveStyle('width: 50%');
        
        // Wait a bit and ensure it stays the same
        await new Promise(resolve => setTimeout(resolve, 300));
        progressBar = container.querySelector('.progress-bar');
        expect(progressBar).toHaveStyle('width: 50%');
    });

    it('handles different timeout values', async () => {
        let callbackCalled = false;
        const mockCallback = () => {
            callbackCalled = true;
        };
        
        render(AsciiProgress, { 
            props: { 
                ...defaultProps,
                timeout: 300,
                callback: mockCallback
            } 
        });
        
        expect(callbackCalled).toBe(false);
        
        // Wait for callback to be called
        await waitFor(() => {
            expect(callbackCalled).toBe(true);
        }, { timeout: 1000 });
    });

    it('handles very large timeout values', () => {
        const mockCallback = () => {};
        
        const { container } = render(AsciiProgress, { 
            props: { 
                ...defaultProps,
                timeout: 10000,
                callback: mockCallback
            } 
        });
        
        // Should render without crashing even with large timeout
        expect(container).toBeTruthy();
    });

    it('handles negative progress values', () => {
        const { container } = render(AsciiProgress, { 
            props: {
                startProgress: -10,
                endProgress: 90,
                timeout: 1000,
                callback: null
            } 
        });
        
        const progressBar = container.querySelector('.progress-bar');
        expect(progressBar).toHaveStyle('width: -10%');
    });
});