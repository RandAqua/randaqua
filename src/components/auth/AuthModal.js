'use client';

import { useState, useEffect, useRef } from 'react';
import TabSwitcher from './TabSwitcher';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default function AuthModal({ isOpen, onClose, initialTab = 'login', onVerificationSuccess, onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isHiding, setIsHiding] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('modal-open');
    } else {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Обработчик клика по вкладке
  const handleTabChange = (tabKey) => {
    console.log('Tab change requested:', tabKey);
    setActiveTab(tabKey);
  };

  const handleClose = () => {
    setIsHiding(true);
    setTimeout(() => {
      setIsHiding(false);
      onClose();
    }, 250);
  };

  const tabs = [
    { key: 'login', label: 'Вход' },
    { key: 'register', label: 'Регистрация' }
  ];

  useEffect(() => {
    if (isOpen && modalRef.current) {
      const modalEl = modalRef.current;
      const firstFocusable = modalEl.querySelector('input, button, [tabindex]:not([tabindex="-1"])');
      if (firstFocusable) {
        setTimeout(() => firstFocusable.focus(), 0);
      }
    }
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        ref={modalRef}
        className={`modal ${isHiding ? 'modal-hide' : ''}`}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="p-4 sm:p-6 md:p-8">
          <TabSwitcher 
            activeTab={activeTab} 
            onTabChange={handleTabChange} 
            tabs={tabs} 
          />
          {activeTab === 'login' ? (
            <LoginForm 
              onSwitchToRegister={() => setActiveTab('register')} 
              onLoginSuccess={onLoginSuccess}
            />
          ) : (
            <RegisterForm 
              onSwitchToLogin={() => setActiveTab('login')} 
              onVerificationSuccess={onVerificationSuccess}
            />
          )}
        </div>
      </div>
    </div>
  );
}
