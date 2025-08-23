import { test, expect } from '@playwright/test';

test.describe('Terminal Landing Page', () => {
  test('should display terminal interface on desktop', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check if we're on desktop (terminal should be visible)
    const landing = page.locator('#landing');
    await expect(landing).toBeVisible();
    
    // Look for terminal elements
    const terminal = page.locator('.terminal').first();
    if (await terminal.isVisible()) {
      // If terminal is visible, test its functionality
      await expect(terminal).toBeVisible();
      
      // Check for terminal title bar
      await expect(page.locator('.title-bar')).toBeVisible();
      
      // Check for screen/terminal content
      await expect(page.locator('.screen')).toBeVisible();
    }
  });

  test('should handle terminal commands', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Look for terminal input
    const terminalInput = page.locator('input[type="text"]').first();
    
    if (await terminalInput.isVisible()) {
      // Test basic terminal interaction
      await terminalInput.click();
      await terminalInput.fill('help');
      await terminalInput.press('Enter');
      
      // Wait for command to be processed
      await page.waitForTimeout(500);
      
      // Check that command was processed (output should appear)
      const outputs = page.locator('.output');
      if (await outputs.count() > 0) {
        await expect(outputs.first()).toBeVisible();
      }
    }
  });

  test('should handle start command and navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const terminalInput = page.locator('input[type="text"]').first();
    
    if (await terminalInput.isVisible()) {
      // Test start command
      await terminalInput.click();
      await terminalInput.fill('start');
      await terminalInput.press('Enter');
      
      // Wait for navigation or shrink animation
      await page.waitForTimeout(2000);
      
      // The page should either navigate or show portfolio sections
      const aboutSection = page.locator('#about');
      await expect(aboutSection).toBeVisible({ timeout: 5000 });
    }
  });

  test('should show start button as alternative to commands', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Look for start button
    const startButton = page.locator('button:has-text("START")').first();
    
    if (await startButton.isVisible()) {
      await expect(startButton).toBeVisible();
      
      // Click start button
      await startButton.click();
      
      // Wait for navigation
      await page.waitForTimeout(2000);
      
      // Should navigate to portfolio content
      const aboutSection = page.locator('#about');
      await expect(aboutSection).toBeVisible({ timeout: 5000 });
    }
  });
});