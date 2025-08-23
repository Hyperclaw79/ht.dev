import { test, expect } from "@playwright/test";

test.describe("Achievements Section", () => {
    test("should display achievements section with correct content and accessibility", async ({ page }) => {
        await page.goto("/#achievements");
        await page.waitForLoadState("networkidle");
        await page.goto("/#achievements");

        // Wait for achievements to load
        await page.waitForTimeout(2000);

        // Section visible
        const achievementsSection = page.locator("#achievements");
        await expect(achievementsSection).toBeVisible();

        // Main heading
        await expect(page.locator("h1", { hasText: "Achievements & Certificates" })).toBeVisible();

        // Listings present
        const listings = page.locator(".listing");
        const listingCount = await listings.count();
        expect(listingCount).toBeGreaterThan(0);

        // Check first 5 listings for content and accessibility
        for (let i = 0; i < Math.min(listingCount, 5); i++) {
            const listing = listings.nth(i);

            // Title with emoji
            const title = listing.locator(".title");
            await expect(title).toBeVisible();
            const titleText = await title.textContent();
            expect(titleText).toMatch(/^[🏆📜]/u);
            expect(titleText.replace(/^[🏆📜]\s*/u, "").length).toBeGreaterThan(0);

            // Organization details
            const fromSection = listing.locator(".from");
            await expect(fromSection).toBeVisible();
            const orgIcon = fromSection.locator(".icon");
            await expect(orgIcon).toBeVisible();
            const orgName = fromSection.locator("span");
            await expect(orgName).toBeVisible();

            // Year info
            const dataYear = await listing.getAttribute("data-year");
            expect(dataYear).toBeTruthy();
            expect(dataYear).toMatch(/^\d{4}$/);
            const mobileYear = listing.locator(".mobile-only");
            await expect(mobileYear).toBeAttached();
            const mobileYearText = await mobileYear.textContent();
            expect(mobileYearText).toBe(dataYear);

            // Accessibility: image alt, icon alt, zoom button title
            const images = listing.locator(".asset");
            if (await images.count() > 0) {
                const altText = await images.first().getAttribute("alt");
                expect(altText).toBeTruthy();
                expect(altText.length).toBeGreaterThan(0);
            }
            if (await orgIcon.isVisible()) {
                const iconAlt = await orgIcon.getAttribute("alt");
                expect(iconAlt).toBeTruthy();
                expect(iconAlt.length).toBeGreaterThan(0);
            }
            const zoomButtons = listing.locator(".image-button");
            if (await zoomButtons.count() > 0) {
                const buttonTitle = await zoomButtons.first().getAttribute("title");
                expect(buttonTitle).toBe("Click to zoom");
            }
        }
    });

    test("should display images and handle image interactions", async ({ page }) => {
        await page.goto("/#achievements");
        await page.waitForLoadState("networkidle");
        await page.goto("/#achievements");

        await page.waitForTimeout(2000);

        const listings = page.locator(".listing");
        if (await listings.count() > 0) {
            const firstListing = listings.first();
            const assetHolder = firstListing.locator(".assetHolder");
            const fallback = firstListing.locator(".fallback");
            const hasImage = await assetHolder.isVisible();
            const hasFallback = await fallback.isVisible();

            expect(hasImage || hasFallback).toBe(true);
            expect(hasImage && hasFallback).toBe(false);

            if (hasImage) {
                const imageButton = firstListing.locator(".image-button");
                const asset = firstListing.locator(".asset");
                await expect(asset).toBeVisible();
                if (await imageButton.isVisible()) {
                    await imageButton.click();
                    await page.waitForTimeout(1000);
                    const backdrop = page.locator(".backdrop");
                    await expect(backdrop).toBeVisible();
                    await backdrop.click();
                    await page.waitForTimeout(500);
                }
            } else if (hasFallback) {
                await expect(fallback.locator("span")).toContainText("No Image for this one");
            }
        }
    });

    test("should show timeline bar on desktop and hide it on mobile", async ({ page }) => {
        await page.goto("/#achievements");
        await page.waitForLoadState("networkidle");
        await page.goto("/#achievements");
        await page.waitForTimeout(2000);

        const achievementsSection = page.locator("#achievements");
        const contents = achievementsSection.locator(".contents").first();

        const mobileHeader = page.locator("text=PLEASE SWITCH TO A DESKTOP");
        if (!await mobileHeader.isVisible()) {
            // Check if the pseudo-element has width > 0 (visible)
            const desktopTimelineWidth = await contents.evaluate((el) => {
                return window.getComputedStyle(el, "::before").width;
            });
            expect(parseInt(desktopTimelineWidth)).toBeGreaterThan(0);
        } else {
            // Check if the pseudo-element is hidden (width: 0 or display: none)
            const mobileTimelineDisplay = await contents.evaluate((el) => {
                return window.getComputedStyle(el, "::before").display;
            });
            expect(mobileTimelineDisplay).toBe("none");
        }
    });
});
