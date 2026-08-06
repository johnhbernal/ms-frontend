import { test, expect } from '@playwright/test';

async function isAuthUp() {
  try {
    const res = await fetch('http://localhost:8081/actuator/health');
    return !!res?.ok;
  } catch {
    return false;
  }
}

async function login(page, username, password) {
  await page.goto('/login');
  await page.locator('#username').fill(username);
  await page.locator('#password').fill(password);
  await page.getByRole('button', { name: /Entrar|Sign in|Iniciar sesión|Ingresar/i }).click();
  await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 20_000 });
}

async function sessionToken(page) {
  return page.evaluate(() => sessionStorage.getItem('token'));
}

test.describe('Module AuthZ (RBAC)', () => {
  test.beforeEach(async () => {
    test.skip(!(await isAuthUp()), 'ms-auth not running on :8081');
  });

  test('admin sees Administration and Permissions create form', async ({ page }) => {
    await login(page, 'admin', 'Admin123!');
    await expect(page.getByText(/Signed in: admin|Sesión: admin/i)).toBeVisible({ timeout: 20_000 });

    const adminNav = page.getByRole('button', { name: /Administration|Administración/i });
    await expect(adminNav).toBeVisible();
    await adminNav.click();
    await expect(page.getByRole('heading', { name: /RBAC administration|Administración RBAC/i })).toBeVisible();

    await page.getByRole('tab', { name: /Permissions|Permisos/i }).click();
    await expect(page.getByRole('heading', { name: /Create module permission|Crear permiso/i })).toBeVisible();
    await expect(page.locator('code').filter({ hasText: 'INVENTARIO_PRECIO_READ' })).toBeVisible({ timeout: 10_000 });
  });

  test('seller inventory UI DENY + API PUT returns 403', async ({ page, request }) => {
    await login(page, 'seller', 'Seller123!');
    await expect(page.getByText(/Signed in: seller|Sesión: seller/i)).toBeVisible({ timeout: 20_000 });

    await page.getByRole('button', { name: /^Inventory$|^Inventario$/i }).click();
    await expect(page.getByRole('heading', { name: /Inventory \(AuthZ|Inventario \(demo/i })).toBeVisible({ timeout: 15_000 });

    const priceDeny = page.locator('.badge.bg-danger').filter({ hasText: /INVENTARIO_PRECIO_WRITE/ });
    const stockDeny = page.locator('.badge.bg-danger').filter({ hasText: /INVENTARIO_STOCK_WRITE/ });
    await expect(priceDeny).toBeVisible();
    await expect(stockDeny).toBeVisible();
    await expect(priceDeny).toContainText(/DENY|DENEGADO/i);
    await expect(page.getByRole('button', { name: /Save price|Guardar precio/i }).first()).toBeDisabled();
    await expect(page.getByRole('button', { name: /Save stock|Guardar stock/i }).first()).toBeDisabled();
    await expect(page.getByRole('button', { name: /Administration|Administración/i })).toHaveCount(0);

    const token = await sessionToken(page);
    expect(token).toBeTruthy();
    const authBase = process.env.VITE_AUTH_API_URL || 'http://localhost:8081';
    const price = await request.put(`${authBase}/api/demo/inventario/productos/precio`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      data: { sku: 'SKU-001', price: 1 },
    });
    expect(price.status(), 'seller price write must be 403').toBe(403);
    const stock = await request.put(`${authBase}/api/demo/inventario/productos/stock`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      data: { sku: 'SKU-001', quantity: 1 },
    });
    expect(stock.status(), 'seller stock write must be 403').toBe(403);
  });
});
