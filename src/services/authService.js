import axios from 'axios';

const BASE_URL = 'http://localhost:8081';

export const login = async (username, password) => {
  const response = await axios.post(`${BASE_URL}/api/auth/login`, { username, password });
  return response.data;
};

export const saveToken = (token, remember) => {
  if (remember) {
    localStorage.setItem('token', token);
    sessionStorage.removeItem('token');
  } else {
    sessionStorage.setItem('token', token);
    localStorage.removeItem('token');
  }
};

export const getToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
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
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
};
