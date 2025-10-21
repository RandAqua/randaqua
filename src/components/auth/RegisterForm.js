'use client';

import { useState } from 'react';
import AnimatedInput from '../forms/AnimatedInput';
import { FormContainer, PrimaryButton, LinkButton, HelpLink } from '../ui/UIComponents';
import { API_URLS } from '../../config/api';

export default function RegisterForm({ onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = async (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    if (field === 'username' && value.trim()) {
      const usernameValidation = validateUsername(value);
      if (usernameValidation.errors.length > 0) {
        setErrors(prev => ({ ...prev, username: usernameValidation.errors.join(', ') }));
      } else {
        setTimeout(async () => {
          const isAvailable = await checkUsernameAvailability(value);
          if (!isAvailable) {
            setErrors(prev => ({ ...prev, username: 'Это имя уже занято' }));
          }
        }, 500);
      }
    }
  };

  const validatePassword = (password) => {
    const errors = [];
    const suggestions = [];
    
    if (password.length < 8) {
      errors.push('Минимум 8 символов');
      suggestions.push('Добавьте еще символов для безопасности');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Заглавная буква');
      suggestions.push('Используйте A-Z для большей безопасности');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Строчная буква');
      suggestions.push('Добавьте строчные буквы a-z');
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('Цифра');
      suggestions.push('Добавьте цифры 0-9');
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Специальный символ');
      suggestions.push('Добавьте !@#$%^&*() для надежности');
    }
    
    return { errors, suggestions };
  };

  const validateUsername = (username) => {
    const errors = [];
    const suggestions = [];
    
    const forbiddenChars = /[!@#$%^&*()+=\[\]{};':"\\|,.<>\/?~`]/;
    if (forbiddenChars.test(username)) {
      errors.push('Только буквы и цифры');
      suggestions.push('Используйте только A-Z, a-z, 0-9');
    }
    
    if (/\s/.test(username)) {
      errors.push('Без пробелов');
      suggestions.push('Уберите пробелы из имени пользователя');
    }
    
    if (username.length < 3) {
      errors.push('Минимум 3 символа');
      suggestions.push('Добавьте еще символов');
    }
    
    if (username.length > 20) {
      errors.push('Максимум 20 символов');
      suggestions.push('Сократите имя пользователя');
    }
    
    return { errors, suggestions };
  };

  const checkUsernameAvailability = async (username) => {
    const unavailableUsernames = ['admin', 'user', 'test', 'support', 'moderator', 'admin123', 'user123'];
    return !unavailableUsernames.includes(username.toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Введите имя пользователя';
    } else {
      const usernameValidation = validateUsername(formData.username);
      if (usernameValidation.errors.length > 0) {
        newErrors.username = usernameValidation.errors.join(', ');
      } else {
        const isAvailable = await checkUsernameAvailability(formData.username);
        if (!isAvailable) {
          newErrors.username = 'Это имя уже занято';
        }
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Введите email адрес';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Проверьте правильность email';
    }

    if (!formData.password) {
      newErrors.password = 'Введите пароль';
    } else {
      const passwordValidation = validatePassword(formData.password);
      if (passwordValidation.errors.length > 0) {
        newErrors.password = passwordValidation.errors.join(', ');
      }
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await fetch(API_URLS.REGISTER, {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password
          })
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Registration successful:', data);
          
          // Показываем успешное уведомление
          const successMessage = document.createElement('div');
          successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300';
          successMessage.innerHTML = `
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Регистрация успешна!
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
          if (response.status === 400) {
            setErrors({ general: 'Проверьте правильность данных' });
          } else if (response.status === 409) {
            setErrors({ general: 'Пользователь с таким email уже существует' });
          } else if (response.status >= 500) {
            setErrors({ general: 'Проблемы с сервером. Попробуйте позже' });
          } else {
            setErrors({ general: errorData.message || 'Не удалось зарегистрироваться' });
          }
        }
      } catch (err) {
        setErrors({ general: 'Проблемы с подключением. Проверьте интернет' });
        console.error('Registration error:', err);
      }
    }
    
    setIsLoading(false);
  };

  return (
    <FormContainer title="Регистрация">
      
      <form onSubmit={handleSubmit}>
        <AnimatedInput
          type="text"
          value={formData.username}
          onChange={(e) => handleInputChange('username', e.target.value)}
          label="Username"
          error={errors.username}
          required={true}
        />

        <AnimatedInput
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          label="Email"
          error={errors.email}
          required={true}
        />

        <AnimatedInput
          type="password"
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          label="Пароль"
          error={errors.password}
          required={true}
          showPasswordToggle={true}
          showPasswordStrength={true}
        />

        <AnimatedInput
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
          label="Подтвердите пароль"
          error={errors.confirmPassword}
          required={true}
          showPasswordToggle={true}
        />

        {errors.general && (
          <div className="text-red-600 text-sm mb-4 text-center font-medium bg-red-50 px-3 py-2 rounded" style={{ color: '#dc2626' }}>
            {errors.general}
          </div>
        )}

        <PrimaryButton type="submit" className="mb-6" disabled={isLoading} isLoading={isLoading}>
          Зарегистрироваться
        </PrimaryButton>
      </form>

      <div className="text-center mb-4">
        <span className="text-gray-600 text-sm font-medium" style={{ color: '#4b5563' }}>Уже есть аккаунт? </span>
        {onSwitchToLogin ? (
          <button 
            onClick={onSwitchToLogin}
            className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
            style={{ color: '#2563eb' }}
          >
            Войти
          </button>
        ) : (
          <LinkButton href="/auth?tab=login">
            Войти
          </LinkButton>
        )}
      </div>

      <HelpLink />
    </FormContainer>
  );
}
