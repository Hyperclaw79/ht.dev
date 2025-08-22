import { render } from '@testing-library/svelte';
import MobileFallback from 'src/routes/components/landing/MobileFallback.svelte';

describe('MobileFallback component', () => {
    it('should render the fallback message', () => {
        const { container } = render(MobileFallback);
        
        // The text is in a single <p> element but formatted with CSS
        const textElement = container.querySelector('p');
        expect(textElement).toBeInTheDocument();
        expect(textElement.textContent.trim()).toContain('PLEASE SWITCH TO A DESKTOP');
        expect(textElement.textContent.trim()).toContain('FOR AN ENHANCED USER EXPERIENCE.');
    });

    it('should render scroll down section', () => {
        const { getByText, container } = render(MobileFallback);
        
        expect(getByText('Scroll Down')).toBeInTheDocument();
        
        // Check for chevron element
        const chevron = container.querySelector('.chevron');
        expect(chevron).toBeInTheDocument();
    });

    it('should have proper CSS classes applied', () => {
        const { container } = render(MobileFallback);
        
        expect(container.querySelector('.fallback')).toBeInTheDocument();
        expect(container.querySelector('.morph')).toBeInTheDocument();
        expect(container.querySelector('.scroll-down')).toBeInTheDocument();
        expect(container.querySelector('.label')).toBeInTheDocument();
        expect(container.querySelector('.chevron')).toBeInTheDocument();
    });

    it('should render Mobile and Monitor SVG icons', () => {
        const { container } = render(MobileFallback);
        
        // Mobile icon should be present
        const mobileIcon = container.querySelector('#mobileIcon');
        expect(mobileIcon).toBeInTheDocument();
        
        // Monitor icon should be present
        const monitorIcon = container.querySelector('#monitorIcon');
        expect(monitorIcon).toBeInTheDocument();
    });
});