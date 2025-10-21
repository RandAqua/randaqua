'use client';

import { useState } from 'react';

export default function Navbar({ onLoginClick }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="aqua-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Логотип RandAqua */}
          <div className="flex-shrink-0 flex items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center aqua-drop-icon">
                <img src="/fish-logo.svg" alt="RandAqua Logo" className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold text-blue-600">
                RandAqua
              </div>
            </div>
          </div>

          {/* Десктопное меню */}
          <div className="hidden md:block flex-1">
            <div className="flex items-center justify-center space-x-4">
              <a
                href="/generate"
                className="aqua-nav-link-wide"
              >
                Создать тираж
              </a>
              <a
                href="/analyze"
                className="aqua-nav-link-wide"
              >
                Анализатор
              </a>
              <a
                href="#"
                className="aqua-nav-link-wide"
              >
                История
              </a>
              <a
                href="#"
                className="aqua-nav-link-wide"
              >
                Как это работает?
              </a>
            </div>
          </div>

          {/* Кнопка регистрации в правом углу */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => onLoginClick && onLoginClick('register')}
                className="aqua-register-btn"
              >
                Регистрация
              </button>
              <button 
                onClick={() => onLoginClick && onLoginClick('login')}
                className="aqua-login-link"
              >
                Вход
              </button>
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
                href="/generate"
                className="aqua-nav-link-mobile"
              >
                Создать тираж
              </a>
              <a
                href="/analyze"
                className="aqua-nav-link-mobile"
              >
                Анализатор
              </a>
              <a
                href="#"
                className="aqua-nav-link-mobile"
              >
                История
              </a>
              <a
                href="#"
                className="aqua-nav-link-mobile"
              >
                Как это работает?
              </a>
              <div className="pt-4 space-y-2">
                <button 
                  onClick={() => onLoginClick && onLoginClick('register')}
                  className="aqua-register-btn-mobile"
                >
                  Регистрация
                </button>
                <button 
                  onClick={() => onLoginClick && onLoginClick('login')}
                  className="aqua-login-link-mobile"
                >
                  Вход
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
