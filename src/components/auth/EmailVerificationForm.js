'use client';

import { useState } from 'react';
import AnimatedInput from '../forms/AnimatedInput';
import { FormContainer, PrimaryButton, LinkButton } from '../ui/UIComponents';
import { API_URLS } from '../../config/api';
import { saveAuthData } from '../../utils/auth';

export default function EmailVerificationForm({ email, username, onVerificationSuccess, onBackToRegister }) {
  const [code, setCode] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setCode(value);
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const newErrors = {};

    if (!code.trim()) {
      newErrors.code = 'Введите код подтверждения';
    } else if (!/^\d{6}$/.test(code)) {
      newErrors.code = 'Код должен содержать 6 цифр';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await fetch(API_URLS.VERIFY_CODE, {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            code: code
          })
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Verification successful:', data);
          
          // Сохраняем auth_token и другие данные аутентификации в localStorage
          const token = data.token || data.Token || data.access_token;
          if (token) {
            try {
              // Используем существующую функцию saveAuthData для сохранения токена
              const authData = {
                token: token,
                username: username,
                email: email,
                ...data // включаем все дополнительные данные от сервера
              };
              
              const saveSuccess = saveAuthData(authData);
              if (saveSuccess) {
                console.log('Auth token and data saved successfully after verification');
              } else {
                console.error('Failed to save auth data after verification');
              }
            } catch (error) {
              console.error('Error saving auth data after verification:', error);
            }
          } else {
            console.warn('No token received from verification response:', data);
            // Если токена нет, все равно сохраняем username для совместимости
            if (username) {
              try {
                localStorage.setItem('username', username);
                console.log('Username saved to localStorage after verification (no token):', username);
              } catch (error) {
                console.error('Error saving username to localStorage after verification:', error);
              }
            }
          }
          
          // Показываем успешное уведомление
          const successMessage = document.createElement('div');
          successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300';
          successMessage.innerHTML = `
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Email успешно подтвержден!
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

          // Вызываем callback для успешной верификации
          if (onVerificationSuccess) {
            onVerificationSuccess();
          }
        } else {
          const errorData = await response.json();
          if (response.status === 400) {
            setErrors({ general: 'Неверный код подтверждения' });
          } else if (response.status === 404) {
            setErrors({ general: 'Код не найден или истек' });
          } else if (response.status >= 500) {
            setErrors({ general: 'Проблемы с сервером. Попробуйте позже' });
          } else {
            setErrors({ general: errorData.message || 'Не удалось подтвердить email' });
          }
        }
      } catch (err) {
        setErrors({ general: 'Проблемы с подключением. Проверьте интернет' });
        console.error('Verification error:', err);
      }
    }
    
    setIsLoading(false);
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    try {
      // Здесь можно добавить логику для повторной отправки кода
      // Пока что просто показываем уведомление
      const message = document.createElement('div');
      message.className = 'fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300';
      message.innerHTML = `
        <div class="flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Код отправлен повторно
        </div>
      `;
      document.body.appendChild(message);
      
      setTimeout(() => {
        message.style.opacity = '0';
        message.style.transform = 'translateX(100%)';
        setTimeout(() => {
          document.body.removeChild(message);
        }, 300);
      }, 3000);
    } catch (err) {
      console.error('Resend code error:', err);
    }
    setIsLoading(false);
  };

  return (
    <FormContainer title="Подтверждение Email">
      <div className="mb-6 text-center">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-center mb-2">
            <svg className="w-8 h-8 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm text-gray-700 mb-2">
            Мы отправили код подтверждения на:
          </p>
          <p className="font-semibold text-blue-800">{email}</p>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Введите 6-значный код из письма для завершения регистрации
        </p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <AnimatedInput
          type="text"
          value={code}
          onChange={(e) => handleInputChange('code', e.target.value)}
          label="Код подтверждения"
          error={errors.code}
          required={true}
          placeholder="123456"
          maxLength={6}
        />

        {errors.general && (
          <div className="text-red-600 text-sm mb-4 text-center font-medium bg-red-50 px-3 py-2 rounded" style={{ color: '#dc2626' }}>
            {errors.general}
          </div>
        )}

        <PrimaryButton type="submit" className="mb-4" disabled={isLoading} isLoading={isLoading}>
          Подтвердить
        </PrimaryButton>
      </form>

      <div className="text-center mb-4">
        <button 
          onClick={handleResendCode}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          style={{ color: '#2563eb' }}
          disabled={isLoading}
        >
          Отправить код повторно
        </button>
      </div>

      <div className="text-center">
        <span className="text-gray-600 text-sm font-medium" style={{ color: '#4b5563' }}>Неправильный email? </span>
        {onBackToRegister ? (
          <button 
            onClick={onBackToRegister}
            className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
            style={{ color: '#2563eb' }}
          >
            Изменить
          </button>
        ) : (
          <LinkButton href="/auth?tab=register">
            Изменить
          </LinkButton>
        )}
      </div>

    </FormContainer>
  );
}
