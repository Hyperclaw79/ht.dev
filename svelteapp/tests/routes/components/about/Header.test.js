/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/svelte';
import Header from '../../../src/routes/components/../../src/routes/components/Header.svelte';

describe('Header component', () => {
    const mockSocials = [
        {
            name: 'GitHub',
            url: 'https://github.com/testuser',
            icon: 'https://example.com/github-icon.png'
        },
        {
            name: 'LinkedIn',
            url: 'https://linkedin.com/in/testuser',
            icon: 'https://example.com/linkedin-icon.png'
        }
    ];

    it('renders without crashing', () => {
        const { container } = render(Header, { props: { socials: mockSocials } });
        expect(container).toBeTruthy();
    });

    it('renders the header structure correctly', () => {
        const { container } = render(Header, { props: { socials: mockSocials } });
        
        const header = container.querySelector('.header');
        expect(header).toBeInTheDocument();
        
        const headerLeft = container.querySelector('.headerLeft');
        expect(headerLeft).toBeInTheDocument();
        
        const headerRight = container.querySelector('.headerRight');
        expect(headerRight).toBeInTheDocument();
    });

    it('displays the name correctly', () => {
        const { getByText } = render(Header, { props: { socials: mockSocials } });
        
        expect(getByText('H')).toBeInTheDocument();
        expect(getByText('ARSHITH')).toBeInTheDocument();
        expect(getByText('T')).toBeInTheDocument();
        expect(getByText('HOTA')).toBeInTheDocument();
    });

    it('displays the developer title', () => {
        const { getByText } = render(Header, { props: { socials: mockSocials } });
        
        expect(getByText('PYTHON')).toBeInTheDocument();
        expect(getByText('DEVELOPER')).toBeInTheDocument();
    });

    it('renders the avatar image', () => {
        const { container } = render(Header, { props: { socials: mockSocials } });
        
        const avatar = container.querySelector('img[alt="Avatar"]');
        expect(avatar).toBeInTheDocument();
        expect(avatar).toHaveAttribute('src', 'https://avatars.githubusercontent.com/u/29298411?v=4');
    });

    it('renders social links correctly', () => {
        const { container } = render(Header, { props: { socials: mockSocials } });
        
        const socialLinks = container.querySelectorAll('.social');
        expect(socialLinks).toHaveLength(2);
        
        const githubLink = container.querySelector('a[href="https://github.com/testuser"]');
        expect(githubLink).toBeInTheDocument();
        
        const linkedinLink = container.querySelector('a[href="https://linkedin.com/in/testuser"]');
        expect(linkedinLink).toBeInTheDocument();
    });

    it('renders social icons with correct attributes', () => {
        const { container } = render(Header, { props: { socials: mockSocials } });
        
        const socialIcons = container.querySelectorAll('.social .icon');
        expect(socialIcons).toHaveLength(2);
        
        expect(socialIcons[0]).toHaveAttribute('src', 'https://example.com/github-icon.png');
        expect(socialIcons[0]).toHaveAttribute('alt', 'GitHub');
        expect(socialIcons[0]).toHaveAttribute('title', 'GitHub');
    });

    it('handles empty socials array gracefully', () => {
        const { container } = render(Header, { props: { socials: [] } });
        
        expect(container).toBeTruthy();
        
        const socialLinks = container.querySelectorAll('.social');
        expect(socialLinks).toHaveLength(0);
    });

    it('handles null socials gracefully', () => {
        const { container } = render(Header, { props: { socials: null } });
        
        expect(container).toBeTruthy();
        
        const socialLinks = container.querySelectorAll('.social');
        expect(socialLinks).toHaveLength(0);
    });

    it('handles undefined socials gracefully', () => {
        const { container } = render(Header, { props: { socials: undefined } });
        
        expect(container).toBeTruthy();
        
        const socialLinks = container.querySelectorAll('.social');
        expect(socialLinks).toHaveLength(0);
    });

    it('filters out socials without url or icon', () => {
        const socialsWithMissing = [
            {
                name: 'GitHub',
                url: 'https://github.com/testuser',
                icon: 'https://example.com/github-icon.png'
            },
            {
                name: 'Twitter',
                url: 'https://twitter.com/testuser'
                // Missing icon
            },
            {
                name: 'Instagram',
                icon: 'https://example.com/instagram-icon.png'
                // Missing url
            }
        ];
        
        const { container } = render(Header, { props: { socials: socialsWithMissing } });
        
        // Only GitHub should be rendered since it has both url and icon
        const socialLinks = container.querySelectorAll('.social');
        expect(socialLinks).toHaveLength(1);
        
        const githubLink = container.querySelector('a[href="https://github.com/testuser"]');
        expect(githubLink).toBeInTheDocument();
    });

    it('has correct CSS classes applied', () => {
        const { container } = render(Header, { props: { socials: mockSocials } });
        
        const nameHolder = container.querySelector('.nameHolder');
        expect(nameHolder).toBeInTheDocument();
        
        const firstName = container.querySelector('.firstname');
        expect(firstName).toBeInTheDocument();
        
        const lastName = container.querySelector('.lastname');
        expect(lastName).toBeInTheDocument();
        
        const caps = container.querySelectorAll('.cap');
        expect(caps).toHaveLength(2);
    });
});