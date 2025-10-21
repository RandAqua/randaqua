'use client';

import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="aqua-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Логотип AquaRNG */}
          <div className="flex-shrink-0 flex items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center aqua-drop-icon">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5z"/>
                </svg>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                AquaRNG
              </div>
            </div>
          </div>

          {/* Десктопное меню */}
          <div className="hidden md:block flex-1">
            <div className="flex items-center justify-center space-x-4">
              <a
                href="#"
                className="aqua-nav-link-wide"
              >
                Создать тираж
              </a>
              <a
                href="#"
                className="aqua-nav-link-wide"
              >
                Проверка случайности
              </a>
              <a
                href="#"
                className="aqua-nav-link-wide"
              >
                Как это работает
              </a>
              <a
                href="#"
                className="aqua-nav-link-wide"
              >
                История
              </a>
            </div>
          </div>

          {/* Кнопка регистрации в правом углу */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <button className="aqua-register-btn">
                Регистрация
              </button>
              <a href="#" className="aqua-login-link">
                Вход
              </a>
            </div>
          </div>

          {/* Мобильное меню кнопка */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white p-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <svg
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Мобильное меню */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-4 space-y-2 sm:px-3 bg-blue-900">
              <a
                href="#"
                className="aqua-nav-link-mobile"
              >
                Создать тираж
              </a>
              <a
                href="#"
                className="aqua-nav-link-mobile"
              >
                Проверка случайности
              </a>
              <a
                href="#"
                className="aqua-nav-link-mobile"
              >
                Как это работает
              </a>
              <a
                href="#"
                className="aqua-nav-link-mobile"
              >
                История
              </a>
              <div className="pt-4 space-y-2">
                <button className="aqua-register-btn-mobile">
                  Регистрация
                </button>
                <a href="#" className="aqua-login-link-mobile">
                  Вход
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
