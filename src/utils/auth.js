// Утилиты аутентификации для управления токенами

import { API_URLS } from '../config/api';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

// Сохранение данных аутентификации в localStorage
export const saveAuthData = (authData) => {
  try {
    // Обработка различных форматов ответа
    const token = authData.token || authData.Token;
    const user = authData.user || authData.User;
    const userId = authData.user_id || authData.user_uuid;
    const expiresIn = authData.expires_in;
    const tokenType = authData.token_type || 'Bearer';

    if (!token) {
      console.error('No token found in auth data:', authData);
      return false;
    }

    // Вычисление времени истечения
    const expiresAt = expiresIn ? Date.now() + (expiresIn * 1000) : null;

    // Подготовка данных пользователя
    const userData = {
      id: user?.Id || userId,
      email: user?.Email || user?.email || authData.email,
      username: user?.Username || user?.username || authData.username,
      tokenType,
      expiresAt
    };

    // Сохраняем username отдельно для быстрого доступа
    if (userData.username) {
      try {
        localStorage.setItem('username', userData.username);
        console.log('Username saved to localStorage in saveAuthData:', userData.username);
      } catch (error) {
        console.error('Error saving username to localStorage in saveAuthData:', error);
      }
    }

    // Сохранение в localStorage
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));

    console.log('Auth data saved successfully');
    console.log('Saved user data:', userData);
    return true;
  } catch (error) {
    console.error('Error saving auth data:', error);
    return false;
  }
};

// Получение токена из localStorage
export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

// Получение данных пользователя из localStorage
export const getUserData = () => {
  try {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

// Получение имени пользователя из localStorage
export const getUsername = () => {
  try {
    return localStorage.getItem('username');
  } catch (error) {
    console.error('Error getting username:', error);
    return null;
  }
};

// Проверка действительности токена и отсутствия истечения
export const isTokenValid = () => {
  try {
    const token = getToken();
    const userData = getUserData();
    
    if (!token || !userData) {
      return false;
    }

    // Проверка истечения токена
    if (userData.expiresAt && Date.now() > userData.expiresAt) {
      clearAuthData();
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error checking token validity:', error);
    return false;
  }
};

// Очистка данных аутентификации из localStorage
export const clearAuthData = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('username');
    console.log('Auth data cleared');
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
};

// Получение заголовка авторизации для API запросов
export const getAuthHeader = () => {
  const token = getToken();
  const userData = getUserData();
  
  if (!token || !isTokenValid()) {
    return {};
  }

  const tokenType = userData?.tokenType || 'Bearer';
  return {
    'Authorization': `${tokenType} ${token}`
  };
};

// Проверка аутентификации пользователя
export const isAuthenticated = () => {
  return isTokenValid();
};

// Валидация токена пользователя с сервером
export const validateUserToken = async () => {
  try {
    const token = getToken();
    
    if (!token) {
      console.log('No token found for validation');
      return { success: false, error: 'No token' };
    }

    console.log('Validating token with server...');
    
    const response = await fetch(API_URLS.GET_USER_INFO, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token
      })
    });

    console.log('Token validation response status:', response.status);

    if (response.ok) {
      const data = await response.json();
      console.log('Token validation successful:', data);
      
      if (data.success && data.user) {
        // Обновляем username в localStorage
        const username = data.user.username;
        if (username) {
          try {
            localStorage.setItem('username', username);
            console.log('Username updated from server:', username);
          } catch (error) {
            console.error('Error updating username:', error);
          }
        }
        
        return { 
          success: true, 
          user: data.user,
          username: username 
        };
      } else {
        console.log('Server returned unsuccessful response');
        return { success: false, error: 'Invalid response format' };
      }
    } else {
      console.log('Token validation failed, clearing auth data');
      // Если токен недействителен, очищаем данные
      clearAuthData();
      return { success: false, error: 'Token invalid' };
    }
  } catch (error) {
    console.error('Error validating token:', error);
    // При ошибке сети не очищаем токен, возможно проблема с соединением
    return { success: false, error: 'Network error' };
  }
};
