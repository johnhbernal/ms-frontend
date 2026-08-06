import axios from 'axios';

const BASE_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:8081';

const ADMIN_PERMISSIONS = ['GROUP_ADMIN', 'USER_ADMIN'];

/** Decode JWT payload (base64url → JSON). */
export function decodeJwtPayload(token) {
  const part = token.split('.')[1];
  if (!part) throw new Error('Invalid token');
  const base64 = part.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  return JSON.parse(atob(padded));
}

export const login = async (username, password) => {
  const response = await axios.post(`${BASE_URL}/api/auth/login`, { username, password });
  return response.data;
};

export const saveToken = (token) => {
  sessionStorage.setItem('token', token);
};

export const getToken = () => {
  return sessionStorage.getItem('token');
};

export const getUsername = () => {
  const token = getToken();
  if (!token) return '';
  try {
    const payload = decodeJwtPayload(token);
    return payload.sub || '';
  } catch {
    return '';
  }
};

export const isTokenExpired = () => {
  const token = getToken();
  if (!token) return true;
  try {
    const payload = decodeJwtPayload(token);
    return typeof payload.exp === 'number' && Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
};

export const logout = () => {
  const token = getToken();
  if (token) {
    axios.post(`${BASE_URL}/api/auth/logout`, null, {
      headers: { Authorization: `Bearer ${token}` }
    }).catch((err) => {
      if (import.meta.env.DEV) {
        console.warn('Server-side logout failed (session cleared locally):', err?.message);
      }
    });
  }
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('expiresAtMs');
};

export const saveExpiresAt = (ms) => sessionStorage.setItem('expiresAtMs', String(ms));
export const getExpiresAt  = ()   => {
  const v = sessionStorage.getItem('expiresAtMs');
  return v ? Number(v) : null;
};

export const renewToken = async () => {
  const token = getToken();
  if (!token) throw new Error('No token');
  const response = await axios.post(
    `${BASE_URL}/api/auth/renew`,
    { sessionToken: token }
  );
  return response.data;
};

export const getTokenPayload = () => {
  const token = getToken();
  if (!token) return null;
  try {
    return decodeJwtPayload(token);
  } catch {
    return null;
  }
};

export const getJwtRole = () => getTokenPayload()?.role ?? '';

export const getJwtRoles = () => {
  const payload = getTokenPayload();
  if (!payload) return [];
  if (Array.isArray(payload.roles) && payload.roles.length > 0) return payload.roles;
  return payload.role ? [payload.role] : [];
};

export const getJwtPermissions = () => {
  const payload = getTokenPayload();
  return Array.isArray(payload?.permissions) ? payload.permissions : [];
};

/** JWT stores bare codes (e.g. INVENTARIO_PRECIO_READ); Spring maps them as PERM_*. */
export const hasPermission = (code) => {
  if (getJwtRole() === 'ADMIN') return true;
  return getJwtPermissions().includes(code);
};

export const canSeeInventory = () =>
  getJwtRole() === 'ADMIN' || hasPermission('INVENTARIO_PRECIO_READ');

/** Nav gate: primary ADMIN role or RBAC admin permissions (server still enforces). */
export const isAdminNavVisible = () => {
  if (getJwtRole() === 'ADMIN') return true;
  const perms = getJwtPermissions();
  return ADMIN_PERMISSIONS.some((p) => perms.includes(p));
};

export const forgotPassword = async (email) => {
  const response = await axios.post(`${BASE_URL}/api/auth/forgot-password`, { email });
  return response.data;
};

export const resetPassword = async (token, newPassword) => {
  const response = await axios.post(`${BASE_URL}/api/auth/reset-password`, { token, newPassword });
  return response.data;
};
