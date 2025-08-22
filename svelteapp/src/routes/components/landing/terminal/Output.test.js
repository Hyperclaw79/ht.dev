/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/svelte';
import Output from './Output.svelte';

// Mock AudioContext
global.AudioContext = class MockAudioContext {
    constructor() {
        this.currentTime = 0;
        this.destination = {};
    }
    
    createOscillator() {
        return {
            type: 'sine',
            frequency: {
                setValueAtTime: () => {}
            },
            connect: () => {},
            start: () => {},
            stop: () => {}
        };
    }
    
    createBiquadFilter() {
        return {
            type: 'lowpass',
            frequency: {
                setValueAtTime: () => {}
            },
            connect: () => {}
        };
    }
};

describe('Output component', () => {
    it('renders without crashing', () => {
        const { container } = render(Output, { props: { output: 'Test output', error: false } });
        expect(container).toBeTruthy();
    });

    it('renders single string output correctly', () => {
        const testOutput = 'This is a test output';
        const { getByText } = render(Output, { props: { output: testOutput, error: false } });
        
        expect(getByText(testOutput)).toBeInTheDocument();
    });

    it('renders array output correctly', () => {
        const testOutput = ['Line 1', 'Line 2', 'Line 3'];
        const { getByText, container } = render(Output, { props: { output: testOutput, error: false } });
        
        testOutput.forEach(line => {
            expect(getByText(line)).toBeInTheDocument();
        });
        
        const outputSpans = container.querySelectorAll('.output');
        expect(outputSpans).toHaveLength(3);
    });

    it('applies error styling when error prop is true', () => {
        const { container } = render(Output, { props: { output: 'Error message', error: true } });
        
        const outputSpan = container.querySelector('.output');
        expect(outputSpan).toHaveClass('error');
    });

    it('does not apply error styling when error prop is false', () => {
        const { container } = render(Output, { props: { output: 'Normal output', error: false } });
        
        const outputSpan = container.querySelector('.output');
        expect(outputSpan).not.toHaveClass('error');
    });

    it('renders the output container correctly', () => {
        const { container } = render(Output, { props: { output: 'Test', error: false } });
        
        const outputContainer = container.querySelector('.outputContainer');
        expect(outputContainer).toBeInTheDocument();
    });

    it('highlights command words in output', () => {
        const testOutput = 'help command not found';
        const { container } = render(Output, { props: { output: testOutput, error: false } });
        
        const commandSpan = container.querySelector('.command');
        expect(commandSpan).toBeInTheDocument();
        expect(commandSpan.textContent).toBe('help');
    });

    it('applies command class to recognized commands in array output', () => {
        const testOutput = ['start', 'help', 'invalid'];
        const { container } = render(Output, { props: { output: testOutput, error: false } });
        
        const commandElements = container.querySelectorAll('.command');
        expect(commandElements.length).toBeGreaterThan(0);
    });

    it('handles empty output gracefully', () => {
        const { container } = render(Output, { props: { output: '', error: false } });
        expect(container).toBeTruthy();
        
        const outputSpan = container.querySelector('.output');
        expect(outputSpan).toBeInTheDocument();
    });

    it('handles null output gracefully', () => {
        const { container } = render(Output, { props: { output: null, error: false } });
        expect(container).toBeTruthy();
    });
});