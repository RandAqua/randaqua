"use client";

import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import AuthModal from '../../components/AuthModal';
import WheelOfFortune from '../../components/wheel-of-fortune';

export default function GeneratePage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');
  const [showWheel, setShowWheel] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);

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

  const handleWheelClick = () => {
    if (isSpinning) return;
    setResult(null);
    setIsSpinning(true);
    // Рыба ~1.6с, старт спина в центре, 0.2с разгон + 3с ровно + 2с плавная остановка
    // Итоговое время: 0.8с (до центра) + 0.6с + 2.6с + 2.2с ≈ 6.2с
    setTimeout(() => {
      const randomNumber = Math.floor(Math.random() * 100) + 1;
      setResult(randomNumber);
      setIsSpinning(false);
    }, 6400);
  };

  const handleReset = () => {
    setShowWheel(false);
    setIsSpinning(false);
    setResult(null);
  };

  return (
    <div className="min-h-screen aqua-background">
      {/* Основной контент */}
      <div className={`main-content ${isAuthModalOpen ? 'blur' : ''}`}>
        <Navbar onLoginClick={openAuthModal} />
        
        {/* Секция под хедером, оптимизирована под десктоп */}
        <section className="aqua-hero-section aqua-under-header">
          <div className="aqua-fish-background aqua-under-header">
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
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 aqua-text-container aqua-under-header">
              <div className="text-center">
                <h1 className="aqua-main-title generate-title">
                  <span className="aqua-title-line1">Генерация чисел</span>
                  <span className="aqua-title-line2">с помощью рыб</span>
                </h1>
                <div className="mt-4">
                  <WheelOfFortune 
                    isSpinning={isSpinning}
                    result={result}
                    onReset={handleReset}
                    onWheelClick={handleWheelClick}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Модальное окно авторизации */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialTab={authModalTab}
      />
    </div>
  );
}
