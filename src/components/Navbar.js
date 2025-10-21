'use client';

import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg border-b-4 border-yellow-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Логотип в стиле Столото */}
          <div className="flex-shrink-0 flex items-center">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">Г</span>
              </div>
              <div className="text-3xl font-bold text-gray-800">
                Генератор
              </div>
            </div>
          </div>

          {/* Десктопное меню */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <a
                href="#"
                className="text-gray-700 hover:text-red-600 px-4 py-3 rounded-lg text-base font-semibold transition-all duration-200 hover:bg-red-50"
              >
                Создать тираж
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-red-600 px-4 py-3 rounded-lg text-base font-semibold transition-all duration-200 hover:bg-red-50"
              >
                Проверить случайность
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-red-600 px-4 py-3 rounded-lg text-base font-semibold transition-all duration-200 hover:bg-red-50"
              >
                Как это работает?
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-red-600 px-4 py-3 rounded-lg text-base font-semibold transition-all duration-200 hover:bg-red-50"
              >
                История
              </a>
            </div>
          </div>

          {/* Кнопка входа в стиле Столото */}
          <div className="hidden md:block">
            <button className="btn-stoloto px-6 py-3 text-base font-semibold">
              Вход
            </button>
          </div>

          {/* Мобильное меню кнопка */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-red-600 p-3 rounded-lg hover:bg-red-50 transition-colors duration-200"
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
            <div className="px-2 pt-2 pb-4 space-y-2 sm:px-3 bg-white border-t-2 border-yellow-400">
              <a
                href="#"
                className="text-gray-700 hover:text-red-600 block px-4 py-3 rounded-lg text-base font-semibold hover:bg-red-50 transition-colors duration-200"
              >
                Создать тираж
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-red-600 block px-4 py-3 rounded-lg text-base font-semibold hover:bg-red-50 transition-colors duration-200"
              >
                Проверить случайность
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-red-600 block px-4 py-3 rounded-lg text-base font-semibold hover:bg-red-50 transition-colors duration-200"
              >
                Как это работает?
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-red-600 block px-4 py-3 rounded-lg text-base font-semibold hover:bg-red-50 transition-colors duration-200"
              >
                История
              </a>
              <button className="btn-stoloto w-full text-left px-4 py-3 text-base font-semibold">
                Вход
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
