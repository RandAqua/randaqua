// API Configuration
// Здесь можно быстро изменить адрес Swagger API

export const API_CONFIG = {
  // Базовый URL для Swagger API
  BASE_URL: 'http://26.237.158.25:8000',
  
  // Эндпоинты API
  ENDPOINTS: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
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
};
