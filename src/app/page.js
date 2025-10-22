"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/layout/Navbar';
import AuthModal from '../components/auth/AuthModal';

export default function Home() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');

  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === 'Escape') setIsAuthModalOpen(false);
    };
    if (isAuthModalOpen) document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [isAuthModalOpen]);

  // На главной полностью отключаем скролл
  useEffect(() => {
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, []);

  const openAuthModal = (tab = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);

  const handleLoginSuccess = () => {
    closeAuthModal();
    // Принудительно обновляем страницу для обновления Navbar
    window.location.reload();
  };

  const handleVerificationSuccess = () => {
    closeAuthModal();
    // Показываем уведомление об успешной верификации
    const successMessage = document.createElement('div');
    successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300';
    successMessage.innerHTML = `
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        Регистрация завершена! Теперь вы можете войти в систему.
      </div>
    `;
    document.body.appendChild(successMessage);
    
    // Убираем уведомление через 5 секунд
    setTimeout(() => {
      successMessage.style.opacity = '0';
      successMessage.style.transform = 'translateX(100%)';
      setTimeout(() => {
        document.body.removeChild(successMessage);
      }, 300);
    }, 5000);
  };

  return (
    <div className="min-h-screen">
      {/* Основной контент */}
      <div className={`main-content ${isAuthModalOpen ? 'blur' : ''}`}>
        <Navbar onLoginClick={openAuthModal} />
        
        {/* Героическая секция RandAqua */}
        <section className="aqua-hero-section" style={{ minHeight: '120vh' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 aqua-text-container" style={{ paddingTop: '8rem', paddingBottom: '8rem' }}>
            <div className="text-center">
              <h1 className="aqua-main-title" style={{ fontSize: '5rem', marginBottom: '3rem' }}>
                <span className="aqua-title-line1">Истинная случайность</span>
                <span className="aqua-title-line2">из глубин океана</span>
              </h1>
              <p className="aqua-hero-description" style={{ fontSize: '1.5rem', marginBottom: '4rem', maxWidth: '900px' }}>
                Революционная система генерации случайных чисел на основе наблюдения за морской жизнью. 
                Камеры видеонаблюдения за рыбами создают истинно случайные числа для ваших нужд.
              </p>
              <div className="flex justify-center space-x-6 mt-12">
                <Link href="/generate" className="aqua-generate-btn" style={{ padding: '20px 40px', fontSize: '18px' }}>
                  <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
                  </svg>
                  Генерировать число
                </Link>
                <Link href="/analyze" className="aqua-how-btn" style={{ padding: '20px 40px', fontSize: '18px' }}>
                  <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" clipRule="evenodd"/>
                  </svg>
                  Анализатор
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Модальное окно авторизации — за пределами .main-content */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialTab={authModalTab}
        onVerificationSuccess={handleVerificationSuccess}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}