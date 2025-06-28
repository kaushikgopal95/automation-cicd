import { test, expect } from '@playwright/test';

test('homepage should load and display the correct title', async ({ page }) => {
  await page.goto('stag-cicd.netlify.app');
  // Change the selector/text below to something you expect on your homepage
  await expect(page).toHaveTitle("bloom-craft-automations-lab);
}); 