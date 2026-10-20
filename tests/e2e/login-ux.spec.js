import { test, expect } from '@playwright/test';

test.describe('Login page UX', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('shows title, credentials fields, and login button', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Iniciar sesión' })).toBeVisible();
    await expect(page.locator('#username')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Usuario' })).toBeVisible();
    // The password field and its show/hide toggle share the label "Contraseña":
    // a bare getByLabel() resolves to both and Playwright fails in strict mode.
    await expect(page.getByRole('textbox', { name: 'Contraseña' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Contraseña' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Entrar' })).toBeVisible();
  });
});
