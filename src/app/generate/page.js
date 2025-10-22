"use client";

import { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import AuthModal from '../../components/auth/AuthModal';
import { isAuthenticated } from '../../utils/auth';
import { generateBatch } from '../../config/api';

export default function GeneratePage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Form state
  const [count, setCount] = useState(1);
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [entropySource, setEntropySource] = useState('Камеры аквариумов (рыбки)');

  // Demo/computation state
  const [isComputing, setIsComputing] = useState(false);
  const [stage, setStage] = useState(0); // 0..3 stages
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState([]);
  const [generationData, setGenerationData] = useState(null); // Данные о генерации с сервера

  // Проверка авторизации при загрузке
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsUserAuthenticated(authenticated);
      setIsCheckingAuth(false);
    };
    
    checkAuth();
    
    // Проверяем авторизацию каждые 5 секунд
    const interval = setInterval(checkAuth, 5000);
    
    return () => clearInterval(interval);
  }, []);

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

  const handleLoginSuccess = () => {
    closeAuthModal();
    setIsUserAuthenticated(true);
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


  const validate = () => {
    if (min > max) return 'Минимум не может быть больше максимума';
    if (count < 1 || count > 10) return 'Количество должно быть от 1 до 10';
    return '';
  };

  const runComputation = async () => {
    const err = validate();
    if (err) {
      alert(err);
      return;
    }
    
    setIsComputing(true);
    setStage(0);
    setProgress(0);
    setResults([]);
    setGenerationData(null);

    try {
      // Показываем прогресс генерации
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const next = Math.min(90, prev + 10); // Останавливаем на 90% до получения результата
          if (next >= 90) {
            clearInterval(progressInterval);
          }
          return next;
        });
      }, 200);

      // Отправляем запрос на сервер
      const serverData = await generateBatch(count, min, max);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      // Устанавливаем результаты
      if (serverData.generatedNumbers) {
        setResults(serverData.generatedNumbers);
        setGenerationData(serverData);
      } else {
        throw new Error('Не удалось получить сгенерированные числа');
      }
      
    } catch (error) {
      console.error('Ошибка генерации:', error);
      alert(`Ошибка генерации: ${error.message}`);
    } finally {
      setIsComputing(false);
    }
  };

  const lenClass = (val) => `len-${String(val).length}`;

  const downloadFingerprint = () => {
    const payload = {
      timestamp: new Date().toISOString(),
      params: { count, min, max, entropySource },
      results,
      serverData: generationData, // Добавляем данные с сервера
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aquarng_fingerprint_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  // Показываем загрузку во время проверки авторизации
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen max-w-full overflow-x-hidden">
        <Navbar onLoginClick={openAuthModal} />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="aqua-loader mx-auto mb-4"></div>
            <p className="text-gray-600">Проверка авторизации...</p>
          </div>
        </div>
      </div>
    );
  }

  // Показываем сообщение для неавторизованных пользователей
  if (!isUserAuthenticated) {
    return (
      <div className="min-h-screen max-w-full overflow-x-hidden">
        <Navbar onLoginClick={openAuthModal} />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
              <div className="text-6xl mb-4">🔒</div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Требуется авторизация
              </h1>
              <p className="text-gray-600 mb-6">
                Эта страница предназначена только для авторизованных пользователей. 
                Пожалуйста, войдите в систему, чтобы продолжить.
              </p>
              <p className="text-sm text-gray-500">
                Используйте кнопки "Регистрация" или "Вход" в верхнем меню для авторизации.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-full overflow-x-hidden">
      {/* Основной контент */}
      <div className={`main-content ${isAuthModalOpen ? 'blur' : ''}`}>
        <Navbar onLoginClick={openAuthModal} />

        {/* Секция под хедером, заменена на форму */}
        <section className="aqua-hero-section auto-height">

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8 relative z-10 max-w-full overflow-x-hidden">
            <div className="text-center cartoon-appear" style={{ animationDelay: '120ms' }}>
              <h1 className="aqua-main-title generate-title">
                <span className="aqua-title-line1">Создать тираж</span>
                <span className="aqua-title-line2">истинной случайности</span>
              </h1>
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Form Card */}
              <div className="stoloto-card no-hover p-4 rounded-2xl cartoon-appear bg-white cursor-pointer w-110 h-100" style={{ animationDelay: '220ms' }}>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Параметры генерации</h3>
                <div className="space-y-3">
                  {/* Минимум и максимум на одном уровне */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Минимум</label>
                      <input type="number" value={min} onChange={(e) => setMin(parseInt(e.target.value || '0', 10))} className="w-full p-2 rounded-lg bg-white text-gray-900 border border-gray-200 focus:ring-2 focus:ring-blue-400 uniform-input" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Максимум</label>
                      <input type="number" value={max} onChange={(e) => setMax(parseInt(e.target.value || '0', 10))} className="w-full p-2 rounded-lg bg-white text-gray-900 border border-gray-200 focus:ring-2 focus:ring-blue-400 uniform-input" />
                    </div>
                  </div>

                  {/* Количество чисел */}
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Количество чисел</label>
                    <input type="number" min="1" max="10" value={count} onInput={(e) => { e.target.value = e.target.value.replace(/^0+(?=\d)/, ''); }} onChange={(e) => setCount(parseInt(e.target.value || '0', 10))} className="w-full p-2 rounded-lg bg-white text-gray-900 border border-gray-200 focus:ring-2 focus:ring-blue-400 uniform-input" />
                  </div>

                  {/* Источник энтропии - серый цвет, неизменяемый */}
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Источник энтропии</label>
                    <input type="text" value={entropySource} readOnly aria-readonly="true" className="w-full p-2 rounded-lg bg-gray-100 text-gray-500 border border-gray-200 focus:ring-0 uniform-input cursor-not-allowed" />
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3 justify-center">
                  <button onClick={runComputation} disabled={isComputing} className="aqua-generate-btn">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    {isComputing ? 'Генерация…' : 'Сгенерировать'}
                  </button>
                </div>

              </div>

              {/* Results / Visuals Card */}
              <div className="stoloto-card no-hover p-4 rounded-2xl cartoon-appear bg-white cursor-pointer w-110 h-100 flex flex-col" style={{ animationDelay: '320ms' }}>
                <h3 className="text-xl font-bold text-gray-900">Результат</h3>
                <div className="flex-1 flex flex-col justify-center">
                  {isComputing && (
                    <div className="mb-4 flex justify-center">
                      <div className="aqua-progress">
                        <div className="aqua-progress-track">
                          <div className="aqua-progress-bar" style={{ width: `${progress}%` }} />
                        </div>
                      </div>
                    </div>
                  )}
                  {results.length === 0 ? (
                    <div className="text-gray-600 text-center break-words max-w-full overflow-hidden">{isComputing ? 'Проводится генерация...' : 'Нажмите "Сгенерировать", чтобы получить выигрышные комбинации'}</div>
                  ) : (
                    <div>
                      <div className="flex flex-wrap gap-3 justify-center">
                        {results.map((n, idx) => (
                          <div key={idx} className={`lottery-number ${lenClass(n)} number-appear`}>{n}</div>
                        ))}
                      </div>
                      <p className="mt-3 text-sm text-gray-700 text-center">Источник энтропии: <span className="text-gray-900 font-semibold">{entropySource}</span></p>
                      
                      {/* Дополнительная информация с сервера */}
                      {generationData && (
                        <div className="mt-3 text-xs text-gray-600 text-center space-y-1">
                          {generationData.seed && (
                            <div>Seed: <span className="font-mono">{generationData.seed}</span></div>
                          )}
                          {generationData.entropy_quality && (
                            <div>Качество случайности: <span className="font-semibold">{(generationData.entropy_quality.randomness_score * 100).toFixed(1)}%</span></div>
                          )}
                          {generationData.processing_time && (
                            <div>Время обработки: <span className="font-semibold">{generationData.processing_time}мс</span></div>
                          )}
                        </div>
                      )}

                      {/* Download fingerprint button, appears after numbers */}
                      <div className="mt-3 flex justify-center">
                        {results.length > 0 && (
                          <button onClick={downloadFingerprint} className="number-appear flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21.44 11.05l-7.07 7.07a5 5 0 11-7.07-7.07l7.07-7.07a3.5 3.5 0 114.95 4.95l-7.07 7.07a2 2 0 01-2.83-2.83l6.36-6.36" />
                            </svg>
                            Скачать цифровой слепок
                          </button>
                        )}
                      </div>
                    </div>
                  )}
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
        onVerificationSuccess={handleVerificationSuccess}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
