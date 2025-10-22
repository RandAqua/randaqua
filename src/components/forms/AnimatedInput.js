'use client';

import { useState } from 'react';

export default function AnimatedInput({
  type = "text",
  value,
  onChange,
  onFocus,
  onBlur,
  label,
  placeholder = "",
  error = "",
  className = "",
  required = false,
  showPasswordToggle = false,
  showPasswordStrength = false
}) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleFocus = (e) => {
    setFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setFocused(false);
    onBlur?.(e);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const strengthLevels = [
      { strength: 0, label: '', color: '' },
      { strength: 1, label: 'Очень слабый', color: '#ef4444' },
      { strength: 2, label: 'Слабый', color: '#f97316' },
      { strength: 3, label: 'Средний', color: '#eab308' },
      { strength: 4, label: 'Хороший', color: '#22c55e' },
      { strength: 5, label: 'Отличный', color: '#10b981' }
    ];

    return strengthLevels[Math.min(strength, 5)];
  };

  const passwordStrength = showPasswordStrength && type === 'password' ? getPasswordStrength(value) : null;
  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className="input-container mb-4">
      <div className="relative">
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`w-full px-6 py-5 ${showPasswordToggle && type === 'password' ? 'pr-14' : 'pr-6'} border rounded-lg bg-white text-gray-900 placeholder-gray-400 ${
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
          } ${className}`}
          style={{ color: '#111827' }}
        />
        {showPasswordToggle && type === 'password' && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            style={{ color: '#6b7280' }}
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        )}
        <label
          className={`absolute left-6 transition-all duration-200 pointer-events-none ${
            focused || value
              ? 'top-2 text-xs text-gray-600 bg-white px-1 font-medium z-10 transform translate-y-0'
              : 'top-1/2 transform -translate-y-1/2 text-gray-500'
          }`}
          style={{ 
            color: focused || value ? '#4b5563' : '#6b7280',
            fontWeight: focused || value ? '500' : '400',
            zIndex: focused || value ? 10 : 'auto',
            // Принудительно поднимаем лейбл вверх при наличии кнопки переключения пароля
            top: (focused || value) ? '8px' : '50%',
            transform: (focused || value) ? 'translateY(0)' : 'translateY(-50%)',
            fontSize: (focused || value) ? '12px' : '16px'
          }}
        >
          {label} {required && '*'}
        </label>
      </div>
      
      {passwordStrength && passwordStrength.strength > 0 && (
        <div className="mt-2">
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${(passwordStrength.strength / 5) * 100}%`,
                  backgroundColor: passwordStrength.color
                }}
              />
            </div>
            <span 
              className="text-xs font-medium"
              style={{ color: passwordStrength.color }}
            >
              {passwordStrength.label}
            </span>
          </div>
        </div>
      )}
      
      {error && (
        <p className="text-red-600 text-xs mt-1 font-medium bg-red-50 px-2 py-1 rounded" style={{ color: '#dc2626' }}>{error}</p>
      )}
    </div>
  );
}
