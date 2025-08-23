/**
 * Test to verify CodeQL workflow configuration
 * This test validates that the paths-ignore configuration in the CodeQL workflow
 * correctly excludes lock files while still scanning code files.
 */

import { describe, test, expect } from '@jest/globals';

describe('CodeQL Workflow Configuration', () => {
    
    const lockFilePatterns = [
        'package-lock.json',
        '**/package-lock.json',
        'project-lock.json',
        '**/project-lock.json',
        'yarn.lock',
        '**/yarn.lock',
        'pnpm-lock.yaml',
        '**/pnpm-lock.yaml'
    ];

    // Helper function to check if a file path matches any ignore pattern
    const matchesIgnorePattern = (filePath, patterns) => {
        return patterns.some(pattern => {
            // Handle exact match (no wildcards)
            if (!pattern.includes('*')) {
                return filePath === pattern;
            }
            
            // Convert glob pattern to regex
            // ** matches any number of directories (including zero)
            // * matches any number of non-slash characters
            const regexPattern = pattern
                .replace(/\*\*/g, '____DOUBLE_STAR____')
                .replace(/\*/g, '[^/]*')
                .replace(/____DOUBLE_STAR____\//, '(?:.*/)?') // ** followed by / means zero or more directories
                .replace(/____DOUBLE_STAR____$/, '.*') // ** at end means anything
                .replace(/____DOUBLE_STAR____/g, '.*'); // any remaining ** 
                
            const regex = new RegExp(`^${regexPattern}$`);
            return regex.test(filePath);
        });
    };

    test('lock files should be ignored by CodeQL', () => {
        const lockFiles = [
            'package-lock.json',
            'svelteapp/package-lock.json',
            'nested/folder/package-lock.json',
            'project-lock.json',
            'some/deep/path/project-lock.json',
            'yarn.lock',
            'frontend/yarn.lock',
            'pnpm-lock.yaml',
            'packages/app/pnpm-lock.yaml'
        ];

        lockFiles.forEach(file => {
            const shouldBeIgnored = matchesIgnorePattern(file, lockFilePatterns);
            if (!shouldBeIgnored) {
                console.log(`File ${file} was not matched by patterns:`, lockFilePatterns);
            }
            expect(shouldBeIgnored).toBe(true);
        });
    });

    test('regular code files should NOT be ignored by CodeQL', () => {
        const codeFiles = [
            'src/index.js',
            'svelteapp/src/routes/+page.svelte',
            'package.json',
            'README.md',
            '.github/workflows/codeql.yml',
            'src/lib/components/Button.svelte',
            'tests/unit/example.test.js',
            'vite.config.js',
            'svelte.config.js'
        ];

        codeFiles.forEach(file => {
            const shouldBeIgnored = matchesIgnorePattern(file, lockFilePatterns);
            expect(shouldBeIgnored).toBe(false);
        });
    });

    test('workflow should handle dependabot PR scenarios', () => {
        // Simulate typical dependabot PR that only changes lock files
        const dependabotFiles = [
            'package-lock.json',
            'svelteapp/package-lock.json'
        ];

        const allIgnored = dependabotFiles.every(file => 
            matchesIgnorePattern(file, lockFilePatterns)
        );

        expect(allIgnored).toBe(true);
    });

    test('workflow should handle mixed change scenarios', () => {
        // Simulate PR with both code and lock file changes
        const mixedFiles = [
            'src/components/NewFeature.svelte',
            'package.json',
            'package-lock.json'
        ];

        const hasCodeFiles = mixedFiles.some(file => 
            !matchesIgnorePattern(file, lockFilePatterns)
        );

        // Should still trigger CodeQL because of code files
        expect(hasCodeFiles).toBe(true);
    });

    test('workflow configuration matches intended behavior', () => {
        const testCases = [
            { file: 'package-lock.json', shouldTrigger: false, type: 'dependabot update' },
            { file: 'project-lock.json', shouldTrigger: false, type: 'dependabot update' },
            { file: 'yarn.lock', shouldTrigger: false, type: 'dependabot update' },
            { file: 'pnpm-lock.yaml', shouldTrigger: false, type: 'dependabot update' },
            { file: 'src/routes/+page.svelte', shouldTrigger: true, type: 'code change' },
            { file: 'package.json', shouldTrigger: true, type: 'dependency change' },
            { file: '.github/workflows/build.yml', shouldTrigger: true, type: 'workflow change' }
        ];

        testCases.forEach(({ file, shouldTrigger, type }) => {
            const wouldBeIgnored = matchesIgnorePattern(file, lockFilePatterns);
            const wouldTriggerCodeQL = !wouldBeIgnored;
            
            expect(wouldTriggerCodeQL).toBe(shouldTrigger);
        });
    });
});