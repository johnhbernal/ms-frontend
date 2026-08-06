const { test, expect } = require('@playwright/test');

test.describe('Visual smoke', () => {
  test('login page screenshot', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: 'Iniciar sesión' })).toBeVisible();
    await expect(page).toHaveScreenshot('login-page.png', {
      maxDiffPixelRatio: 0.02,
    });
  });
});
