import { beforeEach, describe, expect, it } from 'vitest';
import {
  canSeeInventory,
  hasPermission,
  isAdminNavVisible,
  saveToken,
} from './authService';

function jwtWith(payload) {
  const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  return `${header}.${body}.sig`;
}

describe('AuthZ helpers (JWT claims)', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('ADMIN has every permission and sees inventory + admin nav', () => {
    saveToken(jwtWith({
      sub: 'admin',
      role: 'ADMIN',
      roles: ['ADMIN'],
      permissions: [],
      exp: Math.floor(Date.now() / 1000) + 3600,
    }));
    expect(hasPermission('INVENTARIO_PRECIO_WRITE')).toBe(true);
    expect(canSeeInventory()).toBe(true);
    expect(isAdminNavVisible()).toBe(true);
  });

  it('seller with PRECIO_READ sees inventory but not write permission', () => {
    saveToken(jwtWith({
      sub: 'seller',
      role: 'VENDEDOR',
      roles: ['VENDEDOR'],
      permissions: ['INVENTARIO_PRECIO_READ'],
      exp: Math.floor(Date.now() / 1000) + 3600,
    }));
    expect(hasPermission('INVENTARIO_PRECIO_READ')).toBe(true);
    expect(hasPermission('INVENTARIO_PRECIO_WRITE')).toBe(false);
    expect(canSeeInventory()).toBe(true);
    expect(isAdminNavVisible()).toBe(false);
  });

  it('user without inventory permission cannot see inventory', () => {
    saveToken(jwtWith({
      sub: 'user',
      role: 'USER',
      roles: ['USER'],
      permissions: [],
      exp: Math.floor(Date.now() / 1000) + 3600,
    }));
    expect(canSeeInventory()).toBe(false);
    expect(hasPermission('INVENTARIO_PRECIO_READ')).toBe(false);
  });
});
