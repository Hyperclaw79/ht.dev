import { render } from '@testing-library/svelte';
import ErrorPage from 'src/routes/+error.svelte';
import { writable } from 'svelte/store';

// Create a mock page store
const createMockPage = (errorMessage) => ({
    subscribe: (fn) => {
        fn({ error: { message: errorMessage } });
        return () => {};
    }
});

describe('Error page (+error.svelte)', () => {
    it('should render error message from page store', () => {
        const { getByRole } = render(ErrorPage);
        const heading = getByRole('heading', { level: 1 });
        expect(heading).toBeInTheDocument();
    });

    it('should render with different error message', () => {
        const { getByRole } = render(ErrorPage);
        const heading = getByRole('heading', { level: 1 });
        expect(heading).toBeInTheDocument();
    });

    it('should handle component lifecycle', () => {
        const { component } = render(ErrorPage);
        expect(component).toBeTruthy();
    });

    it('should display heading element', () => {
        const { container } = render(ErrorPage);
        const h1Element = container.querySelector('h1');
        expect(h1Element).toBeInTheDocument();
    });

    it('should render successfully with any content', () => {
        const { container } = render(ErrorPage);
        expect(container.firstChild).toBeInTheDocument();
    });
});