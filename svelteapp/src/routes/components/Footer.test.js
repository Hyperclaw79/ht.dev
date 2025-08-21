import { render } from '@testing-library/svelte';
import { writable } from 'svelte/store';
import Footer from './Footer.svelte';

// Create a wrapper component to provide context
const FooterWrapper = (component, options = {}) => {
    return render(component, {
        context: new Map([
            ['api', new Map([
                ['socials', options.socials || writable([])]
            ])]
        ])
    });
};

describe('Footer component', () => {
    it('should render copyright with current year', () => {
        const { getByText } = FooterWrapper(Footer);
        
        const currentYear = new Date().getFullYear();
        expect(getByText(`© Harshith Thota`)).toBeInTheDocument();
        expect(getByText(currentYear.toString())).toBeInTheDocument();
    });

    it('should render social links when provided', () => {
        const mockSocials = writable([
            {
                name: 'GitHub',
                url: 'https://github.com/user',
                icon: '/icons/github.png'
            },
            {
                name: 'LinkedIn',
                url: 'https://linkedin.com/in/user',
                icon: '/icons/linkedin.png'
            }
        ]);

        const { getAllByRole } = FooterWrapper(Footer, { socials: mockSocials });
        
        const links = getAllByRole('link');
        expect(links).toHaveLength(2);
        
        // Check first social link
        expect(links[0]).toHaveAttribute('href', 'https://github.com/user');
        expect(links[0]).toHaveAttribute('target', '_blank');
        expect(links[0]).toHaveAttribute('rel', 'noopener noreferrer');
        
        // Check social icons
        const images = getAllByRole('img');
        expect(images[0]).toHaveAttribute('src', '/icons/github.png');
        expect(images[0]).toHaveAttribute('alt', 'GitHub');
        expect(images[0]).toHaveAttribute('title', 'GitHub');
    });

    it('should handle empty socials array', () => {
        const mockSocials = writable([]);
        const { queryAllByRole } = FooterWrapper(Footer, { socials: mockSocials });
        
        const links = queryAllByRole('link');
        expect(links).toHaveLength(0);
    });

    it('should filter out socials without url or icon', () => {
        const mockSocials = writable([
            {
                name: 'GitHub',
                url: 'https://github.com/user',
                icon: '/icons/github.png'
            },
            {
                name: 'Twitter',
                url: 'https://twitter.com/user',
                // No icon - should be filtered out
            },
            {
                name: 'Facebook',
                // No URL - should be filtered out
                icon: '/icons/facebook.png'
            },
            {
                name: 'LinkedIn',
                url: 'https://linkedin.com/in/user',
                icon: '/icons/linkedin.png'
            }
        ]);

        const { getAllByRole } = FooterWrapper(Footer, { socials: mockSocials });
        
        const links = getAllByRole('link');
        expect(links).toHaveLength(2); // Only GitHub and LinkedIn should render
    });

    it('should handle null socials', () => {
        const mockSocials = writable(null);
        const { queryAllByRole } = FooterWrapper(Footer, { socials: mockSocials });
        
        const links = queryAllByRole('link');
        expect(links).toHaveLength(0);
    });

    it('should display social names', () => {
        const mockSocials = writable([
            {
                name: 'GitHub',
                url: 'https://github.com/user',
                icon: '/icons/github.png'
            }
        ]);

        const { getByText } = FooterWrapper(Footer, { socials: mockSocials });
        
        expect(getByText('GitHub')).toBeInTheDocument();
    });
});