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
  required = false
}) {
  const [focused, setFocused] = useState(false);

  const handleFocus = (e) => {
    setFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setFocused(false);
    onBlur?.(e);
  };

  return (
    <div className="input-container mb-4">
      <input
        type={type}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`w-full px-4 py-4 border rounded-lg ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
      />
      <label
        className={`absolute left-4 transition-all duration-200 pointer-events-none ${
          focused || value
            ? 'top-2 text-xs text-gray-500 bg-white px-1'
            : 'top-1/2 transform -translate-y-1/2 text-gray-400'
        }`}
      >
        {label} {required && '*'}
      </label>
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
}
