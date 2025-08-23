import { test, expect } from "@playwright/test";

test.describe("Basic E2E Setup Test", () => {
    test("should verify E2E test setup works", async ({ page }) => {
    // Simple test to verify the setup is working
        await page.goto("/");

        // Check that the page loads and has the correct title
        await expect(page).toHaveTitle("Harshith Thota's Developer Portfolio");

        // Basic smoke test
        await page.waitForLoadState("networkidle");

        // The page should load without errors
        const errors = [];
        page.on("pageerror", error => errors.push(error));

        // Wait a bit to see if there are any immediate errors
        await page.waitForTimeout(1000);

        // No JavaScript errors should occur during basic page load
        expect(errors.length).toBe(0);
    });
});
