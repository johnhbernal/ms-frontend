import axios from 'axios';

const BASE_URL = process.env.REACT_APP_AUTH_API_URL || 'http://localhost:8081';

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
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub || '';
  } catch {
    return '';
  }
};

export const logout = () => {
  const token = getToken();
  if (token) {
    axios.post(`${BASE_URL}/api/auth/logout`, null, {
      headers: { Authorization: `Bearer ${token}` }
    }).catch((err) => { console.warn('Server-side logout failed (session cleared locally):', err?.message); });
  }
  sessionStorage.removeItem('token');
};
