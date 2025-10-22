'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MENU_ITEMS } from '../../custom/menu-config';
import { isAuthenticated, getUserData, getUsername, clearAuthData } from '../../utils/auth';

export default function Navbar({ onLoginClick }) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [username, setUsername] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [hideTimeout, setHideTimeout] = useState(null);

  useEffect(() => {
    // Проверяем статус авторизации при загрузке компонента
    const checkAuthStatus = () => {
      const authenticated = isAuthenticated();
      const user = getUserData();
      const userUsername = getUsername();
      console.log('Auth status check:', { authenticated, user, userUsername });
      setIsLoggedIn(authenticated);
      setUserData(user);
      setUsername(userUsername || '');
    };

    checkAuthStatus();

    // Слушаем изменения в localStorage для обновления статуса
    const handleStorageChange = () => {
      checkAuthStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Также проверяем каждые 5 секунд на случай изменений в том же окне
    const interval = setInterval(checkAuthStatus, 5000);

    // Добавляем слушатель для обновления username при изменении localStorage
    const handleUsernameUpdate = () => {
      const userUsername = getUsername();
      console.log('Username updated from localStorage:', userUsername);
      setUsername(userUsername || '');
    };

    // Слушаем изменения username в localStorage
    window.addEventListener('storage', (e) => {
      if (e.key === 'username') {
        handleUsernameUpdate();
      }
    });

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
      // Очищаем таймер при размонтировании
      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }
    };
  }, []);

  const handleLogout = () => {
    clearAuthData();
    setIsLoggedIn(false);
    setUserData(null);
    setUsername('');
    setIsUserMenuOpen(false);
    
    // Показываем уведомление о выходе
    const logoutMessage = document.createElement('div');
    logoutMessage.className = 'fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300';
    logoutMessage.innerHTML = `
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
        </svg>
        Вы вышли из системы
      </div>
    `;
    document.body.appendChild(logoutMessage);
    
    setTimeout(() => {
      logoutMessage.style.opacity = '0';
      logoutMessage.style.transform = 'translateX(100%)';
      setTimeout(() => {
        document.body.removeChild(logoutMessage);
      }, 300);
    }, 3000);
  };

  const handleMouseEnter = () => {
    // Очищаем таймер скрытия, если он есть
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      setHideTimeout(null);
    }
    setIsUserMenuOpen(true);
  };

  const handleMouseLeave = () => {
    // Устанавливаем таймер на скрытие через 300мс
    const timeout = setTimeout(() => {
      setIsUserMenuOpen(false);
      setHideTimeout(null);
    }, 300);
    setHideTimeout(timeout);
  };

  // Функция для принудительного обновления username (для отладки)
  const refreshUsername = () => {
    const userUsername = getUsername();
    console.log('Manually refreshing username:', userUsername);
    setUsername(userUsername || '');
  };

  // Функция для перехода на главную страницу
  const handleLogoClick = () => {
    router.push('/');
  };

  return (
    <nav className="aqua-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Логотип RandAqua */}
          <div className="flex-shrink-0 flex items-center">
            <div 
              className="aqua-logo-container flex items-center space-x-3"
              onClick={handleLogoClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleLogoClick();
                }
              }}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center aqua-drop-icon">
                <img src="/fish-logo.svg" alt="RandAqua Logo" className="w-6 h-6" />
              </div>
              <div className="aqua-logo-text text-2xl font-bold text-white">
                RandAqua
              </div>
            </div>
          </div>

          {/* Десктопное меню */}
          <div className="hidden md:block flex-1">
            <div className="flex items-center justify-center space-x-4">
              {MENU_ITEMS.map((item) => (
                <a key={item.href + item.label} href={item.href} className="aqua-nav-link-wide">{item.label}</a>
              ))}
            </div>
          </div>

          {/* Кнопки авторизации в правом углу */}
          <div className="hidden md:block">
            {isLoggedIn ? (
              <div className="relative">
                <div 
                  className="group flex items-center space-x-2 text-white cursor-pointer hover:bg-gradient-to-r hover:from-blue-600/90 hover:to-purple-600/90 px-3 py-1.5 rounded-xl transition-all duration-500 hover:shadow-xl hover:scale-105 border border-transparent hover:border-blue-400/50 backdrop-blur-sm bg-white/5 hover:bg-blue-50/20"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg ring-2 ring-white/10 group-hover:ring-white/30 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                      <img src="/person-icon.svg" alt="User" className="w-5 h-5 text-gray-600" />
                    </div>
                  </div>
                  {username && (
                    <div className="flex flex-col space-y-0.5">
                      <span className="text-sm font-semibold text-blue-200 group-hover:text-blue-100 transition-colors duration-300">
                        {username}
                      </span>
                    </div>
                  )}
                  <div className="ml-1">
                    <svg className={`w-3 h-3 transition-all duration-500 group-hover:scale-110 ${isUserMenuOpen ? 'rotate-180 text-white' : 'rotate-0 text-blue-200 group-hover:text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                {/* Выпадающее меню */}
                {isUserMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-48 bg-gradient-to-br from-white/95 to-blue-50/95 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 py-3 z-50 animate-in slide-in-from-top-2 duration-300"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="py-1">
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-1.5 py-1 text-xs text-gray-700 hover:text-red-600 transition-all duration-300 flex items-center group rounded-md mx-1"
                      >
                        <div className="w-2.5 h-2.5 rounded-full bg-red-100 group-hover:bg-red-200 flex items-center justify-center mr-1 transition-colors duration-300">
                          <svg className="w-1 h-1 text-red-500 group-hover:text-red-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                        </div>
                        <div>
                          <span className="font-semibold block text-xs">Выйти</span>
                          <span className="text-xs text-gray-500 group-hover:text-red-500">Завершить сессию</span>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
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
            )}
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
              {MENU_ITEMS.map((item) => (
                <a key={item.href + item.label} href={item.href} className="aqua-nav-link-mobile">{item.label}</a>
              ))}
              <div className="pt-4 space-y-2">
                {isLoggedIn ? (
                  <>
                    <div className="flex items-center space-x-3 text-white px-4 py-3 bg-gradient-to-r from-blue-600/80 to-purple-600/80 rounded-xl mb-2 shadow-lg border border-white/20">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md ring-2 ring-white/30">
                        <img src="/person-icon.svg" alt="User" className="w-6 h-6 text-gray-600" />
                      </div>
                      {username && (
                        <div className="flex flex-col space-y-0.5">
                          <span className="text-sm font-bold text-blue-200">
                            {username}
                          </span>
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center px-1.5 py-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-md font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 text-xs"
                    >
                      <svg className="w-2.5 h-2.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Выйти
                    </button>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
