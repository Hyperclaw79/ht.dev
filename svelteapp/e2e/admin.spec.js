import { test, expect } from '@playwright/test';

test.describe('Admin Login Page', () => {
  test('should display admin login form', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    
    // Wait for the main heading to be visible before proceeding
    await page.waitForSelector('h1', { timeout: 10000 });
    
    // Check page title and heading
    await expect(page).toHaveTitle("Harshith Thota's Developer Portfolio");
    await expect(page.locator('h1:has-text("Admin Console")')).toBeVisible();
    
    // Wait for form to be visible
    await page.waitForSelector('form.login-form', { timeout: 10000 });
    
    // Check for login form elements
    await expect(page.locator('input[placeholder="Username"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Password"]')).toBeVisible();
    await expect(page.locator('button:has-text("LOGIN")')).toBeVisible();
  });

  test('should handle invalid login credentials', async ({ page }) => {
    // Mock the API response for invalid credentials
    await page.route('/api/admin', route => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Invalid Credentials' })
      });
    });

    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    
    // Wait for form to be ready
    await page.waitForSelector('form.login-form', { timeout: 10000 });
    
    // Fill invalid credentials
    await page.locator('input[placeholder="Username"]').fill('invalid');
    await page.locator('input[placeholder="Password"]').fill('wrong');
    
    // Submit form
    await page.locator('button:has-text("LOGIN")').click();
    
    // Wait for error message with explicit selector wait
    await page.waitForSelector('p.error.show', { timeout: 10000 });
    
    // Check for error message
    const errorMessage = page.locator('p.error.show');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('Invalid Credentials');
  });

  test('should handle successful login and redirect', async ({ page }) => {
    // Mock successful login response
    await page.route('/api/admin', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ redirectUrl: 'https://example.com/dashboard' })
      });
    });

    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    
    // Wait for form to be ready
    await page.waitForSelector('form.login-form', { timeout: 10000 });
    
    // Fill valid credentials
    await page.locator('input[placeholder="Username"]').fill('admin');
    await page.locator('input[placeholder="Password"]').fill('password');
    
    // Check that no error is displayed before submission
    const errorMessage = page.locator('p.error.show');
    await expect(errorMessage).not.toBeVisible();
    
    // Mock location.assign and track redirects - setup BEFORE clicking
    await page.evaluate(() => {
      window._redirectCalled = false;
      window._redirectUrl = null;
      window.originalAssign = location.assign;
      location.assign = (url) => {
        window._redirectCalled = true;
        window._redirectUrl = url;
        // Prevent actual redirect in test
        return Promise.resolve();
      };
    });
    
    // Submit form
    await page.locator('button:has-text("LOGIN")').click();
    
    // Wait for the API call to complete and redirect to be called
    await page.waitForTimeout(3000);
    
    // Verify error message is still not visible (successful login)
    await expect(errorMessage).not.toBeVisible();
    
    // Check that redirect was called
    const redirectCalled = await page.evaluate(() => window._redirectCalled);
    const redirectUrl = await page.evaluate(() => window._redirectUrl);
    
    // Verify redirect was attempted
    expect(redirectCalled).toBe(true);
    expect(redirectUrl).toBe('https://example.com/dashboard');
  });

  test('should validate form inputs', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    
    // Wait for form to be ready
    await page.waitForSelector('form.login-form', { timeout: 10000 });
    
    // Try to submit empty form
    await page.locator('button:has-text("LOGIN")').click();
    
    // Check if form prevents submission or shows validation
    const usernameInput = page.locator('input[placeholder="Username"]');
    const passwordInput = page.locator('input[placeholder="Password"]');
    
    // Basic validation - inputs should still be visible and accessible
    await expect(usernameInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    
    // Fill only username
    await usernameInput.fill('testuser');
    await page.locator('button:has-text("LOGIN")').click();
    
    // Form should still be accessible
    await expect(passwordInput).toBeVisible();
  });
});