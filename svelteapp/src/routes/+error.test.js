import { render } from '@testing-library/svelte';
import ErrorPage from './+error.svelte';

describe('Error page (+error.svelte)', () => {
    it('should render error message', () => {
        const { getByRole } = render(ErrorPage);
        
        const heading = getByRole('heading', { level: 1 });
        expect(heading).toHaveTextContent('Test error message');
    });
});