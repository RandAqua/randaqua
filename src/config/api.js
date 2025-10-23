// Конфигурация API
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

// Локальная генерация случайных чисел (fallback)
const generateLocalRandom = (count, minValue, maxValue) => {
  const numbers = [];
  const range = maxValue - minValue + 1;
  
  // Используем crypto.getRandomValues для более качественной случайности
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const randomBytes = new Uint32Array(count);
    window.crypto.getRandomValues(randomBytes);
    
    for (let i = 0; i < count; i++) {
      // Преобразуем случайное число в диапазон [minValue, maxValue]
      const randomNumber = minValue + (randomBytes[i] % range);
      numbers.push(randomNumber);
    }
  } else {
    // Fallback для старых браузеров или Node.js
    for (let i = 0; i < count; i++) {
      const randomNumber = Math.floor(Math.random() * range) + minValue;
      numbers.push(randomNumber);
    }
  }
  
  return numbers;
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
    // Пытаемся подключиться к серверу с таймаутом
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 секунд таймаут
    
    const response = await fetch(API_URLS.GENERATE_BATCH, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

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
          generatedNumbers: fileData.result.values,
          source: 'server'
        };
      }
    }
    
    // Если сервер вернул числа напрямую
    if (data.generatedNumbers) {
      return {
        ...data,
        source: 'server'
      };
    }
    
    return data;
  } catch (error) {
    console.warn('Server unavailable, using local random generation:', error.message);
    
    // Fallback: генерируем локально
    const localNumbers = generateLocalRandom(count, minValue, maxValue);
    
    return {
      generatedNumbers: localNumbers,
      source: 'local',
      seed: `local_${Date.now()}`,
      entropy_quality: {
        randomness_score: 0.95, // Crypto API дает хорошую случайность
        source: 'crypto.getRandomValues'
      },
      processing_time: 0,
      warning: 'Сервер недоступен. Использована локальная генерация с crypto.getRandomValues()'
    };
  }
};
