'use client';

import { useState } from 'react';
import AnimatedInput from '../forms/AnimatedInput';
import { FormContainer, PrimaryButton, LinkButton } from '../ui/UIComponents';
import { API_URLS } from '../../config/api';
import EmailVerificationForm from './EmailVerificationForm';

export default function RegisterForm({ onSwitchToLogin, onVerificationSuccess }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

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
          
          // Сохраняем email и переключаемся на форму верификации
          setRegisteredEmail(formData.email);
          setShowVerification(true);
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

  const handleVerificationSuccess = () => {
    if (onVerificationSuccess) {
      onVerificationSuccess();
    }
  };

  const handleBackToRegister = () => {
    setShowVerification(false);
    setRegisteredEmail('');
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
  };

  // Если нужно показать форму верификации
  if (showVerification) {
    return (
      <EmailVerificationForm 
        email={registeredEmail}
        onVerificationSuccess={handleVerificationSuccess}
        onBackToRegister={handleBackToRegister}
      />
    );
  }

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
          showPasswordToggle={false}
          showPasswordStrength={true}
        />

        <AnimatedInput
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
          label="Подтвердите пароль"
          error={errors.confirmPassword}
          required={true}
          showPasswordToggle={false}
        />

        {errors.general && (
          <div className="text-red-600 text-sm mb-4 text-center font-medium bg-red-50 px-3 py-2 rounded" style={{ color: '#dc2626' }}>
            {errors.general}
          </div>
        )}

        <div className="form-actions flex justify-end">
          <PrimaryButton type="submit" className="register-btn" disabled={isLoading} isLoading={isLoading}>
            Зарегистрироваться
          </PrimaryButton>
        </div>
      </form>


    </FormContainer>
  );
}
