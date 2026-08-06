import { describe, it, expect, beforeEach } from 'vitest';
import { decodeJwtPayload, isAdminNavVisible, saveToken } from '../services/authService';

function b64url(obj) {
  return btoa(JSON.stringify(obj)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fakeJwt(payload) {
  return `hdr.${b64url(payload)}.sig`;
}

describe('isAdminNavVisible', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('returns true for ADMIN role', () => {
    saveToken(fakeJwt({ role: 'ADMIN', exp: Math.floor(Date.now() / 1000) + 3600 }));
    expect(isAdminNavVisible()).toBe(true);
  });

  it('returns true for GROUP_ADMIN permission', () => {
    saveToken(fakeJwt({ role: 'USER', permissions: ['GROUP_ADMIN'], exp: Math.floor(Date.now() / 1000) + 3600 }));
    expect(isAdminNavVisible()).toBe(true);
  });

  it('returns false for regular user', () => {
    saveToken(fakeJwt({ role: 'USER', permissions: ['PARAMETRO_READ'], exp: Math.floor(Date.now() / 1000) + 3600 }));
    expect(isAdminNavVisible()).toBe(false);
  });
});

describe('decodeJwtPayload', () => {
  it('parses payload', () => {
    const payload = { sub: 'admin', role: 'ADMIN' };
    expect(decodeJwtPayload(fakeJwt(payload))).toMatchObject(payload);
  });
});
