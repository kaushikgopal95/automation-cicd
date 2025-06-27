import { test, expect } from '@playwright/test';

test('homepage should load and display the correct title', async ({ page }) => {
  await page.goto('http://localhost:5173');
  // Change the selector/text below to something you expect on your homepage
  await expect(page).toHaveTitle(/vite|react|automation/i);
}); 