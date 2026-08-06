import { test, expect } from '@playwright/test';

test.describe('Login page UX', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('shows title, credentials fields, and login button', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Iniciar sesión' })).toBeVisible();
    await expect(page.locator('#username')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.getByLabel('Usuario')).toBeVisible();
    await expect(page.getByLabel('Contraseña')).toBeVisible();
    await expect(page.getByRole('button', { name: /Ingresar|Iniciar sesión/i })).toBeVisible();
  });
});
