import axios from 'axios';
import { getToken } from './authService';

const BASE_URL = 'http://localhost:8082';

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${getToken()}` },
});

export const getParametrosActivos = () =>
  axios.get(`${BASE_URL}/parametros/activos`, authHeaders());

export const getParametros = () =>
  axios.get(`${BASE_URL}/parametros`, authHeaders());

export const getParametroById = (id) =>
  axios.get(`${BASE_URL}/parametros/${id}`, authHeaders());

export const buscarPorNombre = (nombre) =>
  axios.get(`${BASE_URL}/parametros/buscar`, { ...authHeaders(), params: { nombre } });

export const createParametro = (parametro) =>
  axios.post(`${BASE_URL}/parametros`, parametro, authHeaders());

export const updateParametro = (id, parametro) =>
  axios.put(`${BASE_URL}/parametros/${id}`, parametro, authHeaders());

export const deleteParametro = (id) =>
  axios.delete(`${BASE_URL}/parametros/${id}`, authHeaders());
