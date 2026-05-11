import axios from 'axios';
import { getToken, logout, isTokenExpired } from './authService';

const BASE_URL = process.env.REACT_APP_PRACTICA_API_URL || 'http://localhost:8082/api';

const client = axios.create({ baseURL: BASE_URL });

client.interceptors.request.use((config) => {
  if (isTokenExpired()) {
    logout();
    window.location.replace('/login');
    return Promise.reject(new Error('Session expired'));
  }
  config.headers.Authorization = `Bearer ${getToken()}`;
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

export const getParametrosActivos = () => client.get('/parametros/activos');
export const getParametros = ()        => client.get('/parametros');
export const getParametroById = (id)   => client.get(`/parametros/${id}`);
export const buscarPorNombre = (nombre) => client.get('/parametros/buscar', { params: { nombre } });
export const createParametro = (parametro)        => client.post('/parametros', parametro);
export const updateParametro = (id, parametro)    => client.put(`/parametros/${id}`, parametro);
export const deleteParametro = (id)               => client.delete(`/parametros/${id}`);
