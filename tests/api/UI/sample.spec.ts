import { test, expect } from '@playwright/test';

test('homepage should load and display the correct title', async ({ page }) => {
  await page.goto('https://stag-cicd.netlify.app');
  // Change the selector/text below to something you expect on your homepage
  await expect(page).toHaveTitle(/bloom-craft-automations-lab/);
});

test('navigation should work correctly', async ({ page }) => {
  await page.goto('https://stag-cicd.netlify.app');
  
  // Test Plants navigation
  await page.click('[data-testid="nav-plants"]');
  await expect(page.locator('#featured-products')).toBeVisible();
  
  // Test Categories navigation
  await page.click('[data-testid="nav-crafts"]');
  await expect(page.locator('#categories')).toBeVisible();
});

test('product images should load correctly', async ({ page }) => {
  await page.goto('https://stag-cicd.netlify.app');
  
  // Wait for products to load
  await page.waitForSelector('[data-testid="products-grid"]');
  
  // Check if product images are loaded
  const productImages = page.locator('[data-testid="product-image"]');
  const count = await productImages.count();
  
  for (let i = 0; i < count; i++) {
    const img = productImages.nth(i);
    await expect(img).toBeVisible();
    // Check if image has loaded (not broken)
    const naturalWidth = await img.evaluate((img: HTMLImageElement) => img.naturalWidth);
    expect(naturalWidth).toBeGreaterThan(0);
  }
}); 