import { test, expect } from "@playwright/test";

test.describe("Achievements Section", () => {
    test("should display achievements section and load content", async ({ page }) => {
        // Set desktop viewport to ensure we see the main content
        await page.setViewportSize({ width: 1200, height: 800 });

        await page.goto("/");
        await page.waitForLoadState("networkidle");

        // Check if we're on mobile (fallback) or desktop
        const mobileHeader = page.locator("text=PLEASE SWITCH TO A DESKTOP");
        const isShowingMobileFallback = await mobileHeader.isVisible();

        if (isShowingMobileFallback) {
            // Skip achievements tests on mobile fallback
            test.skip();
            return;
        }

        // Navigate to achievements section
        await page.goto("/#achievements");
        await page.waitForLoadState("networkidle");

        // Wait for the achievements section to be visible
        const achievementsSection = page.locator("#achievements");
        await expect(achievementsSection).toBeVisible();

        // Check for main heading
        await expect(page.locator("h1", { hasText: "Achievements & Certificates" })).toBeVisible();

        // Wait for achievements data to load
        await page.waitForTimeout(2000);

        // Check that achievements listings are present
        const achievementListings = page.locator(".listing");
        await expect(achievementListings.first()).toBeVisible();
    });

    test("should display achievement listings with correct content", async ({ page }) => {
        await page.setViewportSize({ width: 1200, height: 800 });

        await page.goto("/#achievements");
        await page.waitForLoadState("networkidle");

        // Skip on mobile fallback
        const mobileHeader = page.locator("text=PLEASE SWITCH TO A DESKTOP");
        if (await mobileHeader.isVisible()) {
            test.skip();
            return;
        }

        // Wait for achievements to load
        await page.waitForTimeout(2000);

        // Check that we have achievement listings
        const listings = page.locator(".listing");
        const listingCount = await listings.count();
        expect(listingCount).toBeGreaterThan(0);

        // Check first listing has required elements
        const firstListing = listings.first();
        await expect(firstListing).toBeVisible();

        // Check for title with emoji (🏆 for Achievement or 📜 for Certificate)
        const titleElement = firstListing.locator(".title");
        await expect(titleElement).toBeVisible();
        
        const titleText = await titleElement.textContent();
        expect(titleText).toMatch(/[🏆📜]/);

        // Check for organization details
        const fromSection = firstListing.locator(".from");
        await expect(fromSection).toBeVisible();

        // Check for organization icon
        const orgIcon = fromSection.locator(".icon");
        await expect(orgIcon).toBeVisible();

        // Check for organization name
        const orgName = fromSection.locator("span");
        await expect(orgName).toBeVisible();
    });

    test("should handle achievement types correctly", async ({ page }) => {
        await page.setViewportSize({ width: 1200, height: 800 });

        await page.goto("/#achievements");
        await page.waitForLoadState("networkidle");

        // Skip on mobile fallback
        const mobileHeader = page.locator("text=PLEASE SWITCH TO A DESKTOP");
        if (await mobileHeader.isVisible()) {
            test.skip();
            return;
        }

        // Wait for achievements to load
        await page.waitForTimeout(2000);

        const listings = page.locator(".listing");
        const listingCount = await listings.count();

        if (listingCount > 0) {
            // Check each listing for proper emoji usage
            for (let i = 0; i < Math.min(listingCount, 5); i++) {
                const listing = listings.nth(i);
                const title = listing.locator(".title");
                const titleText = await title.textContent();
                
                // Should have either achievement trophy or certificate scroll emoji
                expect(titleText).toMatch(/^[🏆📜]/);
                
                // Title should contain actual text after emoji
                const textAfterEmoji = titleText.replace(/^[🏆📜]\s*/, '');
                expect(textAfterEmoji.length).toBeGreaterThan(0);
            }
        }
    });

    test("should display images and handle image interactions", async ({ page }) => {
        await page.setViewportSize({ width: 1200, height: 800 });

        await page.goto("/#achievements");
        await page.waitForLoadState("networkidle");

        // Skip on mobile fallback
        const mobileHeader = page.locator("text=PLEASE SWITCH TO A DESKTOP");
        if (await mobileHeader.isVisible()) {
            test.skip();
            return;
        }

        // Wait for achievements to load
        await page.waitForTimeout(2000);

        const listings = page.locator(".listing");
        const listingCount = await listings.count();

        if (listingCount > 0) {
            const firstListing = listings.first();
            
            // Check if listing has an image or fallback
            const assetHolder = firstListing.locator(".assetHolder");
            const fallback = firstListing.locator(".fallback");
            
            const hasImage = await assetHolder.isVisible();
            const hasFallback = await fallback.isVisible();
            
            // Should have either an image or fallback, but not both
            expect(hasImage || hasFallback).toBe(true);
            expect(hasImage && hasFallback).toBe(false);

            if (hasImage) {
                // Check if image is zoomable
                const imageButton = firstListing.locator(".image-button");
                const asset = firstListing.locator(".asset");
                
                await expect(asset).toBeVisible();
                
                // Test zoom functionality if button exists
                if (await imageButton.isVisible()) {
                    // Click to zoom
                    await imageButton.click();
                    
                    // Wait for zoom animation
                    await page.waitForTimeout(1000);
                    
                    // Check if backdrop appears (indicating zoom is active)
                    const backdrop = page.locator(".backdrop");
                    await expect(backdrop).toBeVisible();
                    
                    // Click outside to close zoom
                    await backdrop.click();
                    
                    // Wait for zoom to close
                    await page.waitForTimeout(500);
                }
            } else if (hasFallback) {
                // Check fallback message
                await expect(fallback.locator("span")).toContainText("No Image for this one");
            }
        }
    });

    test("should display year information correctly", async ({ page }) => {
        await page.setViewportSize({ width: 1200, height: 800 });

        await page.goto("/#achievements");
        await page.waitForLoadState("networkidle");

        // Skip on mobile fallback
        const mobileHeader = page.locator("text=PLEASE SWITCH TO A DESKTOP");
        if (await mobileHeader.isVisible()) {
            test.skip();
            return;
        }

        // Wait for achievements to load
        await page.waitForTimeout(2000);

        const listings = page.locator(".listing");
        const listingCount = await listings.count();

        if (listingCount > 0) {
            const firstListing = listings.first();
            
            // Check that listing has data-year attribute
            const dataYear = await firstListing.getAttribute("data-year");
            expect(dataYear).toBeTruthy();
            expect(dataYear).toMatch(/^\d{4}$/); // Should be a 4-digit year
            
            // Check that mobile year element exists (even if hidden on desktop)
            const mobileYear = firstListing.locator(".mobile-only");
            await expect(mobileYear).toBeAttached();
            
            // Verify the mobile year has the same value as data-year
            const mobileYearText = await mobileYear.textContent();
            expect(mobileYearText).toBe(dataYear);
        }
    });

    test("should handle API data loading for achievements", async ({ page }) => {
        // Intercept achievements API call
        let achievementsApiCalled = false;
        
        page.route("/api/achievements", route => {
            achievementsApiCalled = true;
            route.continue();
        });

        await page.setViewportSize({ width: 1200, height: 800 });
        
        await page.goto("/#achievements");
        await page.waitForLoadState("networkidle");

        // Skip on mobile fallback
        const mobileHeader = page.locator("text=PLEASE SWITCH TO A DESKTOP");
        if (await mobileHeader.isVisible()) {
            test.skip();
            return;
        }

        // Wait for API calls to complete
        await page.waitForTimeout(2000);

        // Verify that achievements API was called
        expect(achievementsApiCalled).toBe(true);

        // Verify that content loaded successfully
        const listings = page.locator(".listing");
        await expect(listings.first()).toBeVisible();
    });

    test("should handle timeline display on desktop", async ({ page }) => {
        await page.setViewportSize({ width: 1200, height: 800 });

        await page.goto("/#achievements");
        await page.waitForLoadState("networkidle");

        // Skip on mobile fallback
        const mobileHeader = page.locator("text=PLEASE SWITCH TO A DESKTOP");
        if (await mobileHeader.isVisible()) {
            test.skip();
            return;
        }

        // Wait for achievements to load
        await page.waitForTimeout(2000);

        // Check that the achievements timeline container has proper structure
        const achievementsSection = page.locator("#achievements");
        const contentsDiv = achievementsSection.locator(".contents");
        await expect(contentsDiv).toBeVisible();
        
        // Timeline should show multiple achievements in sequence
        const listings = page.locator(".listing");
        const listingCount = await listings.count();
        
        if (listingCount > 1) {
            // Check that listings are positioned correctly for timeline
            const firstListing = listings.first();
            const secondListing = listings.nth(1);
            
            await expect(firstListing).toBeVisible();
            await expect(secondListing).toBeVisible();
            
            // Each listing should have data-year for timeline positioning
            const firstYear = await firstListing.getAttribute("data-year");
            const secondYear = await secondListing.getAttribute("data-year");
            
            expect(firstYear).toBeTruthy();
            expect(secondYear).toBeTruthy();
        }
    });

    test("should be accessible and have proper ARIA attributes", async ({ page }) => {
        await page.setViewportSize({ width: 1200, height: 800 });

        await page.goto("/#achievements");
        await page.waitForLoadState("networkidle");

        // Skip on mobile fallback
        const mobileHeader = page.locator("text=PLEASE SWITCH TO A DESKTOP");
        if (await mobileHeader.isVisible()) {
            test.skip();
            return;
        }

        // Wait for achievements to load
        await page.waitForTimeout(2000);

        // Check main heading structure
        const mainHeading = page.locator("h1", { hasText: "Achievements & Certificates" });
        await expect(mainHeading).toBeVisible();

        const listings = page.locator(".listing");
        const listingCount = await listings.count();

        if (listingCount > 0) {
            const firstListing = listings.first();
            
            // Check for proper heading structure in listings
            const listingTitle = firstListing.locator(".title");
            await expect(listingTitle).toBeVisible();
            
            // Check images have proper alt text
            const images = firstListing.locator(".asset");
            if (await images.count() > 0) {
                const altText = await images.first().getAttribute("alt");
                expect(altText).toBeTruthy();
                expect(altText.length).toBeGreaterThan(0);
            }
            
            // Check organization icons have proper alt text
            const orgIcon = firstListing.locator(".icon");
            if (await orgIcon.isVisible()) {
                const iconAlt = await orgIcon.getAttribute("alt");
                expect(iconAlt).toBeTruthy();
                expect(iconAlt.length).toBeGreaterThan(0);
            }
            
            // Check zoomable buttons have proper title
            const zoomButtons = firstListing.locator(".image-button");
            if (await zoomButtons.count() > 0) {
                const buttonTitle = await zoomButtons.first().getAttribute("title");
                expect(buttonTitle).toBe("Click to zoom");
            }
        }
    });
});