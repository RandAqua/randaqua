// API Configuration
// Здесь можно быстро изменить адрес Swagger API

import { getAuthHeader } from '../utils/auth';

export const API_CONFIG = {
  // Базовый URL для Swagger API - адрес backend сервера
  BASE_URL: 'http://26.237.158.25:8000',
  
  // Эндпоинты API для различных операций
  ENDPOINTS: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    VERIFY_CODE: '/auth/verify-code',
    GET_USER_INFO: '/auth/get-user-info',
    GENERATE_BATCH: '/video/generate-batch-snapshot',
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
  GENERATE_BATCH: getApiUrl(API_CONFIG.ENDPOINTS.GENERATE_BATCH),
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

// Основная функция для генерации случайных чисел через API
export const generateBatch = async (count, minValue, maxValue) => {
  const headers = getApiHeaders(false); // Генерация не требует авторизации
  
  const requestBody = {
    count,
    min_value: minValue,
    max_value: maxValue
  };

  try {
    const response = await fetch(API_URLS.GENERATE_BATCH, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Если сервер вернул ссылку на файл с результатами, загружаем его
    if (data.external_response && data.external_response.fileUrl) {
      const fileResponse = await fetch(data.external_response.fileUrl);
      if (fileResponse.ok) {
        const fileData = await fileResponse.json();
        return {
          ...data,
          generatedNumbers: fileData.result.values
        };
      }
    }
    
    return data;
  } catch (error) {
    console.error('Error generating batch:', error);
    throw error;
  }
};
