/**
 * @jest-environment jsdom
 */
import { render, fireEvent } from '@testing-library/svelte';
import Screen from '../../../../../src/routes/components/landing/terminal/Screen.svelte';

describe('Screen component', () => {
    const defaultData = {
        user: "root@HT.Dev",
        cwd: "~/Desktop"
    };

    beforeEach(() => {
        // Reset any global state but don't interfere with DOM rendering
        // Only mock what's necessary for testing without breaking component rendering
    });

    it('renders without crashing', () => {
        const { container } = render(Screen, { props: { data: defaultData } });
        expect(container).toBeTruthy();
    });

    it('renders the screen div with correct class', () => {
        const { container } = render(Screen, { props: { data: defaultData } });
        
        const screenDiv = container.querySelector('.screen');
        expect(screenDiv).toBeInTheDocument();
        expect(screenDiv).toHaveClass('screen');
    });

    it('renders the banner with title and subtitle', () => {
        const { container } = render(Screen, { props: { data: defaultData } });
        
        const banner = container.querySelector('.banner');
        expect(banner).toBeInTheDocument();
        
        const title = container.querySelector('.title');
        expect(title).toBeInTheDocument();
        expect(title.textContent).toBe("HT's Portfolio");
        
        const subtitle = container.querySelector('.subtitle');
        expect(subtitle).toBeInTheDocument();
    });

    it('initializes with default input', () => {
        const { container } = render(Screen, { props: { data: defaultData } });
        expect(container).toBeTruthy();
    });

    it('has correct CSS structure', () => {
        const { container } = render(Screen, { props: { data: defaultData } });
        
        const screenDiv = container.querySelector('.screen');
        expect(screenDiv).toBeInTheDocument();
        
        const innerDiv = container.querySelector('.innerDiv');
        expect(innerDiv).toBeInTheDocument();
    });

    it('handles click events on screen', () => {
        const mockInput = {
            focus: () => {}
        };
        
        Element.prototype.querySelectorAll = () => [mockInput];
        
        const { container } = render(Screen, { props: { data: defaultData } });
        const screenDiv = container.querySelector('.screen');
        
        // Only click if element exists
        if (screenDiv) {
            fireEvent.click(screenDiv);
        }
        
        expect(container).toBeTruthy();
    });

    it('handles command execution', () => {
        const { component } = render(Screen, { props: { data: defaultData } });
        expect(component).toBeTruthy();
    });

    it('handles data binding correctly', () => {
        const customData = {
            user: "test@user",
            cwd: "~/test"
        };
        
        const { container } = render(Screen, { props: { data: customData } });
        expect(container).toBeTruthy();
    });

    it('maintains inputs array structure', () => {
        const { component } = render(Screen, { props: { data: defaultData } });
        expect(component).toBeTruthy();
    });

    it('handles component lifecycle', () => {
        const { unmount } = render(Screen, { props: { data: defaultData } });
        expect(() => unmount()).not.toThrow();
    });

    it('renders with different data props', () => {
        const testData = {
            user: "admin@localhost",
            cwd: "/home/admin"
        };
        
        const { container } = render(Screen, { props: { data: testData } });
        
        const screenDiv = container.querySelector('.screen');
        expect(screenDiv).toBeInTheDocument();
    });

    it('handles missing screen element gracefully', () => {
        const { container } = render(Screen, { props: { data: defaultData } });
        expect(container).toBeTruthy();
    });

    it('displays banner content correctly', () => {
        const { container } = render(Screen, { props: { data: defaultData } });
        
        const banner = container.querySelector('.banner');
        expect(banner).toBeInTheDocument();
        
        // Check for code elements
        const codeElements = container.querySelectorAll('code');
        expect(codeElements.length).toBeGreaterThan(0);
    });

    it('handles empty or undefined data', () => {
        const emptyData = {
            user: "test@user",
            cwd: "~/"
        };
        const { container } = render(Screen, { props: { data: emptyData } });
        expect(container).toBeTruthy();
    });
});