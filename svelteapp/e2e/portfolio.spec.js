import { test, expect } from "@playwright/test";

test.describe("Portfolio Main Page", () => {
    test("should load the main page and display key sections", async ({ page }) => {
        await page.goto("/");

        // Check that the page loads
        await expect(page).toHaveTitle("Harshith Thota's Developer Portfolio");

        // Wait for the page to be fully loaded
        await page.waitForLoadState("networkidle");

        // Check if we're on mobile (fallback) or desktop
        const mobileHeader = page.locator("text=PLEASE SWITCH TO A DESKTOP");
        const isShowingMobileFallback = await mobileHeader.isVisible();

        if (isShowingMobileFallback) {
            // On mobile, verify mobile fallback is shown
            await expect(mobileHeader).toBeVisible();
            await expect(page.locator("text=FOR AN ENHANCED USER EXPERIENCE")).toBeVisible();
        } else {
            // On desktop, check for main sections
            await expect(page.locator("#landing")).toBeVisible();
            await expect(page.locator("#about")).toBeVisible();
            await expect(page.locator("#experience")).toBeVisible();
            await expect(page.locator("#projects")).toBeVisible();
            await expect(page.locator("#skills")).toBeVisible();
            await expect(page.locator("#achievements")).toBeVisible();
            await expect(page.locator("#downloadResume")).toBeVisible();
        }
    });

    test("should navigate between sections", async ({ page }) => {
        await page.goto("/");
        await page.waitForLoadState("networkidle");

        // Test navigation to different sections
        const sections = ["#about", "#experience", "#projects", "#skills", "#achievements"];

        for (const section of sections) {
            await page.goto(`/${section}`);
            await expect(page.locator(section)).toBeVisible();
        }
    });

    test("should display footer with social links", async ({ page }) => {
        await page.goto("/");
        await page.waitForLoadState("networkidle");

        // Scroll to footer
        await page.locator("footer").scrollIntoViewIfNeeded();
        await expect(page.locator("footer")).toBeVisible();
        // Test if the Footer buttons actually have valid URLs
        const footerLinks = page.locator("footer a");
        const count = await footerLinks.count();
        for (let i = 0; i < count; i++) {
            const link = footerLinks.nth(i);
            const href = await link.getAttribute("href");
            expect(href).toBeTruthy();
        }
    });

    test("should handle API data loading", async ({ page }) => {
    // Intercept API calls to ensure they're made
        const apiEndpoints = ["achievements", "experience", "projects", "skills", "socials"];
        const interceptedCalls = [];

        for (const endpoint of apiEndpoints) {
            page.route(`/api/${endpoint}`, route => {
                interceptedCalls.push(endpoint);
                route.continue();
            });
        }

        await page.goto("/");
        await page.waitForLoadState("networkidle");

        // Give some time for API calls to complete
        await page.waitForTimeout(1000);

        // Verify that API calls were made
        expect(interceptedCalls.length).toBeGreaterThan(0);
    });
});
