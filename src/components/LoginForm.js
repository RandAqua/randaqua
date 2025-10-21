'use client';

import { useState } from 'react';
import AnimatedInput from './AnimatedInput';
import FormContainer from './FormContainer';
import PrimaryButton from './PrimaryButton';
import LinkButton from './LinkButton';
import HelpLink from './HelpLink';

export default function LoginForm({ onSwitchToRegister }) {
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://26.237.158.25:8000/auth/login', {
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
        alert('Вход выполнен успешно!');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Ошибка входа');
      }
    } catch (err) {
      setError('Ошибка соединения с сервером');
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
        />

        {error && (
          <div className="text-red-500 text-sm mb-4 text-center">
            {error}
          </div>
        )}

        <PrimaryButton type="submit" className="mb-6" disabled={isLoading}>
          {isLoading ? 'Вход...' : 'Войти'}
        </PrimaryButton>
      </form>

      <div className="text-center mb-4">
        <span className="text-gray-500 text-sm">Нет аккаунта? </span>
        {onSwitchToRegister ? (
          <button 
            onClick={onSwitchToRegister}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
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
