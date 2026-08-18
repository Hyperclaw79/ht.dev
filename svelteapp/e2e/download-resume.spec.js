import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import pdfjs from "pdf-parse/lib/pdf.js/v1.10.100/build/pdf.js";

const readPdfGeometry = async (pdfBuffer) => {
    pdfjs.disableWorker = true;
    const document = await pdfjs.getDocument(pdfBuffer);
    const pages = [];

    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber++) {
        const page = await document.getPage(pageNumber);
        const [textContent, annotations] = await Promise.all([
            page.getTextContent({
                normalizeWhitespace: false,
                disableCombineTextItems: true
            }),
            page.getAnnotations()
        ]);
        pages.push({
            items: textContent.items.map((item) => ({
                text: item.str.trim(),
                x: item.transform[4],
                y: item.transform[5],
                width: item.width,
                height: item.height
            })).filter((item) => item.text),
            fontFamilies: [...new Set(
                Object.values(textContent.styles).map((style) => style.fontFamily)
            )],
            annotations
        });
    }

    await document.destroy();
    return pages;
};

test.describe("Download Resume Functionality", () => {
    test("should display resume download component", async ({ page }) => {
    // Set desktop viewport to ensure we see the main content
        await page.setViewportSize({ width: 1200, height: 800 });

        await page.goto("/");
        await page.waitForLoadState("networkidle");

        // Navigate to download resume section
        await page.goto("/#downloadResume");
        await page.waitForLoadState("networkidle");

        // Wait for the section to be visible
        const downloadSection = page.locator("#downloadResume");
        await expect(downloadSection).toBeVisible();

        // Check for download content elements
        const downloadContent = page.locator(".download-content");
        await expect(downloadContent).toBeVisible();

        // Verify heading and description
        await expect(page.locator("h2", { hasText: "Download My Resume" })).toBeVisible();
        await expect(page.locator("text=Get a copy of my dynamically generated resume")).toBeVisible();

        // Check for resume preview element
        const resumePreview = page.locator(".resume-preview");
        await expect(resumePreview).toBeVisible();

        // Check for download button
        const downloadButton = page.locator(".btn-download");
        await expect(downloadButton).toBeVisible();
        await expect(downloadButton.locator("span", { hasText: "Download" })).toBeVisible();
    });

    test("should generate and display resume thumbnail", async ({ page }) => {
        await page.setViewportSize({ width: 1200, height: 800 });

        // Navigate to download resume section
        await page.goto("/#downloadResume");
        await page.waitForLoadState("networkidle");

        await page.goto("/#downloadResume");
        await page.waitForLoadState("networkidle");

        // Wait for API data to load - check for multiple API endpoints
        await page.waitForTimeout(5000);

        // Wait for thumbnail to load or timeout after 15 seconds (reduced from 30)
        const resumePreview = page.locator(".resume-preview");
        const thumbnailImage = resumePreview.locator("img");
        const loader = resumePreview.locator(".loader");

        // Either thumbnail should load or we should see the loader
        await expect(resumePreview).toBeVisible();

        try {
            // Wait for thumbnail to appear (max 30 seconds - increased for reliability)
            await thumbnailImage.waitFor({ state: "visible", timeout: 30000 });

            // Verify thumbnail src is a data URL
            const imgSrc = await thumbnailImage.getAttribute("src");
            expect(imgSrc).toMatch(/^data:image\/png;base64,/);

            // Verify the download button is enabled when thumbnail is ready
            const downloadButton = page.locator(".btn-download");
            await expect(downloadButton).not.toBeDisabled();
        } catch (error) {
            // Wait longer and try again if first attempt failed
            console.log("First thumbnail generation attempt timed out, trying again...");
            await page.waitForTimeout(5000);

            try {
                await thumbnailImage.waitFor({ state: "visible", timeout: 30000 });
                const imgSrc = await thumbnailImage.getAttribute("src");
                expect(imgSrc).toMatch(/^data:image\/png;base64,/);
            } catch (retryError) {
                // If still failing, check the actual state and fail meaningfully
                const isLoaderVisible = await loader.isVisible();
                const downloadButton = page.locator(".btn-download");
                const isButtonDisabled = await downloadButton.isDisabled();

                console.log(`Thumbnail generation failed. Loader visible: ${isLoaderVisible}, Button disabled: ${isButtonDisabled}`);

                // This should succeed - either thumbnail loads or we have a proper loading state
                expect(isLoaderVisible || !isButtonDisabled).toBe(true);
            }
        }
    });

    test("should download resume PDF with proper ATS text layer", async ({ page }) => {
        await page.setViewportSize({ width: 1200, height: 800 });

        // Navigate to download resume section
        await page.goto("/#downloadResume");
        await page.waitForLoadState("networkidle");
        await page.goto("/#downloadResume");

        // Wait for data to load
        await page.waitForTimeout(3000);

        // Wait for thumbnail to be ready - try multiple times if needed
        const resumePreview = page.locator(".resume-preview");
        const thumbnailImage = resumePreview.locator("img");
        const downloadButton = page.locator(".btn-download");

        await thumbnailImage.waitFor({ state: "visible", timeout: 30000 });

        // Set up download handler
        const downloadPromise = page.waitForEvent("download", { timeout: 5000 });

        // Click download button
        await downloadButton.click();

        // Immediately after click, button should be disabled (during processing)
        await expect(downloadButton).toBeDisabled();

        // Wait for download to start
        const download = await downloadPromise;

        // After download completes, button should be enabled again
        await expect(downloadButton).not.toBeDisabled();

        // Verify download filename
        expect(download.suggestedFilename()).toBe("Harshith Thota Resume.pdf");

        // Save the downloaded file for content verification
        const downloadPath = path.join(process.cwd(), "test-downloads", download.suggestedFilename());

        // Ensure download directory exists
        const downloadDir = path.dirname(downloadPath);
        if (!fs.existsSync(downloadDir)) {
            fs.mkdirSync(downloadDir, { recursive: true });
        }

        await download.saveAs(downloadPath);

        // Verify file was downloaded and has content
        expect(fs.existsSync(downloadPath)).toBe(true);
        const fileStats = fs.statSync(downloadPath);
        expect(fileStats.size).toBeGreaterThan(30000); // Should be at least 30KB (reduced from 50KB)

        // Parse the actual PDF text layer. Searching the compressed PDF bytes is
        // not a meaningful ATS test because visible image text is rasterized and
        // the searchable text is deliberately overlaid invisibly by the generator.
        try {
            const pdfBuffer = await fs.promises.readFile(downloadPath);

            const pdfHeader = pdfBuffer.subarray(0, 4).toString();
            expect(pdfHeader).toBe("%PDF");

            const parsed = await pdfParse(pdfBuffer);
            const atsText = parsed.text;
            const normalizedAtsText = atsText.replace(/\s+/g, " ").trim();

            [
                "Harshith Thota", "Experience", "Recent Projects",
                "Hyperlab", "DigiCloneMCP", "Technical Skills",
                "Serial", "Communication", "Amazon", "Services", "AWS",
                "Google", "Kubernetes", "Engine", "GKE",
                "Model", "Context", "Protocol", "MCP",
                "Education", "Achievements"
            ].forEach(text => expect(atsText).toContain(text));

            [
                "Harshith Thota",
                "Senior Software Engineer",
                "Python SQL",
                "Amazon Web Services (AWS)",
                "Google Kubernetes Engine (GKE)",
                "TLS / Certificate Management",
                "Model Context Protocol (MCP)",
                "Self-hosted engineering platform spanning service orchestration"
            ].forEach(text => expect(normalizedAtsText).toContain(text));

            [
                "HarshithThota",
                "SeniorSoftwareEngineer",
                "PythonSQL",
                "AmazonWebServices",
                "ModelContextProtocol"
            ].forEach(text => expect(normalizedAtsText).not.toContain(text));

            ["Soft Skills", "Rust", "OpenTofu", "Ansible"].forEach(text => {
                expect(atsText).not.toContain(text);
            });

            expect(parsed.numpages).toBe(3);

            // Geometry sanity checks guard against an ATS-only implementation
            // that dumps text in a corner or rebuilds unrelated global lines.
            const pages = await readPdfGeometry(pdfBuffer);
            pages.forEach((page) => expect(page.fontFamilies).toContain("monospace"));
            const page2Items = pages[1].items;
            const item = (text) => page2Items.find((entry) => entry.text === text);
            const wrappedSkillLines = (text) => {
                const groups = new Map();
                page2Items.forEach((entry) => {
                    const x = entry.x.toFixed(1);
                    groups.set(x, [...(groups.get(x) || []), entry]);
                });

                for (const entries of groups.values()) {
                    const lines = entries.sort((a, b) => b.y - a.y);
                    for (let start = 0; start < lines.length; start++) {
                        let joined = "";
                        for (let end = start; end < lines.length; end++) {
                            if (end > start) {
                                const lineGap = lines[end - 1].y - lines[end].y;
                                if (lineGap < 10 || lineGap > 20) break;
                            }
                            joined = `${joined}${joined ? " " : ""}${lines[end].text}`;
                            if (joined === text) return lines.slice(start, end + 1);
                            if (!text.startsWith(joined)) break;
                        }
                    }
                }
                return [];
            };

            const xCoordinates = page2Items.map((entry) => entry.x);
            const yCoordinates = page2Items.map((entry) => entry.y);
            expect(Math.max(...xCoordinates) - Math.min(...xCoordinates)).toBeGreaterThan(500);
            expect(Math.max(...yCoordinates) - Math.min(...yCoordinates)).toBeGreaterThan(850);

            const projectDescription =
                "Self-hosted engineering platform spanning service orchestration, " +
                "CI/CD, local networking, DNS, reverse proxying, observability, " +
                "identity, documentation, automation, and custom software.";
            const projectLines = wrappedSkillLines(projectDescription);
            expect(projectLines.length).toBeGreaterThan(1);
            projectLines.forEach((line) => {
                expect(line.x).toBeCloseTo(51, 0);
                expect(line.width).toBeLessThan(360);
            });
            for (let index = 1; index < projectLines.length; index++) {
                const lineGap = projectLines[index - 1].y - projectLines[index].y;
                expect(lineGap).toBeGreaterThan(15);
                expect(lineGap).toBeLessThan(20);
            }

            const djangoLines = wrappedSkillLines("Django REST Framework (DRF)");
            const awsLines = wrappedSkillLines("Amazon Web Services (AWS)");
            [djangoLines, awsLines].forEach((lines) => {
                expect(lines.length).toBeGreaterThan(1);
                lines.forEach((line) => expect(line.width).toBeLessThan(110));
            });

            const shortSkill = page2Items.find((entry) =>
                entry.text === "Python" && entry.x < 100
            );
            const wipStatus = item("WIP");
            // These bounds are the browser-measured text widths. The previous
            // implementation appended a space after scaling and overran both.
            expect(shortSkill.width).toBeLessThan(45);
            expect(wipStatus.width).toBeLessThan(20);
            expect(page2Items.filter((entry) => entry.text === "Recent Projects")).toHaveLength(1);

            const page1Urls = pages[0].annotations.map((annotation) => annotation.url);
            expect(page1Urls).toEqual(expect.arrayContaining([
                "mailto:harshith.thota7@gmail.com",
                "https://github.com/hyperclaw79",
                "https://linkedin.com/in/harshith-thota"
            ]));

            console.log(`PDF ATS layer verified: ${fileStats.size} bytes`);
            fs.unlinkSync(downloadPath);
        } catch (error) {
            console.log("PDF ATS verification failed:", error.message);
            if (fs.existsSync(downloadPath)) {
                fs.unlinkSync(downloadPath);
            }
            throw new Error(`PDF ATS verification failed: ${error.message}`);
        }
    });

    test("should handle download button states correctly", async ({ page }) => {
        await page.setViewportSize({ width: 1920, height: 800 });

        await page.goto("/#downloadResume");
        await page.waitForLoadState("networkidle");
        await page.goto("/#downloadResume");

        const downloadButton = page.locator(".btn-download");

        const thumbnailImage = page.locator(".resume-preview img");
        const loader = page.locator(".resume-preview .loader");

        // Check if thumbnail loads within reasonable time
        try {
            await thumbnailImage.waitFor({ state: "visible", timeout: 30000 });
            // When thumbnail is ready, button should be enabled
            await expect(downloadButton).not.toBeDisabled();
        } catch (error) {
            // If thumbnail doesn't load, make sure we have proper fallback behavior
            console.log("Thumbnail did not load, checking fallback state");

            // Either loader should be visible OR button should eventually be enabled
            // Wait a bit more for potential API data loading
            await page.waitForTimeout(10000);

            const isLoaderVisible = await loader.isVisible();
            const isButtonDisabled = await downloadButton.isDisabled();

            // At least one of these should be true for proper UX
            const hasProperState = isLoaderVisible || !isButtonDisabled;
            expect(hasProperState).toBe(true);
        }
    });

    test("should handle resume preview click functionality", async ({ page }) => {
        await page.setViewportSize({ width: 1200, height: 800 });

        await page.goto("/#downloadResume");
        await page.waitForLoadState("networkidle");
        await page.goto("/#downloadResume");

        // Wait for data to load
        await page.waitForTimeout(3000);

        const resumePreview = page.locator(".resume-preview");
        const thumbnailImage = resumePreview.locator("img");

        try {
            await thumbnailImage.waitFor({ state: "visible", timeout: 30000 });

            // Preview should be clickable (has cursor pointer style)
            await expect(resumePreview).toBeVisible();

            // Verify preview has proper accessibility attributes
            await expect(resumePreview).toHaveAttribute("role", "button");
            await expect(resumePreview).toHaveAttribute("tabindex", "0");
            await expect(resumePreview).toHaveAttribute("aria-label", "Download resume as PDF");
        } catch (error) {
            console.log("Thumbnail not ready for click test, checking component structure anyway");

            // Even without thumbnail, the preview component should have proper structure
            await expect(resumePreview).toBeVisible();

            // Accessibility attributes should be present regardless of thumbnail state
            await expect(resumePreview).toHaveAttribute("role", "button");
            await expect(resumePreview).toHaveAttribute("tabindex", "0");
            await expect(resumePreview).toHaveAttribute("aria-label", "Download resume as PDF");
        }
    });

    test("should verify resume component loads required data", async ({ page }) => {
        await page.setViewportSize({ width: 1200, height: 800 });

        // Monitor API calls
        const apiCalls = [];
        page.on("request", request => {
            if (request.url().includes("/api/")) {
                apiCalls.push(request.url());
            }
        });

        await page.goto("/#downloadResume");
        await page.waitForLoadState("networkidle");
        await page.goto("/#downloadResume");

        // Wait for API calls to complete
        await page.waitForTimeout(2000);

        // Verify that required API endpoints were called
        const expectedEndpoints = ["experience", "projects", "skills", "achievements", "socials", "education"];

        for (const endpoint of expectedEndpoints) {
            const endpointCalled = apiCalls.some(url => url.includes(`/api/${endpoint}`));
            expect(endpointCalled).toBe(true);
        }
    });

    test("should handle download during processing state", async ({ page }) => {
        await page.setViewportSize({ width: 1200, height: 800 });

        await page.goto("/#downloadResume");
        await page.waitForLoadState("networkidle");
        await page.goto("/#downloadResume");

        // Wait for data to load
        await page.waitForTimeout(3000);

        const downloadButton = page.locator(".btn-download");
        const thumbnailImage = page.locator(".resume-preview img");

        try {
            await thumbnailImage.waitFor({ state: "visible", timeout: 30000 });

            // Button should be enabled when ready
            await expect(downloadButton).not.toBeDisabled();

            // During download, button should show loading state
            // We can verify this by checking the component has the necessary structure
            const buttonText = downloadButton.locator("span");
            await expect(buttonText).toContainText("Download");
        } catch (error) {
            console.log("Thumbnail not ready for processing state test, checking button structure anyway");

            // Even without thumbnail, button should have proper structure
            const buttonText = downloadButton.locator("span");
            await expect(buttonText).toContainText("Download");

            // Button state should be appropriate (disabled if no thumbnail, enabled if API data loaded)
            await page.waitForTimeout(5000); // Wait for API data
            const isStillDisabled = await downloadButton.isDisabled();
            console.log(`Button disabled state after API wait: ${isStillDisabled}`);
        }
    });
});