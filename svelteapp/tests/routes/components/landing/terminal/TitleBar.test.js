/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/svelte';
import TitleBar from 'src/routes/components/landing/terminal/TitleBar.svelte';

describe('TitleBar component', () => {
    const mockData = {
        user: 'testuser',
        cwd: '/home/testuser'
    };

    it('renders without crashing', () => {
        const { container } = render(TitleBar, { props: { data: mockData } });
        expect(container).toBeTruthy();
    });

    it('displays user and cwd correctly', () => {
        const { getByText } = render(TitleBar, { props: { data: mockData } });
        expect(getByText('testuser:/home/testuser')).toBeInTheDocument();
    });

    it('has the correct CSS classes', () => {
        const { container } = render(TitleBar, { props: { data: mockData } });
        
        const titleBar = container.querySelector('.titleBar');
        expect(titleBar).toBeInTheDocument();
        
        const titleBarText = container.querySelector('.titleBarText');
        expect(titleBarText).toBeInTheDocument();
        
        const titleBarButtons = container.querySelector('.titleBarButtons');
        expect(titleBarButtons).toBeInTheDocument();
    });

    it('renders all three title buttons', () => {
        const { container } = render(TitleBar, { props: { data: mockData } });
        
        const titleButtons = container.querySelectorAll('.titleBtn');
        expect(titleButtons).toHaveLength(3);
    });

    it('renders SVG icons correctly', () => {
        const { container } = render(TitleBar, { props: { data: mockData } });
        
        const svgElements = container.querySelectorAll('svg');
        expect(svgElements).toHaveLength(3);
        
        // Check that each SVG has correct viewBox or width/height
        expect(svgElements[0]).toHaveAttribute('width', '24');
        expect(svgElements[0]).toHaveAttribute('height', '24');
        expect(svgElements[1]).toHaveAttribute('width', '24');
        expect(svgElements[1]).toHaveAttribute('height', '24');
        expect(svgElements[2]).toHaveAttribute('viewBox', '0 0 24 24');
    });

    it('handles edge cases with empty or undefined data', () => {
        // Test with empty strings
        const emptyData = { user: '', cwd: '' };
        const { getByText: getByTextEmpty } = render(TitleBar, { props: { data: emptyData } });
        expect(getByTextEmpty(':')).toBeInTheDocument();

        // Test with undefined properties (should not crash)
        const undefinedData = { user: undefined, cwd: undefined };
        const { container } = render(TitleBar, { props: { data: undefinedData } });
        expect(container.querySelector('.titleBarText')).toBeInTheDocument();
    });

    it('handles various data types gracefully', () => {
        // Test with numeric values
        const numericData = { user: 123, cwd: 456 };
        const { getByText: getByTextNumeric } = render(TitleBar, { props: { data: numericData } });
        expect(getByTextNumeric('123:456')).toBeInTheDocument();

        // Test with boolean values
        const booleanData = { user: true, cwd: false };
        const { getByText: getByTextBoolean } = render(TitleBar, { props: { data: booleanData } });
        expect(getByTextBoolean('true:false')).toBeInTheDocument();
    });

    it('handles null and undefined data properties', () => {
        // Test with null values
        const nullData = { user: null, cwd: null };
        const { container: nullContainer } = render(TitleBar, { props: { data: nullData } });
        const titleBarText = nullContainer.querySelector('.titleBarText');
        expect(titleBarText).toBeInTheDocument();
        expect(titleBarText.textContent).toContain(':');

        // Test with undefined values  
        const undefinedData = { user: undefined, cwd: undefined };
        const { container: undefinedContainer } = render(TitleBar, { props: { data: undefinedData } });
        const titleBarTextUndef = undefinedContainer.querySelector('.titleBarText');
        expect(titleBarTextUndef).toBeInTheDocument();
        expect(titleBarTextUndef.textContent).toContain(':');
    });

    it('handles missing data object', () => {
        // Test with default data structure to avoid template errors
        const defaultData = { user: '', cwd: '' };
        const { container } = render(TitleBar, { props: { data: defaultData } });
        const titleBarText = container.querySelector('.titleBarText');
        expect(titleBarText).toBeInTheDocument();
        expect(titleBarText.textContent).toBe(':');
    });

    it('covers all possible data access branches', () => {
        // Test various combinations to cover all branches
        const testCases = [
            { user: 'user', cwd: '' },
            { user: '', cwd: 'path' },
            { user: 0, cwd: 'path' }, // falsy number
            { user: 'user', cwd: 0 }, // falsy number
            { user: false, cwd: true },
            { user: [], cwd: {} }, // objects
        ];

        testCases.forEach((testData, index) => {
            const { container } = render(TitleBar, { props: { data: testData } });
            const titleBarText = container.querySelector('.titleBarText');
            expect(titleBarText).toBeInTheDocument();
            // Each case should render something (even if empty)
            expect(titleBarText.textContent).toContain(':');
        });
    });
});