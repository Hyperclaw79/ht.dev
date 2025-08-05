/**
 * @jest-environment jsdom
 */

import { describe, it, expect, beforeEach } from '@jest/globals';

describe('DownloadResume ATS Text Extraction', () => {
    // Mock DOM elements for testing the ATS text extraction
    beforeEach(() => {
        // Create a mock shadow root with resume content
        document.body.innerHTML = '';
        const container = document.createElement('div');
        container.innerHTML = `
            <div class="container">
                <div class="header">
                    <h1>John Doe</h1>
                    <h3>Senior Software Engineer</h3>
                    <div class="contact-info">
                        <span><a>john@example.com</a></span>
                        <span><a>https://github.com/johndoe</a></span>
                    </div>
                </div>
                <div class="section experience">
                    <div class="section-title"><span>Professional Experience</span></div>
                    <ul>
                        <li class="company">
                            <strong>Tech Company</strong>
                            <span class="role">Software Engineer</span>
                            <span class="period">2020-2023</span>
                            <ul class="tasks">
                                <li>Developed web applications</li>
                                <li>Led team of 5 developers</li>
                            </ul>
                            <ul class="exp_projects">
                                <li class="project">
                                    <strong>E-commerce Platform</strong>
                                    <ul class="tasks">
                                        <li>Built shopping cart functionality</li>
                                    </ul>
                                    <div class="project-tags">
                                        <span class="project-tag">React</span>
                                        <span class="project-tag">Node.js</span>
                                    </div>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <div class="section projects">
                    <div class="section-title"><span>Projects</span></div>
                    <div class="projects">
                        <div class="project-card">
                            <div class="project-title"><a>Portfolio Website</a></div>
                            <div class="project-description">Personal portfolio showcasing projects</div>
                            <div class="project-tags">
                                <span class="project-tag">JavaScript</span>
                                <span class="project-tag">CSS</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="section skills">
                    <div class="section-title"><span>Technical Skills</span></div>
                    <div class="content technical-skills">
                        <ul>
                            <li><span>JavaScript</span></li>
                            <li><span>Python</span></li>
                        </ul>
                    </div>
                    <div class="section-title"><span>Soft Skills</span></div>
                    <div class="content soft-skills">
                        <ul>
                            <li><span>Leadership</span></li>
                            <li><span>Communication</span></li>
                        </ul>
                    </div>
                </div>
                <div class="section education">
                    <div class="section-title"><span>Education</span></div>
                    <ul>
                        <li class="specialization">
                            <strong>Computer Science</strong>
                            <span class="institution">University of Technology</span>
                            <span class="period">2016-2020</span>
                        </li>
                    </ul>
                </div>
                <div class="section achievements">
                    <div class="section-title"><span>Achievements & Certificates</span></div>
                    <div class="content">
                        <div class="achievement-card">
                            <div class="achievement-info">
                                <strong>AWS Certified</strong>
                                <span>Amazon Web Services (2022)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(container);
    });

    it('should extract comprehensive text content for ATS compatibility', () => {
        // Simulate the searchable element selection logic from our fix
        const searchableSelectors = [
            // Header information
            'h1, h3',
            // Contact information
            '.contact-info a',
            // Section titles
            '.section-title span',
            // Experience section - company names, roles, periods
            '.experience .company strong',
            '.experience .role',
            '.experience .period',
            // Experience section - project names and task descriptions
            '.experience .project strong',
            '.experience .tasks li',
            // Project section - titles and descriptions
            '.project-title a',
            '.project-description',
            // Skills section - both technical and soft skills
            '.skills li>span',
            // Education section
            '.education .specialization strong',
            '.education .institution',
            '.education .period',
            // Achievements section
            '.achievement-info strong',
            '.achievement-info span',
            // Project and skill tags (original ATS content)
            '.project-tag'
        ];

        const allSearchableElements = [];
        searchableSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            allSearchableElements.push(...Array.from(elements));
        });

        // Extract text content from all searchable elements
        const extractedText = allSearchableElements
            .map(elem => elem.textContent.trim())
            .filter(text => text.length > 0);

        // Verify that we're capturing comprehensive content, not just keywords
        
        // Header information
        expect(extractedText).toContain('John Doe');
        expect(extractedText).toContain('Senior Software Engineer');
        expect(extractedText).toContain('john@example.com');
        expect(extractedText).toContain('https://github.com/johndoe');

        // Section titles
        expect(extractedText).toContain('Professional Experience');
        expect(extractedText).toContain('Projects');
        expect(extractedText).toContain('Technical Skills');
        expect(extractedText).toContain('Soft Skills');
        expect(extractedText).toContain('Education');
        expect(extractedText).toContain('Achievements & Certificates');

        // Experience details
        expect(extractedText).toContain('Tech Company');
        expect(extractedText).toContain('Software Engineer');
        expect(extractedText).toContain('2020-2023');
        expect(extractedText).toContain('Developed web applications');
        expect(extractedText).toContain('Led team of 5 developers');
        expect(extractedText).toContain('E-commerce Platform');
        expect(extractedText).toContain('Built shopping cart functionality');

        // Project details
        expect(extractedText).toContain('Portfolio Website');
        expect(extractedText).toContain('Personal portfolio showcasing projects');

        // Skills
        expect(extractedText).toContain('JavaScript');
        expect(extractedText).toContain('Python');
        expect(extractedText).toContain('Leadership');
        expect(extractedText).toContain('Communication');

        // Education
        expect(extractedText).toContain('Computer Science');
        expect(extractedText).toContain('University of Technology');
        expect(extractedText).toContain('2016-2020');

        // Achievements
        expect(extractedText).toContain('AWS Certified');
        expect(extractedText).toContain('Amazon Web Services (2022)');

        // Project tags (original keyword stuffing that we're keeping)
        expect(extractedText).toContain('React');
        expect(extractedText).toContain('Node.js');
        expect(extractedText).toContain('CSS');

        // Verify that we have significantly more content than just the original keywords
        const originalKeywordCount = extractedText.filter(text => 
            ['.project-tag', '.skills li>span'].some(selector => 
                document.querySelector(selector)?.textContent === text
            )
        ).length;

        const totalTextCount = extractedText.length;
        
        // We should have much more content than just the original keywords
        expect(totalTextCount).toBeGreaterThan(originalKeywordCount * 3);
        
        // Verify we have comprehensive text content
        expect(totalTextCount).toBeGreaterThan(20); // Should have plenty of text elements
    });

    it('should maintain backward compatibility with original ATS keywords', () => {
        // Ensure we still include the original project tags and skills
        const projectTags = Array.from(document.querySelectorAll('.project-tag'))
            .map(elem => elem.textContent.trim());
        
        const skillNames = Array.from(document.querySelectorAll('.skills li>span'))
            .map(elem => elem.textContent.trim());

        expect(projectTags).toContain('React');
        expect(projectTags).toContain('Node.js');
        expect(projectTags).toContain('JavaScript');
        expect(projectTags).toContain('CSS');

        expect(skillNames).toContain('JavaScript');
        expect(skillNames).toContain('Python');
        expect(skillNames).toContain('Leadership');
        expect(skillNames).toContain('Communication');
    });
});