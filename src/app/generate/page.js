"use client";

import { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import AuthModal from '../../components/auth/AuthModal';
import { generateBatch } from '../../config/api';
import { addToHistory } from '../../utils/historyStorage';

export default function GeneratePage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');

  // Состояние формы для параметров генерации
  const [count, setCount] = useState(1);
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [entropySource, setEntropySource] = useState('Камеры аквариумов (рыбки)');

  // Состояние процесса генерации и результатов
  const [isComputing, setIsComputing] = useState(false);
  const [stage, setStage] = useState(0); // 0..3 этапа
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState([]);
  const [generationData, setGenerationData] = useState(null); // Данные о генерации с сервера

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
    // Проверяем корректность введенных параметров
    if (min > max) return 'Минимум не может быть больше максимума';
    if (count < 1) return 'Количество должно быть больше 0';
    if (count > 10000) return 'Количество не должно превышать 10000 для оптимальной производительности';
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
      // Симулируем прогресс генерации для UX
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const next = Math.min(90, prev + 10); // Останавливаем на 90% до получения результата
          if (next >= 90) {
            clearInterval(progressInterval);
          }
          return next;
        });
      }, 200);

      // Вызываем API для генерации случайных чисел
      const serverData = await generateBatch(count, min, max);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      // Устанавливаем результаты
      if (serverData.generatedNumbers) {
        setResults(serverData.generatedNumbers);
        setGenerationData(serverData);
        
        // Сохраняем в LocalStorage
        addToHistory({
          numbers: serverData.generatedNumbers,
          min,
          max,
          count,
          entropySource,
          serverData,
        });
      } else {
        throw new Error('Не удалось получить сгенерированные числа');
      }
      
    } catch (error) {
      console.error('Ошибка генерации:', error);
      
      // Более детальная обработка ошибок
      let errorMessage = 'Произошла ошибка при генерации случайных чисел.';
      
      if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Не удается подключиться к серверу генерации. Проверьте подключение к интернету.';
      } else if (error.message.includes('HTTP error')) {
        errorMessage = `Ошибка сервера: ${error.message}`;
      } else if (error.message.includes('CORS')) {
        errorMessage = 'Ошибка доступа к серверу. Попробуйте обновить страницу.';
      } else {
        errorMessage = `Ошибка генерации: ${error.message}`;
      }
      
      alert(errorMessage);
    } finally {
      setIsComputing(false);
    }
  };

  const lenClass = (val) => `len-${String(val).length}`;

  const downloadFingerprint = async () => {
    if (!generationData || !generationData.external_response || !generationData.external_response.fileUrl) {
      alert('Цифровой слепок недоступен. Попробуйте сгенерировать числа заново.');
      return;
    }

    try {
      // Создаем невидимую ссылку для скачивания файла с сервера
      const link = document.createElement('a');
      link.href = generationData.external_response.fileUrl;
      link.download = `aquarng_fingerprint_${generationData.seed || Date.now()}.json`;
      link.target = '_blank'; // Открываем в новой вкладке для обхода CORS
      
      // Добавляем ссылку в DOM и кликаем
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Ошибка при скачивании цифрового слепка:', error);
      alert('Не удалось скачать цифровой слепок. Попробуйте обновить страницу и сгенерировать числа заново.');
    }
  };

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
              {/* Карточка формы */}
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
                    <input type="number" min="1" value={count} onInput={(e) => { e.target.value = e.target.value.replace(/^0+(?=\d)/, ''); }} onChange={(e) => setCount(parseInt(e.target.value || '0', 10))} className="w-full p-2 rounded-lg bg-white text-gray-900 border border-gray-200 focus:ring-2 focus:ring-blue-400 uniform-input" />
                    <p className="text-xs text-gray-500 mt-1">Максимум: 10000 для оптимальной производительности</p>
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

              {/* Карточка результатов / визуализации */}
              <div className="stoloto-card no-hover p-4 rounded-2xl cartoon-appear bg-white cursor-pointer w-110 h-100 flex flex-col" style={{ animationDelay: '320ms' }}>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Результат</h3>
                <div className="flex-1 flex flex-col min-h-0">
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
                    <div className="text-gray-600 text-center break-words max-w-full overflow-hidden flex-1 flex items-center justify-center">{isComputing ? 'Проводится генерация...' : 'Нажмите "Сгенерировать", чтобы получить выигрышные комбинации'}</div>
                  ) : (
                    <div className="flex flex-col h-full min-h-0">
                      {/* Контейнер с прокруткой для чисел */}
                      <div className="flex-1 overflow-y-auto max-h-96 mb-3 results-scroll-container">
                        <div className="flex flex-wrap gap-2 justify-center p-2">
                          {results.map((n, idx) => (
                            <div key={idx} className={`lottery-number ${lenClass(n)} ${results.length > 100 ? 'compact' : ''} number-appear`}>{n}</div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Информация о генерации - фиксированная внизу */}
                      <div className="flex-shrink-0 space-y-2">

                        
                        {/* Дополнительная информация с сервера */}
                        {generationData && (
                          <div className="text-xs text-gray-600 text-center space-y-1">
                            {generationData.entropy_quality && (
                              <div>Качество случайности: <span className="font-semibold">{(generationData.entropy_quality.randomness_score * 100).toFixed(1)}%</span></div>
                            )}
                          </div>
                        )}

                        {/* Кнопка загрузки отпечатка */}
                        <div className="flex justify-center">
                          {results.length > 0 && (
                            <button onClick={downloadFingerprint} className="aqua-generate-btn number-appear flex items-center gap-2">
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21.44 11.05l-7.07 7.07a5 5 0 11-7.07-7.07l7.07-7.07a3.5 3.5 0 114.95 4.95l-7.07 7.07a2 2 0 01-2.83-2.83l6.36-6.36" />
                              </svg>
                              Скачать цифровой слепок
                            </button>
                          )}
                        </div>
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
