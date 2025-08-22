/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/svelte';
import TitleBar from '../../../../src/routes/components/landing/../../src/routes/components/TitleBar.svelte';

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
});