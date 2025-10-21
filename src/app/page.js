"use client";

import { useEffect, useState } from 'react';
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

  const openAuthModal = (tab = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);

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
    <div className="min-h-screen aqua-background">
      {/* Основной контент */}
      <div className={`main-content ${isAuthModalOpen ? 'blur' : ''}`}>
        <Navbar onLoginClick={openAuthModal} />
        
        {/* Героическая секция RandAqua */}
        <section className="aqua-hero-section">
          <div className="aqua-fish-background">
            {/* Дополнительные рыбки */}
            <div className="aqua-fish-1">🐟</div>
            <div className="aqua-fish-2">🐠</div>
            <div className="aqua-fish-3">🐡</div>
            <div className="aqua-fish-4">🐙</div>
            <div className="aqua-fish-5">🦈</div>
            <div className="aqua-fish-6">🐚</div>
            <div className="aqua-fish-7">🦀</div>
            <div className="aqua-fish-8">🐢</div>
            <div className="aqua-fish-9">🦑</div>
            <div className="aqua-fish-10">🐋</div>
            <div className="aqua-fish-11">🐠</div>
            <div className="aqua-fish-12">🐟</div>
            <div className="aqua-fish-13">🦑</div>
            <div className="aqua-fish-14">🐚</div>

            {/* Пузыри */}
            <div className="aqua-bubbles">
              <span className="aqua-bubble"></span>
              <span className="aqua-bubble"></span>
              <span className="aqua-bubble"></span>
              <span className="aqua-bubble"></span>
              <span className="aqua-bubble"></span>
              <span className="aqua-bubble"></span>
              <span className="aqua-bubble"></span>
              <span className="aqua-bubble"></span>
              <span className="aqua-bubble"></span>
              <span className="aqua-bubble"></span>
              <span className="aqua-bubble"></span>
              <span className="aqua-bubble"></span>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 aqua-text-container">
              <div className="text-center">
                <h1 className="aqua-main-title">
                  <span className="aqua-title-line1">Истинная случайность</span>
                  <span className="aqua-title-line2">из глубин океана</span>
                </h1>
                <p className="aqua-hero-description">
                  Революционная система генерации случайных чисел на основе наблюдения за морской жизнью. 
                  Камеры видеонаблюдения за рыбами создают истинно случайные числа для ваших нужд.
                </p>
                <div className="flex justify-center space-x-4 mt-8">
                  <a href="/generate" className="aqua-generate-btn">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
                    </svg>
                    Генерировать число
                  </a>
                  <a href="/analyze" className="aqua-how-btn">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" clipRule="evenodd"/>
                    </svg>
                    Анализатор
                  </a>
                </div>
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
      />
    </div>
  );
}