'use client';

import { useState, useEffect } from 'react';
import AnimatedInput from '../forms/AnimatedInput';
import { FormContainer, PrimaryButton, LinkButton, HelpLink } from '../ui/UIComponents';
import { API_URLS } from '../../config/api';

export default function LoginForm({ onSwitchToRegister }) {
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Загружаем сохраненные данные при монтировании
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedRememberMe = localStorage.getItem('rememberMe') === 'true';
    if (savedEmail && savedRememberMe) {
      setEmailValue(savedEmail);
      setRememberMe(savedRememberMe);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
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

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);
        
        // Сохраняем данные если пользователь выбрал "Запомнить меня"
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', emailValue);
          localStorage.setItem('rememberMe', 'true');
        } else {
          localStorage.removeItem('rememberedEmail');
          localStorage.removeItem('rememberMe');
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
          showPasswordToggle={true}
        />

        <div className="flex items-center justify-between mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-600" style={{ color: '#4b5563' }}>
              Запомнить меня
            </span>
          </label>
          <a href="#" className="text-sm text-blue-600 hover:text-blue-800" style={{ color: '#2563eb' }}>
            Забыли пароль?
          </a>
        </div>

        {error && (
          <div className="text-red-600 text-sm mb-4 text-center font-medium bg-red-50 px-3 py-2 rounded" style={{ color: '#dc2626' }}>
            {error}
          </div>
        )}

        <PrimaryButton type="submit" className="mb-6" disabled={isLoading} isLoading={isLoading}>
          Войти
        </PrimaryButton>
      </form>

      <div className="text-center mb-4">
        <span className="text-gray-600 text-sm font-medium" style={{ color: '#4b5563' }}>Нет аккаунта? </span>
        {onSwitchToRegister ? (
          <button 
            onClick={onSwitchToRegister}
            className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
            style={{ color: '#2563eb' }}
          >
            Зарегистрироваться
          </button>
        ) : (
          <LinkButton href="/auth?tab=register">
            Зарегистрироваться
          </LinkButton>
        )}
      </div>

      <HelpLink />
    </FormContainer>
  );
}
