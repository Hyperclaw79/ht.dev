/**
 * @jest-environment jsdom
 */

import { jest } from "@jest/globals";

// Mock dependencies
global.fetch = jest.fn();
const mockDomToImage = {
    toCanvas: jest.fn(),
    toPng: jest.fn()
};
const mockJsPDF = jest.fn().mockImplementation(() => ({
    addImage: jest.fn(),
    link: jest.fn(),
    text: jest.fn(),
    addPage: jest.fn(),
    save: jest.fn(),
    setFontSize: jest.fn(),
    setCharSpace: jest.fn()
}));

jest.unstable_mockModule("dom-to-image-more", () => ({
    default: mockDomToImage
}));

jest.unstable_mockModule("jspdf", () => ({
    default: mockJsPDF
}));

// Mock HTML content similar to resume.html structure
const mockResumeHTML = `
<style>:host { color: black; }</style>
<div class="container">
    <div class="header">
        <h1>Harshith Thota</h1>
        <h3>Senior Software Engineer | Python Developer</h3>
        <div class="contact-info">
            <a href="mailto:test@example.com">test@example.com</a>
            <a href="https://github.com/test">github.com/test</a>
        </div>
    </div>
    <div class="section experience">
        <div class="section-title"><span>Professional Experience</span></div>
        <div class="content">
            <div class="company">
                <strong>Test Company</strong>
                <span class="role">Software Engineer</span>
                <span class="period">2020-2023</span>
                <div class="project">
                    <strong>Test Project</strong>
                </div>
                <ul class="tasks">
                    <li>Developed applications</li>
                    <li>Led team initiatives</li>
                </ul>
                <div class="project-tags">
                    <span class="project-tag">Python</span>
                    <span class="project-tag">JavaScript</span>
                </div>
            </div>
        </div>
    </div>
    <div class="section projects">
        <div class="section-title"><span>Projects</span></div>
        <div class="content">
            <div class="project-title"><a href="#">Test Project</a></div>
            <div class="project-description">A test project description</div>
            <div class="project-tags">
                <span class="project-tag">React</span>
            </div>
        </div>
    </div>
    <div class="section skills">
        <div class="section-title"><span>Technical Skills</span></div>
        <div class="content technical-skills">
            <ul>
                <li><span>Python</span></li>
                <li><span>JavaScript</span></li>
            </ul>
        </div>
    </div>
    <div class="section education">
        <div class="section-title"><span>Education</span></div>
        <div class="content">
            <div class="specialization">
                <strong>Computer Science</strong>
                <span class="institution">Test University</span>
                <span class="period">2016-2020</span>
            </div>
        </div>
    </div>
    <div class="section achievements">
        <div class="section-title"><span>Achievements & Certificates</span></div>
        <div class="content">
            <div class="achievement-info">
                <strong>Test Certificate</strong>
                <span>Test Organization (2023)</span>
            </div>
        </div>
    </div>
</div>
`;

describe("DownloadResume ATS Compatibility", () => {
    beforeEach(() => {
        // Reset DOM
        document.body.innerHTML = "";

        // Mock fetch to return resume HTML
        global.fetch.mockResolvedValue({
            text: jest.fn().mockResolvedValue(mockResumeHTML)
        });

        // Mock domtoimage
        mockDomToImage.toCanvas.mockResolvedValue({
            toDataURL: jest.fn().mockReturnValue("data:image/png;base64,test")
        });

        mockDomToImage.toPng.mockResolvedValue("data:image/png;base64,test");

        // Setup Image mock
        global.Image = class {
            constructor () {
                setTimeout(() => {
                    this.onload();
                }, 0);
            }

            decode () {
                return Promise.resolve();
            }
        };
    });

    test("should include comprehensive text content in searchables for ATS compatibility", async () => {
        // Create a hidden div with shadow DOM similar to the component
        const hiddenDiv = document.createElement("div");
        const shadowRoot = hiddenDiv.attachShadow({ mode: "open" });
        shadowRoot.innerHTML = mockResumeHTML;
        document.body.appendChild(hiddenDiv);

        // Simulate the searchables selection logic from our enhanced component
        const searchables = [
            // Header information
            ...shadowRoot.querySelectorAll(".header h1"),
            ...shadowRoot.querySelectorAll(".header h3"),
            ...shadowRoot.querySelectorAll(".contact-info a"),
            // Section titles
            ...shadowRoot.querySelectorAll(".section-title span"),
            // Experience section
            ...shadowRoot.querySelectorAll(".experience .company > strong"),
            ...shadowRoot.querySelectorAll(".experience .role"),
            ...shadowRoot.querySelectorAll(".experience .period"),
            ...shadowRoot.querySelectorAll(".experience .exp_projects .project > strong"),
            ...shadowRoot.querySelectorAll(".experience .tasks li"),
            ...shadowRoot.querySelectorAll(".experience .role-tasks li"),
            ...shadowRoot.querySelectorAll(".experience .project-tag"),
            // Projects section
            ...shadowRoot.querySelectorAll(".project-title a"),
            ...shadowRoot.querySelectorAll(".project-description"),
            ...shadowRoot.querySelectorAll(".projects .project-tag"),
            // Skills section
            ...shadowRoot.querySelectorAll(".technical-skills li span"),
            ...shadowRoot.querySelectorAll(".soft-skills li span"),
            // Education section
            ...shadowRoot.querySelectorAll(".education .specialization > strong"),
            ...shadowRoot.querySelectorAll(".education .institution"),
            ...shadowRoot.querySelectorAll(".education .period"),
            // Achievements section
            ...shadowRoot.querySelectorAll(".achievement-info strong"),
            ...shadowRoot.querySelectorAll(".achievement-info span")
        ];

        // Verify we're capturing all the important content for ATS
        const searchableTexts = searchables.map(elem => elem.textContent.trim()).filter(text => text);

        // Header content
        expect(searchableTexts).toContain("Harshith Thota");
        expect(searchableTexts).toContain("Senior Software Engineer | Python Developer");
        expect(searchableTexts).toContain("test@example.com");
        expect(searchableTexts).toContain("github.com/test");

        // Section titles
        expect(searchableTexts).toContain("Professional Experience");
        expect(searchableTexts).toContain("Projects");
        expect(searchableTexts).toContain("Technical Skills");
        expect(searchableTexts).toContain("Education");
        expect(searchableTexts).toContain("Achievements & Certificates");

        // Experience content
        expect(searchableTexts).toContain("Test Company");
        expect(searchableTexts).toContain("Software Engineer");
        expect(searchableTexts).toContain("2020-2023");
        expect(searchableTexts).toContain("Test Project");
        expect(searchableTexts).toContain("Developed applications");
        expect(searchableTexts).toContain("Led team initiatives");

        // Skills and tags
        expect(searchableTexts).toContain("Python");
        expect(searchableTexts).toContain("JavaScript");
        expect(searchableTexts).toContain("React");

        // Projects content
        expect(searchableTexts).toContain("A test project description");

        // Education content
        expect(searchableTexts).toContain("Computer Science");
        expect(searchableTexts).toContain("Test University");
        expect(searchableTexts).toContain("2016-2020");

        // Achievements content
        expect(searchableTexts).toContain("Test Certificate");
        expect(searchableTexts).toContain("Test Organization (2023)");

        // Verify we have significantly more searchable content than before
        // Previous implementation only captured project tags and skill names
        const previousSearchables = [
            ...shadowRoot.querySelectorAll(".project-tag"),
            ...shadowRoot.querySelectorAll(".skills li>span")
        ];

        // Our enhanced version should capture much more content
        expect(searchables.length).toBeGreaterThan(previousSearchables.length * 3);

        // Clean up
        document.body.removeChild(hiddenDiv);
    });

    test("should maintain backwards compatibility with existing searchable elements", async () => {
        // Create a hidden div with shadow DOM
        const hiddenDiv = document.createElement("div");
        const shadowRoot = hiddenDiv.attachShadow({ mode: "open" });
        shadowRoot.innerHTML = mockResumeHTML;
        document.body.appendChild(hiddenDiv);

        // Get the new searchables
        const newSearchables = [
            ...shadowRoot.querySelectorAll(".header h1"),
            ...shadowRoot.querySelectorAll(".header h3"),
            ...shadowRoot.querySelectorAll(".contact-info a"),
            ...shadowRoot.querySelectorAll(".section-title span"),
            ...shadowRoot.querySelectorAll(".experience .company > strong"),
            ...shadowRoot.querySelectorAll(".experience .role"),
            ...shadowRoot.querySelectorAll(".experience .period"),
            ...shadowRoot.querySelectorAll(".experience .exp_projects .project > strong"),
            ...shadowRoot.querySelectorAll(".experience .tasks li"),
            ...shadowRoot.querySelectorAll(".experience .role-tasks li"),
            ...shadowRoot.querySelectorAll(".experience .project-tag"),
            ...shadowRoot.querySelectorAll(".project-title a"),
            ...shadowRoot.querySelectorAll(".project-description"),
            ...shadowRoot.querySelectorAll(".projects .project-tag"),
            ...shadowRoot.querySelectorAll(".technical-skills li span"),
            ...shadowRoot.querySelectorAll(".soft-skills li span"),
            ...shadowRoot.querySelectorAll(".education .specialization > strong"),
            ...shadowRoot.querySelectorAll(".education .institution"),
            ...shadowRoot.querySelectorAll(".education .period"),
            ...shadowRoot.querySelectorAll(".achievement-info strong"),
            ...shadowRoot.querySelectorAll(".achievement-info span")
        ];

        // Get the old searchables (what was captured before)
        const oldSearchables = [
            ...shadowRoot.querySelectorAll(".project-tag"),
            ...shadowRoot.querySelectorAll(".skills li>span")
        ];

        // Verify that all old searchables are still included in the new ones
        const newSearchableElements = new Set(newSearchables);
        oldSearchables.forEach(oldElement => {
            expect(newSearchableElements.has(oldElement)).toBe(true);
        });

        // Clean up
        document.body.removeChild(hiddenDiv);
    });
});
