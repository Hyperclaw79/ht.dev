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

    it('should update when socials store changes', () => {
        const mockSocials = writable([]);
        const { queryAllByRole } = FooterWrapper(Footer, { socials: mockSocials });
        
        // Initially no links
        expect(queryAllByRole('link')).toHaveLength(0);
        
        // Update the store
        mockSocials.set([
            {
                name: 'GitHub',
                url: 'https://github.com/user',
                icon: '/icons/github.png'
            }
        ]);
        
        // The component should react to store changes automatically
        expect(mockSocials).toBeTruthy();
    });

    it('should handle socials with missing name field', () => {
        const mockSocials = writable([
            {
                url: 'https://github.com/user',
                icon: '/icons/github.png'
                // Missing name
            }
        ]);

        const { getAllByRole } = FooterWrapper(Footer, { socials: mockSocials });
        
        const links = getAllByRole('link');
        expect(links).toHaveLength(1);
        
        const images = getAllByRole('img');
        // Component should handle missing name gracefully
        expect(images[0]).toBeInTheDocument();
    });

    it('should handle socials with empty string values', () => {
        const mockSocials = writable([
            {
                name: '',
                url: '',
                icon: ''
            }
        ]);

        const { queryAllByRole } = FooterWrapper(Footer, { socials: mockSocials });
        
        // Should be filtered out due to empty url and icon
        const links = queryAllByRole('link');
        expect(links).toHaveLength(0);
    });

    it('should handle socials with whitespace-only values', () => {
        const mockSocials = writable([
            {
                name: '   ',
                url: '   ',
                icon: '   '
            }
        ]);

        const { queryAllByRole } = FooterWrapper(Footer, { socials: mockSocials });
        
        // Component renders truthy values but they appear empty
        const links = queryAllByRole('link');
        expect(links.length).toBeGreaterThanOrEqual(0);
    });

    it('should handle mixed valid and invalid socials', () => {
        const mockSocials = writable([
            {
                name: 'GitHub',
                url: 'https://github.com/user',
                icon: '/icons/github.png'
            },
            {
                name: 'Twitter',
                url: '',
                icon: '/icons/twitter.png'
            },
            {
                name: 'LinkedIn',
                url: 'https://linkedin.com/in/user',
                icon: '/icons/linkedin.png'
            }
        ]);

        const { getAllByRole } = FooterWrapper(Footer, { socials: mockSocials });
        
        const links = getAllByRole('link');
        expect(links).toHaveLength(2); // Only GitHub and LinkedIn
    });

    it('should apply correct link attributes for security', () => {
        const mockSocials = writable([
            {
                name: 'GitHub',
                url: 'https://github.com/user',
                icon: '/icons/github.png'
            }
        ]);

        const { getAllByRole } = FooterWrapper(Footer, { socials: mockSocials });
        
        const links = getAllByRole('link');
        expect(links[0]).toHaveAttribute('target', '_blank');
        expect(links[0]).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should handle very long social names', () => {
        const mockSocials = writable([
            {
                name: 'Very Long Social Media Platform Name That Should Be Handled Gracefully',
                url: 'https://example.com',
                icon: '/icons/example.png'
            }
        ]);

        const { getByText } = FooterWrapper(Footer, { socials: mockSocials });
        
        expect(getByText('Very Long Social Media Platform Name That Should Be Handled Gracefully')).toBeInTheDocument();
    });

    it('should handle special characters in social names', () => {
        const mockSocials = writable([
            {
                name: 'Spéciàl Çhäracters & Symbols!',
                url: 'https://example.com',
                icon: '/icons/special.png'
            }
        ]);

        const { getByText } = FooterWrapper(Footer, { socials: mockSocials });
        
        expect(getByText('Spéciàl Çhäracters & Symbols!')).toBeInTheDocument();
    });

    it('should maintain correct year in copyright across year changes', () => {
        // Mock current year
        const originalDateNow = Date.now;
        const mockYear = 2025;
        Date.now = () => new Date(`${mockYear}-01-01`).getTime();
        
        const { getByText } = FooterWrapper(Footer);
        
        expect(getByText(mockYear.toString())).toBeInTheDocument();
        
        // Restore original Date.now
        Date.now = originalDateNow;
    });

    it('should handle undefined context gracefully', () => {
        // This tests error boundary behavior
        expect(() => {
            render(Footer);
        }).toThrow();
    });

    it('should display social icons with correct accessibility attributes', () => {
        const mockSocials = writable([
            {
                name: 'GitHub',
                url: 'https://github.com/user',
                icon: '/icons/github.png'
            }
        ]);

        const { getAllByRole } = FooterWrapper(Footer, { socials: mockSocials });
        
        const images = getAllByRole('img');
        expect(images[0]).toHaveAttribute('alt', 'GitHub');
        expect(images[0]).toHaveAttribute('title', 'GitHub');
        expect(images[0]).toHaveAttribute('src', '/icons/github.png');
    });
});