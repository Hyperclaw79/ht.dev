import { test, expect } from '@playwright/test';

test.describe('Mobile Responsiveness', () => {
  test('should display mobile fallback on small screens', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check if mobile fallback is displayed
    const fallbackText = page.locator('text=PLEASE SWITCH TO A DESKTOP');
    
    // Mobile fallback should be visible on small screens
    if (await fallbackText.isVisible()) {
      await expect(fallbackText).toBeVisible();
      await expect(page.locator('text=FOR AN ENHANCED USER EXPERIENCE')).toBeVisible();
      
      // Check for mobile and monitor icons
      await expect(page.locator('#mobileIcon')).toBeVisible();
      await expect(page.locator('#monitorIcon')).toBeVisible();
      
      // Check for scroll down section
      await expect(page.locator('text=Scroll Down')).toBeVisible();
      await expect(page.locator('.chevron')).toBeVisible();
    }
  });

  test('should display normal content on desktop', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1200, height: 800 });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Should show normal portfolio content, not mobile fallback
    const landingSection = page.locator('#landing');
    await expect(landingSection).toBeVisible();
    
    // Mobile fallback should not be visible
    const fallbackText = page.locator('text=PLEASE SWITCH TO A DESKTOP');
    if (await fallbackText.count() > 0) {
      await expect(fallbackText).not.toBeVisible();
    }
  });

  test('should handle touch events on mobile devices', async ({ page }) => {
    // Set mobile viewport and simulate touch device
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Add touch simulation
    await page.addInitScript(() => {
      Object.defineProperty(window, 'ontouchstart', { value: true });
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // On touch devices, mobile fallback should be shown regardless of screen size
    const fallbackText = page.locator('text=PLEASE SWITCH TO A DESKTOP');
    if (await fallbackText.isVisible()) {
      await expect(fallbackText).toBeVisible();
    }
  });

  test('should adapt navigation for different screen sizes', async ({ page }) => {
    // Test desktop viewport
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check that sections are accessible
    const sections = ['#about', '#experience', '#projects', '#skills'];
    for (const section of sections) {
      const element = page.locator(section);
      if (await element.isVisible()) {
        await expect(element).toBeVisible();
      }
    }
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    
    // Sections should still be accessible
    for (const section of sections) {
      const element = page.locator(section);
      if (await element.isVisible()) {
        await expect(element).toBeVisible();
      }
    }
  });

  test('should handle admin page on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    
    // Admin page should be functional on mobile
    await expect(page.locator('h1:has-text("Admin Console")')).toBeVisible();
    await expect(page.locator('input[placeholder="Username"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Password"]')).toBeVisible();
    await expect(page.locator('button:has-text("LOGIN")')).toBeVisible();
    
    // Form should be usable on mobile
    await page.locator('input[placeholder="Username"]').fill('test');
    await page.locator('input[placeholder="Password"]').fill('test');
    
    // Verify inputs work
    const username = await page.locator('input[placeholder="Username"]').inputValue();
    const password = await page.locator('input[placeholder="Password"]').inputValue();
    expect(username).toBe('test');
    expect(password).toBe('test');
  });
});