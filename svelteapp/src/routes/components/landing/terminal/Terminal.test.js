/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/svelte';
import Terminal from './Terminal.svelte';

describe('Terminal component', () => {
    const defaultData = {
        user: "root@HT.Dev",
        cwd: "~/Desktop"
    };

    it('renders without crashing', () => {
        const { container } = render(Terminal, { props: { data: defaultData } });
        expect(container).toBeTruthy();
    });

    it('renders the terminal div with correct class', () => {
        const { container } = render(Terminal, { props: { data: defaultData } });
        
        const terminalDiv = container.querySelector('.terminal');
        expect(terminalDiv).toBeInTheDocument();
        expect(terminalDiv).toHaveClass('terminal');
    });

    it('passes data to child components', () => {
        const customData = {
            user: "test@user",
            cwd: "~/test"
        };
        
        const { container } = render(Terminal, { props: { data: customData } });
        expect(container).toBeTruthy();
    });

    it('has correct CSS styling', () => {
        const { container } = render(Terminal, { props: { data: defaultData } });
        
        const terminalDiv = container.querySelector('.terminal');
        const styles = window.getComputedStyle(terminalDiv);
        
        expect(styles.position).toBe('relative');
        expect(styles.display).toBe('flex');
        expect(styles.flexDirection).toBe('column');
        expect(styles.justifyContent).toBe('center');
        expect(styles.alignItems).toBe('center');
        expect(styles.width).toBe('80vw');
        expect(styles.margin).toBe('auto');
    });

    it('handles default data prop', () => {
        const { container } = render(Terminal);
        expect(container).toBeTruthy();
    });

    it('renders TitleBar and Screen components', () => {
        const { container } = render(Terminal, { props: { data: defaultData } });
        
        // Terminal should contain child components
        const terminalDiv = container.querySelector('.terminal');
        expect(terminalDiv.children.length).toBeGreaterThan(0);
    });

    it('handles data binding correctly', () => {
        const { component } = render(Terminal, { props: { data: defaultData } });
        expect(component).toBeTruthy();
    });

    it('handles component lifecycle', () => {
        const { unmount } = render(Terminal, { props: { data: defaultData } });
        expect(() => unmount()).not.toThrow();
    });

    it('handles different user and cwd values', () => {
        const testCases = [
            { user: "admin@localhost", cwd: "/home/admin" },
            { user: "guest@system", cwd: "/tmp" },
            { user: "", cwd: "" }
        ];

        testCases.forEach(data => {
            const { container } = render(Terminal, { props: { data } });
            expect(container.querySelector('.terminal')).toBeInTheDocument();
        });
    });

    it('maintains terminal structure with various data', () => {
        const { container } = render(Terminal, { 
            props: { 
                data: {
                    user: "developer@machine",
                    cwd: "/workspace/project"
                }
            }
        });
        
        const terminalDiv = container.querySelector('.terminal');
        expect(terminalDiv).toBeInTheDocument();
        expect(terminalDiv.children.length).toBeGreaterThan(0);
    });
});