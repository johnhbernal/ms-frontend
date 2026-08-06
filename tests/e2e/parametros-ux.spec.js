const { test, expect } = require('@playwright/test');

async function authUp() {
  try {
    const probe = await fetch('http://localhost:8081/api/auth/validate').catch((e) => e);
    return probe && typeof probe.status === 'number';
  } catch {
    return false;
  }
}

test.describe('Parámetros UX', () => {
  test('search padding, paginator and export controls', async ({ page }) => {
    test.skip(!(await authUp()), 'ms-auth not running');

    await page.goto('/login');
    await page.locator('#username').fill('admin');
    await page.locator('#password').fill('Admin123!');
    await page.getByRole('button', { name: /Ingresar|Iniciar sesión/i }).click();
    await expect(page.getByText('Parámetros del Sistema')).toBeVisible({ timeout: 15_000 });

    const search = page.locator('#parametros-search');
    await expect(search).toBeVisible();
    const padLeft = await search.evaluate((el) => parseFloat(getComputedStyle(el).paddingLeft));
    expect(padLeft).toBeGreaterThanOrEqual(40);

    await expect(page.getByTestId('export-csv')).toBeVisible();
    await expect(page.getByTestId('export-excel')).toBeVisible();
    await expect(page.getByTestId('parametros-paginator')).toBeVisible();
    await expect(page.getByTestId('page-size')).toBeVisible();
    await expect(page.getByTestId('page-prev')).toBeVisible();
    await expect(page.getByTestId('page-next')).toBeVisible();

    await page.screenshot({ path: 'test-results/parametros-ux.png', fullPage: true });
  });
});
