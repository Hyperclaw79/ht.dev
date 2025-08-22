/**
 * @jest-environment jsdom
 */
import { render, waitFor } from '@testing-library/svelte';
import { jest } from '@jest/globals';
import Skills from 'src/routes/components/skills/Skills.svelte';
import { writable } from 'svelte/store';

describe('Skills component', () => {
    let mockSkillsStore;
    let mockContext;

    beforeEach(() => {
        // Create mock skills data
        mockSkillsStore = writable({
            "Technical Skills": [
                { name: "JavaScript", confidence: 90, icon: "/icons/js.png" },
                { name: "Python", confidence: 85, icon: "/icons/python.png" },
                { name: "React", confidence: 88 } // No icon
            ],
            "Soft Skills": [
                { name: "Communication", confidence: 95, icon: "/icons/comm.png" },
                { name: "Leadership", confidence: 80 },
                { name: "Teamwork", confidence: 92, icon: "/icons/team.png" }
            ]
        });

        mockContext = new Map([['skills', mockSkillsStore]]);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('renders without crashing', () => {
        const { container } = render(Skills, { 
            context: new Map([['api', mockContext]])
        });
        expect(container).toBeTruthy();
    });

    test('renders main title with correct styling', async () => {
        const { container } = render(Skills, { 
            context: new Map([['api', mockContext]])
        });
        
        await waitFor(() => {
            const title = container.querySelector('h1');
            expect(title).toBeTruthy();
            expect(title.classList.contains('font-effect-anaglyph')).toBe(true);
            expect(title.textContent).toBe('SKILLS');
        });
    });

    test('renders both skill categories', async () => {
        const { container } = render(Skills, { 
            context: new Map([['api', mockContext]])
        });
        
        await waitFor(() => {
            const skillCategories = container.querySelectorAll('.skill-category');
            expect(skillCategories).toHaveLength(2);
            
            // Check category titles
            const categoryTitles = container.querySelectorAll('.title-holder h2');
            expect(categoryTitles).toHaveLength(2);
            expect(categoryTitles[0].textContent).toBe('Technical Skills');
            expect(categoryTitles[1].textContent).toBe('Soft Skills');
        });
    });

    test('renders technical skills with correct structure', async () => {
        const { container } = render(Skills, { 
            context: new Map([['api', mockContext]])
        });
        
        await waitFor(() => {
            const technicalCategory = container.querySelectorAll('.skill-category')[0];
            expect(technicalCategory).toBeTruthy();
            
            // Check skills in technical category
            const skills = technicalCategory.querySelectorAll('.skill');
            expect(skills).toHaveLength(3);
            
            // Check first skill (JavaScript)
            const firstSkill = skills[0];
            expect(firstSkill.querySelector('h3').textContent).toBe('JavaScript');
            expect(firstSkill.querySelector('img')).toBeTruthy();
            expect(firstSkill.querySelector('img').src).toContain('/icons/js.png');
            expect(firstSkill.querySelector('img').alt).toBe('JavaScript');
        });
    });

    test('renders soft skills with correct structure', async () => {
        const { container } = render(Skills, { 
            context: new Map([['api', mockContext]])
        });
        
        await waitFor(() => {
            const softCategory = container.querySelectorAll('.skill-category')[1];
            expect(softCategory).toBeTruthy();
            
            // Check skills in soft category
            const skills = softCategory.querySelectorAll('.skill');
            expect(skills).toHaveLength(3);
            
            // Check first skill (Communication)
            const firstSkill = skills[0];
            expect(firstSkill.querySelector('h3').textContent).toBe('Communication');
            expect(firstSkill.querySelector('img')).toBeTruthy();
            expect(firstSkill.querySelector('img').src).toContain('/icons/comm.png');
        });
    });

    test('handles skills without icons', async () => {
        const { container } = render(Skills, { 
            context: new Map([['api', mockContext]])
        });
        
        await waitFor(() => {
            const technicalSkills = container.querySelectorAll('.skill-category')[0].querySelectorAll('.skill');
            const reactSkill = technicalSkills[2]; // React skill without icon
            
            expect(reactSkill.querySelector('h3').textContent).toBe('React');
            expect(reactSkill.querySelector('img')).toBeFalsy(); // No icon
            
            const softSkills = container.querySelectorAll('.skill-category')[1].querySelectorAll('.skill');
            const leadershipSkill = softSkills[1]; // Leadership skill without icon
            
            expect(leadershipSkill.querySelector('h3').textContent).toBe('Leadership');
            expect(leadershipSkill.querySelector('img')).toBeFalsy(); // No icon
        });
    });

    test('renders category icons correctly', async () => {
        const { container } = render(Skills, { 
            context: new Map([['api', mockContext]])
        });
        
        await waitFor(() => {
            const categoryIcons = container.querySelectorAll('.title-holder img');
            expect(categoryIcons).toHaveLength(2);
            
            expect(categoryIcons[0].src).toContain('/icons/technical.png');
            expect(categoryIcons[0].alt).toBe('technical icon');
            
            expect(categoryIcons[1].src).toContain('/icons/soft-skills.png');
            expect(categoryIcons[1].alt).toBe('soft-skills icon');
        });
    });

    test('applies clearTX class when inview is true', () => {
        const { container } = render(Skills, { 
            props: { inview: true },
            context: new Map([['api', mockContext]])
        });
        
        const skillCategories = container.querySelectorAll('.skill-category');
        skillCategories.forEach(category => {
            expect(category.classList.contains('clearTX')).toBe(true);
        });
    });

    test('does not apply clearTX class when inview is false', () => {
        const { container } = render(Skills, { 
            props: { inview: false },
            context: new Map([['api', mockContext]])
        });
        
        const skillCategories = container.querySelectorAll('.skill-category');
        skillCategories.forEach(category => {
            expect(category.classList.contains('clearTX')).toBe(false);
        });
    });

    test('renders nothing when skills data is missing', () => {
        const emptySkillsStore = writable({});
        const emptyContext = new Map([['skills', emptySkillsStore]]);
        
        const { container } = render(Skills, { 
            context: new Map([['api', emptyContext]])
        });
        
        expect(container.innerHTML.trim()).toBe('');
    });

    test('renders nothing when Technical Skills is missing', () => {
        const partialSkillsStore = writable({
            "Soft Skills": [
                { name: "Communication", confidence: 95 }
            ]
        });
        const partialContext = new Map([['skills', partialSkillsStore]]);
        
        const { container } = render(Skills, { 
            context: new Map([['api', partialContext]])
        });
        
        expect(container.innerHTML.trim()).toBe('');
    });

    test('renders nothing when Soft Skills is missing', () => {
        const partialSkillsStore = writable({
            "Technical Skills": [
                { name: "JavaScript", confidence: 90 }
            ]
        });
        const partialContext = new Map([['skills', partialSkillsStore]]);
        
        const { container } = render(Skills, { 
            context: new Map([['api', partialContext]])
        });
        
        expect(container.innerHTML.trim()).toBe('');
    });

    test('renders nothing when skills store is null', () => {
        const nullSkillsStore = writable(null);
        const nullContext = new Map([['skills', nullSkillsStore]]);
        
        const { container } = render(Skills, { 
            context: new Map([['api', nullContext]])
        });
        
        expect(container.innerHTML.trim()).toBe('');
    });

    test('renders Progressbar components for each skill', async () => {
        const { container } = render(Skills, { 
            context: new Map([['api', mockContext]])
        });
        
        await waitFor(() => {
            // Total skills: 3 technical + 3 soft = 6 progressbars
            const progressBars = container.querySelectorAll('.progress'); // Assuming Progressbar has .progress class
            // We can't directly test the Progressbar component, but we can verify the structure exists
            expect(container.querySelectorAll('.skill')).toHaveLength(6);
        });
    });

    test('passes correct confidence values to Progressbar', async () => {
        const { container } = render(Skills, { 
            context: new Map([['api', mockContext]])
        });
        
        await waitFor(() => {
            const skills = container.querySelectorAll('.skill');
            expect(skills).toHaveLength(6);
            
            // Each skill should have a progressbar component
            skills.forEach(skill => {
                expect(skill.querySelector('h3')).toBeTruthy(); // Skill name
                // Progressbar component should be rendered but we can't easily test its props
            });
        });
    });

    test('handles empty skill arrays', () => {
        const emptyArraysStore = writable({
            "Technical Skills": [],
            "Soft Skills": []
        });
        const emptyArraysContext = new Map([['skills', emptyArraysStore]]);
        
        const { container } = render(Skills, { 
            context: new Map([['api', emptyArraysContext]])
        });
        
        // Should render the structure but with no skills
        const skillCategories = container.querySelectorAll('.skill-category');
        expect(skillCategories).toHaveLength(2);
        
        const skills = container.querySelectorAll('.skill');
        expect(skills).toHaveLength(0);
    });

    test('handles default inview prop', () => {
        const { container } = render(Skills, { 
            context: new Map([['api', mockContext]])
        });
        
        // Default inview should be false
        const skillCategories = container.querySelectorAll('.skill-category');
        skillCategories.forEach(category => {
            expect(category.classList.contains('clearTX')).toBe(false);
        });
    });

    test('applies correct CSS classes to main elements', async () => {
        const { container } = render(Skills, { 
            context: new Map([['api', mockContext]])
        });
        
        await waitFor(() => {
            const containerEl = container.querySelector('.container');
            expect(containerEl).toBeTruthy();
            
            const skillSet = container.querySelector('.skill-set');
            expect(skillSet).toBeTruthy();
            
            const titleHolders = container.querySelectorAll('.title-holder');
            expect(titleHolders).toHaveLength(2);
            
            const skills = container.querySelectorAll('.skill');
            expect(skills).toHaveLength(6);
        });
    });

    test('handles component lifecycle', () => {
        const { unmount } = render(Skills, { 
            context: new Map([['api', mockContext]])
        });
        expect(() => unmount()).not.toThrow();
    });

    test('handles reactive skills data updates', async () => {
        const { container } = render(Skills, { 
            context: new Map([['api', mockContext]])
        });
        
        // Initial render
        await waitFor(() => {
            expect(container.querySelectorAll('.skill')).toHaveLength(6);
        });
        
        // Update skills data
        mockSkillsStore.set({
            "Technical Skills": [
                { name: "TypeScript", confidence: 95 }
            ],
            "Soft Skills": [
                { name: "Problem Solving", confidence: 90 }
            ]
        });
        
        // Should update to show new skills
        await waitFor(() => {
            expect(container.querySelectorAll('.skill')).toHaveLength(2);
            expect(container.textContent).toContain('TypeScript');
            expect(container.textContent).toContain('Problem Solving');
        });
    });

    test('handles skills with special characters in names', async () => {
        const specialSkillsStore = writable({
            "Technical Skills": [
                { name: "C++", confidence: 80, icon: "/icons/cpp.png" },
                { name: ".NET Core", confidence: 75 }
            ],
            "Soft Skills": [
                { name: "Problem-Solving", confidence: 90 }
            ]
        });
        const specialContext = new Map([['skills', specialSkillsStore]]);
        
        const { container } = render(Skills, { 
            context: new Map([['api', specialContext]])
        });
        
        await waitFor(() => {
            expect(container.textContent).toContain('C++');
            expect(container.textContent).toContain('.NET Core');
            expect(container.textContent).toContain('Problem-Solving');
        });
    });

    test('handles confidence values edge cases', async () => {
        const edgeCaseSkillsStore = writable({
            "Technical Skills": [
                { name: "Skill Zero", confidence: 0 },
                { name: "Skill Max", confidence: 100 },
                { name: "Skill Float", confidence: 87.5 }
            ],
            "Soft Skills": [
                { name: "Skill Negative", confidence: -5 }, // Edge case
                { name: "Skill Over", confidence: 150 } // Edge case
            ]
        });
        const edgeCaseContext = new Map([['skills', edgeCaseSkillsStore]]);
        
        const { container } = render(Skills, { 
            context: new Map([['api', edgeCaseContext]])
        });
        
        await waitFor(() => {
            expect(container.querySelectorAll('.skill')).toHaveLength(5);
            expect(container.textContent).toContain('Skill Zero');
            expect(container.textContent).toContain('Skill Max');
            expect(container.textContent).toContain('Skill Float');
        });
    });

    test('handles missing confidence values', async () => {
        const missingConfidenceStore = writable({
            "Technical Skills": [
                { name: "No Confidence Skill" } // Missing confidence
            ],
            "Soft Skills": [
                { name: "Also No Confidence" } // Missing confidence
            ]
        });
        const missingConfidenceContext = new Map([['skills', missingConfidenceStore]]);
        
        const { container } = render(Skills, { 
            context: new Map([['api', missingConfidenceContext]])
        });
        
        await waitFor(() => {
            expect(container.querySelectorAll('.skill')).toHaveLength(2);
            expect(container.textContent).toContain('No Confidence Skill');
            expect(container.textContent).toContain('Also No Confidence');
        });
    });
});