'use client';

import { useState, useEffect } from 'react';
import { getToken, getUserData, getUsername, isAuthenticated, clearAuthData } from '../../utils/auth';

export default function AuthStatus() {
  const [isAuth, setIsAuth] = useState(false);
  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Проверяем статус аутентификации при загрузке компонента
    const checkAuthStatus = () => {
      const authStatus = isAuthenticated();
      const user = getUserData();
      const authToken = getToken();
      
      setIsAuth(authStatus);
      setUserData(user);
      setToken(authToken);
    };

    checkAuthStatus();

    // Слушаем изменения в localStorage для обновления статуса
    const handleStorageChange = (e) => {
      if (e.key === 'auth_token' || e.key === 'user_data' || e.key === 'username') {
        checkAuthStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    clearAuthData();
    setIsAuth(false);
    setUserData(null);
    setToken(null);
  };

  if (!isAuth) {
    return (
      <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Статус аутентификации</h3>
        <p className="text-gray-600">Пользователь не авторизован</p>
      </div>
    );
  }

  return (
    <div className="bg-green-50 border border-green-300 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-green-800 mb-2">Статус аутентификации</h3>
      <div className="space-y-2">
        <p className="text-green-700">
          <span className="font-medium">Email:</span> {userData?.email || 'Не указан'}
        </p>
        <p className="text-green-700">
          <span className="font-medium">Username:</span> {getUsername() || userData?.username || 'Не указан'}
        </p>
        <p className="text-green-700">
          <span className="font-medium">ID:</span> {userData?.id || 'Не указан'}
        </p>
        <p className="text-green-700">
          <span className="font-medium">Тип токена:</span> {userData?.tokenType || 'Bearer'}
        </p>
        <p className="text-green-700">
          <span className="font-medium">Токен:</span> {token ? `${token.substring(0, 20)}...` : 'Не найден'}
        </p>
        {userData?.expiresAt && (
          <p className="text-green-700">
            <span className="font-medium">Истекает:</span> {new Date(userData.expiresAt).toLocaleString()}
          </p>
        )}
      </div>
      <button
        onClick={handleLogout}
        className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
      >
        Выйти
      </button>
    </div>
  );
}
