'use client';

import { useState } from 'react';
import { makeAuthenticatedRequest, API_URLS } from '../config/api';
import { isAuthenticated } from '../utils/auth';

export default function AuthenticatedApiExample() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const makeTestRequest = async () => {
    if (!isAuthenticated()) {
      setError('Пользователь не авторизован');
      return;
    }

    setLoading(true);
    setError('');
    setResponse(null);

    try {
      // Пример авторизованного запроса
      // Замените на реальный эндпоинт вашего API
      const response = await makeAuthenticatedRequest(API_URLS.LOGIN, {
        method: 'GET',
        // Дополнительные опции запроса
      });

      if (response.ok) {
        const data = await response.json();
        setResponse(data);
      } else {
        setError(`Ошибка: ${response.status} ${response.statusText}`);
      }
    } catch (err) {
      setError(`Ошибка запроса: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Пример авторизованного API запроса
      </h3>
      
      <div className="space-y-4">
        <button
          onClick={makeTestRequest}
          disabled={loading || !isAuthenticated()}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
          {loading ? 'Загрузка...' : 'Выполнить авторизованный запрос'}
        </button>

        {!isAuthenticated() && (
          <p className="text-red-600 text-sm">
            Для выполнения запроса необходимо авторизоваться
          </p>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {response && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <h4 className="text-green-800 font-medium mb-2">Ответ сервера:</h4>
            <pre className="text-green-700 text-sm overflow-auto">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
