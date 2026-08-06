import axios from 'axios';
import { getToken, logout, isTokenExpired } from './authService';

const BASE_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:8081';

const client = axios.create({ baseURL: BASE_URL });

client.interceptors.request.use((config) => {
  if (isTokenExpired()) {
    logout();
    window.location.replace('/login');
    return Promise.reject(new Error('Session expired'));
  }
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      logout();
      window.location.replace('/login');
    }
    return Promise.reject(err);
  }
);

const unwrap = (res) => res.data?.data;

export const getDirectoryMe = () => client.get('/api/directory/me').then(unwrap);
export const listPermissions = () => client.get('/api/rbac/permissions').then(unwrap);
export const createPermission = (body) => client.post('/api/rbac/permissions', body).then(unwrap);
export const listRoles = () => client.get('/api/rbac/roles').then(unwrap);
export const createRole = (body) => client.post('/api/rbac/roles', body).then(unwrap);
export const listGroups = () => client.get('/api/rbac/groups').then(unwrap);
export const createGroup = (body) => client.post('/api/rbac/groups', body).then(unwrap);
export const addGroupMember = (groupId, userId) =>
  client.post(`/api/rbac/groups/${groupId}/members/${userId}`).then(unwrap);
export const removeGroupMember = (groupId, userId) =>
  client.delete(`/api/rbac/groups/${groupId}/members/${userId}`).then(unwrap);
export const assignRoleToGroup = (groupId, roleName) =>
  client.post(`/api/rbac/groups/${groupId}/roles/${encodeURIComponent(roleName)}`).then(unwrap);
export const assignPermissionToRole = (roleName, permCode) =>
  client.post(`/api/rbac/roles/${encodeURIComponent(roleName)}/permissions/${encodeURIComponent(permCode)}`).then(unwrap);
export const removePermissionFromRole = (roleName, permCode) =>
  client.delete(`/api/rbac/roles/${encodeURIComponent(roleName)}/permissions/${encodeURIComponent(permCode)}`).then(unwrap);

export const listInventoryProducts = () =>
  client.get('/api/demo/inventario/productos').then(unwrap);
export const updateInventoryPrice = (sku, price) =>
  client.put('/api/demo/inventario/productos/precio', { sku, price }).then(unwrap);
export const updateInventoryStock = (sku, quantity) =>
  client.put('/api/demo/inventario/productos/stock', { sku, quantity }).then(unwrap);
export const listUsers = (page = 0, size = 50) =>
  client.get('/api/users', { params: { page, size } }).then(unwrap);
export const adminResetPassword = (userId, newPassword) =>
  client.post(`/api/users/${userId}/reset-password`, newPassword ? { newPassword } : {}).then(unwrap);
