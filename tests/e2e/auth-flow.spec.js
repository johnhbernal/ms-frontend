const { test, expect } = require('@playwright/test');

async function isAuthUp() {
  try {
    const res = await fetch('http://localhost:8081/actuator/health').catch(() => null);
    if (res && res.ok) return true;
    // Fallback: any response from auth host means the process is listening
    const probe = await fetch('http://localhost:8081/api/auth/validate', {
      method: 'GET',
    }).catch((err) => err);
    if (probe && typeof probe.status === 'number') return true;
    return false;
  } catch {
    return false;
  }
}

test.describe('Auth flow', () => {
  test('admin login reaches Parámetros', async ({ page }) => {
    test.skip(!(await isAuthUp()), 'ms-auth not running on http://localhost:8081');

    await page.goto('/login');
    await page.locator('#username').fill('admin');
    await page.locator('#password').fill('Admin123!');
    await page.getByRole('button', { name: /Ingresar|Iniciar sesión/i }).click();

    await expect(page.getByText('Parámetros').first()).toBeVisible({ timeout: 15_000 });
  });
});
