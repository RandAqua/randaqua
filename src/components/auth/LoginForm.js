'use client';

import { useState, useEffect } from 'react';
import AnimatedInput from '../forms/AnimatedInput';
import { FormContainer, PrimaryButton, LinkButton } from '../ui/UIComponents';
import { API_URLS } from '../../config/api';
import { saveAuthData } from '../../utils/auth';

export default function LoginForm({ onSwitchToRegister, onLoginSuccess }) {
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');


  const handleSubmit = async (e) => {
    console.log('LoginForm handleSubmit called');
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log('Sending login request to:', API_URLS.LOGIN);
      console.log('Request data:', { email: emailValue, password: '***' });
      
      const response = await fetch(API_URLS.LOGIN, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailValue,
          password: passwordValue
        })
      });
      
      console.log('Login response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);
        console.log('User data from API:', data.user);
        console.log('Email from API:', data.user?.Email || data.user?.email || data.email);
        console.log('Username from API:', data.user?.Username || data.user?.username || data.username);
        
        // Сохраняем токен и данные пользователя в localStorage
        const authSaved = saveAuthData(data);
        if (authSaved) {
          console.log('Authentication data saved to localStorage');
          
          // Дополнительно сохраняем username если он есть в ответе
          const username = data.user?.Username || data.user?.username || data.username;
          if (username) {
            try {
              localStorage.setItem('username', username);
              console.log('Username saved to localStorage:', username);
            } catch (error) {
              console.error('Error saving username to localStorage:', error);
            }
          }
        } else {
          console.error('Failed to save authentication data');
        }
        
        // Показываем успешное уведомление
        const successMessage = document.createElement('div');
        successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300';
        successMessage.innerHTML = `
          <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Вход выполнен успешно!
          </div>
        `;
        document.body.appendChild(successMessage);
        
        // Убираем уведомление через 3 секунды
        setTimeout(() => {
          successMessage.style.opacity = '0';
          successMessage.style.transform = 'translateX(100%)';
          setTimeout(() => {
            document.body.removeChild(successMessage);
          }, 300);
        }, 3000);
        
        // Уведомляем родительский компонент об успешном входе
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      } else {
        const errorData = await response.json();
        // Более дружелюбные сообщения об ошибках
        if (response.status === 401) {
          setError('Неверный email или пароль');
        } else if (response.status === 429) {
          setError('Слишком много попыток. Попробуйте позже');
        } else if (response.status >= 500) {
          setError('Проблемы с сервером. Попробуйте позже');
        } else {
          setError(errorData.message || 'Не удалось войти в систему');
        }
      }
    } catch (err) {
      setError('Проблемы с подключением. Проверьте интернет');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormContainer title="Вход">
      <form onSubmit={handleSubmit}>
        <AnimatedInput
          type="email"
          value={emailValue}
          onChange={(e) => setEmailValue(e.target.value)}
          label="Почта"
          required={true}
        />

        <AnimatedInput
          type="password"
          value={passwordValue}
          onChange={(e) => setPasswordValue(e.target.value)}
          label="Пароль"
          required={true}
          showPasswordToggle={false}
        />


        {error && (
          <div className="text-red-600 text-sm mb-4 text-center font-medium bg-red-50 px-3 py-2 rounded" style={{ color: '#dc2626' }}>
            {error}
          </div>
        )}

        <div className="form-actions flex justify-end">
          <PrimaryButton type="submit" disabled={isLoading} isLoading={isLoading}>
            Войти
          </PrimaryButton>
        </div>
      </form>


    </FormContainer>
  );
}
