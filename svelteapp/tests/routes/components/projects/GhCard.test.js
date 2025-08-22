import { jest } from '@jest/globals';
import { render } from '@testing-library/svelte';
import GhCard from 'src/routes/components/projects/GhCard.svelte';

describe('GhCard', () => {
    const defaultProps = {
        name: 'test-repo',
        title: 'Test Repository',
        description: 'A test repository for testing purposes',
        imageUrl: 'https://example.com/image.jpg',
        tags: ['JavaScript', 'React', 'Node.js'],
        htmlUrl: 'https://github.com/user/test-repo',
        watcherCount: 10,
        stargazerCount: 25,
        forkCount: 5,
        oddOrEven: 0,
        inview: false
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders basic card with all props', async () => {
        const { container } = render(GhCard, { props: defaultProps });

        // Check title link
        const titleLink = container.querySelector('.title a');
        expect(titleLink).toBeTruthy();
        expect(titleLink.textContent.trim()).toBe('Test Repository');
        expect(titleLink.href).toBe('https://github.com/user/test-repo');
        expect(titleLink.target).toBe('_blank');
        expect(titleLink.rel).toBe('noopener noreferrer');

        // Check image
        const image = container.querySelector('img:not([src*="github.png"])');
        expect(image).toBeTruthy();
        expect(image.src).toBe('https://example.com/image.jpg');
        expect(image.alt).toBe('test-repo');

        // Check description
        const description = container.querySelector('.description');
        expect(description).toBeTruthy();
        expect(description.textContent).toBe('A test repository for testing purposes');

        // Check tags
        const tags = container.querySelector('.tags');
        expect(tags).toBeTruthy();
        expect(tags.textContent).toContain('Technologies Used: JavaScript, React, Node.js');

        // Check stats are displayed
        const statsHolder = container.querySelector('.statsHolder');
        expect(statsHolder).toBeTruthy();
    });

    test('renders fallback when no image is provided', async () => {
        const propsWithoutImage = { ...defaultProps, imageUrl: undefined };
        const { container } = render(GhCard, { props: propsWithoutImage });

        // Should not have image
        const image = container.querySelector('img:not([src*="github.png"])');
        expect(image).toBeFalsy();

        // Should have fallback
        const fallback = container.querySelector('.fallback');
        expect(fallback).toBeTruthy();
        expect(fallback.textContent.trim()).toBe('No Image for this one...');
    });

    test('renders without stats when counts are undefined', async () => {
        const propsWithoutStats = {
            ...defaultProps,
            watcherCount: undefined,
            stargazerCount: undefined,
            forkCount: undefined
        };
        const { container } = render(GhCard, { props: propsWithoutStats });

        // Should not have stats holder
        const statsHolder = container.querySelector('.statsHolder');
        expect(statsHolder).toBeFalsy();
    });

    test('renders without stats when all counts are zero', async () => {
        const propsWithZeroStats = {
            ...defaultProps,
            watcherCount: 0,
            stargazerCount: 0,
            forkCount: 0
        };
        const { container } = render(GhCard, { props: propsWithZeroStats });

        // Should not have stats holder
        const statsHolder = container.querySelector('.statsHolder');
        expect(statsHolder).toBeFalsy();
    });

    test('renders stats when some counts are non-zero', async () => {
        const propsWithPartialStats = {
            ...defaultProps,
            watcherCount: 0,
            stargazerCount: 5,
            forkCount: 0
        };
        const { container } = render(GhCard, { props: propsWithPartialStats });

        // Should have stats holder since at least one stat is non-zero
        const statsHolder = container.querySelector('.statsHolder');
        expect(statsHolder).toBeTruthy();

        // Check individual stats
        const stats = container.querySelectorAll('.stat');
        expect(stats).toHaveLength(3);

        // Check watchers stat
        const watchersStat = container.querySelector('.stat.watchers');
        expect(watchersStat).toBeTruthy();
        expect(watchersStat.textContent).toContain('WATCHERS');
        expect(watchersStat.textContent).toContain('0');

        // Check stars stat
        const starsStat = container.querySelector('.stat.stars');
        expect(starsStat).toBeTruthy();
        expect(starsStat.textContent).toContain('STARS');
        expect(starsStat.textContent).toContain('5');

        // Check forks stat
        const forksStat = container.querySelector('.stat.forks');
        expect(forksStat).toBeTruthy();
        expect(forksStat.textContent).toContain('FORKS');
        expect(forksStat.textContent).toContain('0');
    });

    test('renders stats with icons', async () => {
        const { container } = render(GhCard, { props: defaultProps });

        // Check that icons are rendered
        const statKeys = container.querySelectorAll('.statKey');
        expect(statKeys).toHaveLength(3);

        statKeys.forEach(statKey => {
            const svg = statKey.querySelector('svg');
            expect(svg).toBeTruthy();
            expect(svg.getAttribute('height')).toBe('16');
            expect(svg.getAttribute('width')).toBe('16');
        });

        // Check GitHub icon in stats header
        const githubIcon = container.querySelector('.statsHolder img[src="/icons/github.png"]');
        expect(githubIcon).toBeTruthy();
        expect(githubIcon.alt).toBe('github icon');
    });

    test('applies transform based on oddOrEven prop', async () => {
        // Test even (0)
        const { container: evenContainer } = render(GhCard, { props: { ...defaultProps, oddOrEven: 0 } });
        const evenCard = evenContainer.querySelector('.ghCard');
        expect(evenCard.style.transform).toContain('translateX(20vw)');

        // Test odd (1)
        const { container: oddContainer } = render(GhCard, { props: { ...defaultProps, oddOrEven: 1 } });
        const oddCard = oddContainer.querySelector('.ghCard');
        expect(oddCard.style.transform).toContain('translateX(-20vw)');
    });

    test('applies clearTX class when inview is true', async () => {
        const { container } = render(GhCard, { props: { ...defaultProps, inview: true } });

        const shrinker = container.querySelector('.shrinker');
        expect(shrinker.classList.contains('clearTX')).toBe(true);

        const ghCard = container.querySelector('.ghCard');
        expect(ghCard.classList.contains('clearTX')).toBe(true);
    });

    test('does not apply clearTX class when inview is false', async () => {
        const { container } = render(GhCard, { props: { ...defaultProps, inview: false } });

        const shrinker = container.querySelector('.shrinker');
        expect(shrinker.classList.contains('clearTX')).toBe(false);

        const ghCard = container.querySelector('.ghCard');
        expect(ghCard.classList.contains('clearTX')).toBe(false);
    });

    test('renders without htmlUrl (no link)', async () => {
        const propsWithoutUrl = { ...defaultProps, htmlUrl: undefined };
        const { container } = render(GhCard, { props: propsWithoutUrl });

        const titleLink = container.querySelector('.title a');
        expect(titleLink.href).toBe('');
        expect(titleLink.hasAttribute('href')).toBe(false);
    });

    test('handles empty tags array', async () => {
        const propsWithEmptyTags = { ...defaultProps, tags: [] };
        const { container } = render(GhCard, { props: propsWithEmptyTags });

        const tags = container.querySelector('.tags');
        expect(tags).toBeTruthy();
        expect(tags.textContent).toBe('Technologies Used: ');
    });

    test('handles single tag', async () => {
        const propsWithSingleTag = { ...defaultProps, tags: ['JavaScript'] };
        const { container } = render(GhCard, { props: propsWithSingleTag });

        const tags = container.querySelector('.tags');
        expect(tags).toBeTruthy();
        expect(tags.textContent).toBe('Technologies Used: JavaScript');
    });

    test('renders card structure correctly', async () => {
        const { container } = render(GhCard, { props: defaultProps });

        // Check main structure
        const shrinker = container.querySelector('.shrinker');
        expect(shrinker).toBeTruthy();
        expect(shrinker.style.transform).toBe('scaleY(0)');

        const ghCard = container.querySelector('.ghCard');
        expect(ghCard).toBeTruthy();

        const titleHolder = container.querySelector('.titleHolder');
        expect(titleHolder).toBeTruthy();

        const cardBody = container.querySelector('.cardBody');
        expect(cardBody).toBeTruthy();
    });

    test('reactive card object updates correctly', async () => {
        const { component, container } = render(GhCard, { props: defaultProps });

        // Update props
        component.$set({ 
            title: 'Updated Title',
            description: 'Updated description'
        });

        // Allow for reactivity
        await new Promise(resolve => setTimeout(resolve, 0));

        // Check updated title
        const titleLink = container.querySelector('.title a');
        expect(titleLink.textContent.trim()).toBe('Updated Title');

        // Check updated description
        const description = container.querySelector('.description');
        expect(description.textContent).toBe('Updated description');
    });

    test('handles complex descriptions with whitespace', async () => {
        const complexDescription = 'Line 1\nLine 2\n\nLine 3 with    spaces';
        const propsWithComplexDesc = { ...defaultProps, description: complexDescription };
        const { container } = render(GhCard, { props: propsWithComplexDesc });

        const description = container.querySelector('.description');
        expect(description.textContent).toBe(complexDescription);
        expect(description.tagName).toBe('PRE'); // Should preserve whitespace
    });

    test('stats calculation edge cases', async () => {
        // Test partial undefined stats
        const propsPartialUndefined = {
            ...defaultProps,
            watcherCount: 5,
            stargazerCount: undefined,
            forkCount: 3
        };
        const { container: container1 } = render(GhCard, { props: propsPartialUndefined });
        expect(container1.querySelector('.statsHolder')).toBeFalsy();

        // Test all defined but some zero
        const propsPartialZero = {
            ...defaultProps,
            watcherCount: 0,
            stargazerCount: 1,
            forkCount: 0
        };
        const { container: container2 } = render(GhCard, { props: propsPartialZero });
        expect(container2.querySelector('.statsHolder')).toBeTruthy();
    });

    test('handles very large numbers in stats', async () => {
        const propsWithLargeNumbers = {
            ...defaultProps,
            watcherCount: 1000000,
            stargazerCount: 999999,
            forkCount: 123456
        };
        const { container } = render(GhCard, { props: propsWithLargeNumbers });

        const watchersValue = container.querySelector('.stat.watchers .statValue');
        expect(watchersValue.textContent).toBe('1000000');

        const starsValue = container.querySelector('.stat.stars .statValue');
        expect(starsValue.textContent).toBe('999999');

        const forksValue = container.querySelector('.stat.forks .statValue');
        expect(forksValue.textContent).toBe('123456');
    });

    test('all stats icons have proper SVG structure', async () => {
        const { container } = render(GhCard, { props: defaultProps });

        const svgElements = container.querySelectorAll('.statKey svg');
        expect(svgElements).toHaveLength(3);

        svgElements.forEach(svg => {
            expect(svg.getAttribute('aria-hidden')).toBe('true');
            expect(svg.getAttribute('viewBox')).toBe('0 0 16 16');
            expect(svg.getAttribute('version')).toBe('1.1');
            
            const path = svg.querySelector('path');
            expect(path).toBeTruthy();
            expect(path.getAttribute('fill-rule')).toBe('evenodd');
        });
    });
});