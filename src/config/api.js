// API Configuration
// Здесь можно быстро изменить адрес Swagger API

import { getAuthHeader } from '../utils/auth';

export const API_CONFIG = {
  // Базовый URL для Swagger API
  BASE_URL: 'http://26.237.158.25:8000',
  
  // Эндпоинты API
  ENDPOINTS: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    VERIFY_CODE: '/auth/verify-code',
    GET_USER_INFO: '/auth/get-user-info',
  }
};

// Функция для получения полного URL эндпоинта
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Готовые URL для удобства использования
export const API_URLS = {
  LOGIN: getApiUrl(API_CONFIG.ENDPOINTS.LOGIN),
  REGISTER: getApiUrl(API_CONFIG.ENDPOINTS.REGISTER),
  VERIFY_CODE: getApiUrl(API_CONFIG.ENDPOINTS.VERIFY_CODE),
  GET_USER_INFO: getApiUrl(API_CONFIG.ENDPOINTS.GET_USER_INFO),
};

// Функция для создания заголовков с авторизацией
export const getApiHeaders = (includeAuth = true) => {
  const headers = {
    'accept': 'application/json',
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const authHeaders = getAuthHeader();
    return { ...headers, ...authHeaders };
  }

  return headers;
};

// Функция для выполнения авторизованных запросов
export const makeAuthenticatedRequest = async (url, options = {}) => {
  const headers = getApiHeaders(true);
  
  const requestOptions = {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  };

  return fetch(url, requestOptions);
};
