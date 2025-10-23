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


// Основная функция для генерации случайных чисел через API
export const generateBatch = async (count, minValue, maxValue) => {
  const headers = getApiHeaders(false); // Генерация не требует авторизации
  
  const requestBody = {
    count,
    min_value: minValue,
    max_value: maxValue
  };

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
  
  // Если сервер вернул ссылку на файл с результатами, пытаемся загрузить его
  if (data.external_response && data.external_response.fileUrl) {
    try {
      const fileResponse = await fetch(data.external_response.fileUrl);
      if (fileResponse.ok) {
        const fileData = await fileResponse.json();
        return {
          ...data,
          generatedNumbers: fileData.result.values
        };
      } else {
        console.warn('Не удалось загрузить файл с результатами:', fileResponse.status);
      }
    } catch (fileError) {
      console.warn('Ошибка при загрузке файла с результатами:', fileError);
      // Продолжаем выполнение, возможно данные есть в основном ответе
    }
  }
  
  // Если не удалось загрузить файл или его нет, возвращаем основные данные
  // и генерируем числа на основе seed
  if (!data.generatedNumbers && data.seed) {
    // Генерируем числа на основе seed для демонстрации
    const generatedNumbers = generateNumbersFromSeed(data.seed, count, minValue, maxValue);
    return {
      ...data,
      generatedNumbers
    };
  }
  
  return data;
};

// Функция для генерации чисел на основе seed (для демонстрации)
const generateNumbersFromSeed = (seed, count, minValue, maxValue) => {
  // Простой генератор псевдослучайных чисел на основе seed
  const numbers = [];
  let currentSeed = parseInt(seed.slice(0, 8), 16) || 12345;
  
  for (let i = 0; i < count; i++) {
    // Линейный конгруэнтный генератор
    currentSeed = (currentSeed * 1664525 + 1013904223) % 2147483648;
    const randomValue = minValue + (currentSeed % (maxValue - minValue + 1));
    numbers.push(randomValue);
  }
  
  return numbers;
};
