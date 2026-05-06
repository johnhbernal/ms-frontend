import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

export const login = async (username, password) => {
  const response = await axios.post(`${BASE_URL}/auth/login`, { username, password });
  return response.data;
};

export const saveToken = (token, remember) => {
  if (remember) {
    localStorage.setItem('token', token);
  } else {
    sessionStorage.setItem('token', token);
  }
};

export const getToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

export const logout = () => {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
};
