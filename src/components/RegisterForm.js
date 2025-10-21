'use client';

import { useState } from 'react';
import AnimatedInput from './AnimatedInput';
import FormContainer from './FormContainer';
import PrimaryButton from './PrimaryButton';
import LinkButton from './LinkButton';
import HelpLink from './HelpLink';

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
      const usernameErrors = validateUsername(value);
      if (usernameErrors.length > 0) {
        setErrors(prev => ({ ...prev, username: usernameErrors.join(', ') }));
      } else {
        setTimeout(async () => {
          const isAvailable = await checkUsernameAvailability(value);
          if (!isAvailable) {
            setErrors(prev => ({ ...prev, username: 'Этот username уже занят' }));
          }
        }, 500);
      }
    }
  };

  const validatePassword = (password) => {
    const errors = [];
    
    if (password.length < 8) {
      errors.push('Пароль должен содержать минимум 8 символов');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Пароль должен содержать заглавную букву');
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Пароль должен содержать специальный символ');
    }
    
    return errors;
  };

  const validateUsername = (username) => {
    const errors = [];
    
    const forbiddenChars = /[!@#$%^&*()+=\[\]{};':"\\|,.<>\/?~`]/;
    if (forbiddenChars.test(username)) {
      errors.push('Username не должен содержать специальные символы');
    }
    
    if (/\s/.test(username)) {
      errors.push('Username не должен содержать пробелы');
    }
    
    if (username.length < 3) {
      errors.push('Username должен содержать минимум 3 символа');
    }
    
    if (username.length > 20) {
      errors.push('Username не должен превышать 20 символов');
    }
    
    return errors;
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
      newErrors.username = 'Username обязателен для заполнения';
    } else {
      const usernameErrors = validateUsername(formData.username);
      if (usernameErrors.length > 0) {
        newErrors.username = usernameErrors.join(', ');
      } else {
        const isAvailable = await checkUsernameAvailability(formData.username);
        if (!isAvailable) {
          newErrors.username = 'Этот username уже занят';
        }
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен для заполнения';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Введите корректный email';
    }

    if (!formData.password) {
      newErrors.password = 'Пароль обязателен для заполнения';
    } else {
      const passwordErrors = validatePassword(formData.password);
      if (passwordErrors.length > 0) {
        newErrors.password = passwordErrors.join(', ');
      }
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await fetch('http://26.237.158.25:8000/auth/register', {
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
          alert('Регистрация успешна!');
        } else {
          const errorData = await response.json();
          setErrors({ general: errorData.message || 'Ошибка регистрации' });
        }
      } catch (err) {
        setErrors({ general: 'Ошибка соединения с сервером' });
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
        />

        <AnimatedInput
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
          label="Подтвердите пароль"
          error={errors.confirmPassword}
          required={true}
        />

        {errors.general && (
          <div className="text-red-500 text-sm mb-4 text-center">
            {errors.general}
          </div>
        )}

        <PrimaryButton type="submit" className="mb-6" disabled={isLoading}>
          {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
        </PrimaryButton>
      </form>

      <div className="text-center mb-4">
        <span className="text-gray-500 text-sm">Уже есть аккаунт? </span>
        {onSwitchToLogin ? (
          <button 
            onClick={onSwitchToLogin}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
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
