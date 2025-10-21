"use client";

import { useState, useCallback, useEffect } from 'react';
import Navbar from '../layout/Navbar';
import AuthModal from '../auth/AuthModal';

export default function RandomnessChecker() {
  const [fileContent, setFileContent] = useState('');
  const [textContent, setTextContent] = useState('');
  const [isAnalyzingRandomness, setIsAnalyzingRandomness] = useState(false);
  const [randomnessResult, setRandomnessResult] = useState(null);
  const [error, setError] = useState(null);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [isTextEntered, setIsTextEntered] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');

  const handleFileChange = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) {
      setFileContent('');
      setTextContent('');
      setIsTextEntered(false);
      setIsFileSelected(false);
      return;
    }

    if (file.type !== 'text/plain') {
      setError('Пожалуйста, выберите файл .txt.');
      return;
    }

    setError(null);
    const reader = new FileReader();

    reader.onload = (e) => {
      setFileContent(e.target.result);
      setTextContent('');
      setIsFileSelected(true);
      setIsTextEntered(false);
    };

    reader.onerror = () => {
      setError('Ошибка чтения файла.');
      setIsFileSelected(false);
    };

    reader.readAsText(file);
  }, []);

  const handleTextChange = useCallback((event) => {
    const text = event.target.value;
    setTextContent(text);
    setFileContent('');
    setIsTextEntered(text.length > 0);
    setIsFileSelected(false);
  }, []);


  const handleAnalyzeRandomnessClick = useCallback(async () => {
    setError(null);
    setRandomnessResult(null);
    setTestResults(null);

    let contentToAnalyze = fileContent || textContent;

    if (!contentToAnalyze) {
      setError('Пожалуйста, выберите файл или введите текст для проверки на случайность.');
      return;
    }

    setIsAnalyzingRandomness(true);
    try {
      const response = await fetch('/api/checkRandomness', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: contentToAnalyze }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setRandomnessResult(data.isRandom);
      setTestResults(data.testResults);
    } catch (error) {
      setError('Не удалось проверить последовательность на случайность. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsAnalyzingRandomness(false);
    }
  }, [fileContent, textContent]);

  const isRandomnessButtonActive = !!(fileContent || textContent) && !isAnalyzingRandomness;

  // Обработчики для модального окна аутентификации
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
      <Navbar onLoginClick={openAuthModal} />
      
      {/* Героическая секция с анализатором */}
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
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 aqua-text-container">
            <div className="text-center">
              <h1 className="aqua-main-title">
                <span className="aqua-title-line1">Проверить случайность</span>
                <span className="aqua-title-line2">последовательности</span>
              </h1>
              <p className="aqua-hero-description">
                Проверяйте случайность ваших текстовых файлов и последовательностей. 
                Мощные алгоритмы анализа в стиле морских глубин.
              </p>

              {/* Область ввода */}
              <div className="max-w-4xl mx-auto mt-8 space-y-6">
                {/* Выбор файла */}
                <div className="relative">
                  <label htmlFor="fileInput" className="aqua-generate-btn cursor-pointer inline-flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                    </svg>
                    Выберите файл
                  </label>
                  <input
                    type="file"
                    accept=".txt"
                    onChange={handleFileChange}
                    className="hidden"
                    id="fileInput"
                  />
                  <div className={`mt-2 text-sm ${isFileSelected ? 'text-aqua-cyan' : 'text-aqua-white opacity-70'}`}>
                    {isFileSelected ? '✓ Файл выбран' : 'Файл не выбран'}
                  </div>
                </div>

                {/* Ввод текста */}
                <div className="relative">
                  <textarea
                    className="w-full p-4 rounded-lg bg-white bg-opacity-95 backdrop-blur-sm border border-white border-opacity-30 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-aqua-cyan focus:border-transparent resize-none shadow-lg"
                    placeholder="Или введите текст здесь..."
                    value={textContent}
                    onChange={handleTextChange}
                    rows={6}
                  />
                  <div className={`mt-2 text-sm ${isTextEntered ? 'text-aqua-cyan' : 'text-aqua-white opacity-70'}`}>
                    {isTextEntered ? '✓ Текст введен' : 'Текст не введен'}
                  </div>
                </div>

                {/* Кнопка проверки случайности */}
                <div className="flex justify-center">
                  <button
                    onClick={handleAnalyzeRandomnessClick}
                    disabled={!isRandomnessButtonActive || isAnalyzingRandomness}
                    className={`aqua-how-btn ${!isRandomnessButtonActive || isAnalyzingRandomness ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    {isAnalyzingRandomness ? 'Проверка...' : 'Проверить случайность'}
                  </button>
                </div>

                {/* Результаты */}
                {error && (
                  <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}


                {randomnessResult !== null && (
                  <div className={`px-4 py-3 rounded-lg border ${randomnessResult ? 'bg-green-500 bg-opacity-20 border-green-500 text-green-200' : 'bg-red-500 bg-opacity-20 border-red-500 text-red-200'}`}>
                    <strong>Результат проверки случайности:</strong> {randomnessResult ? 'Последовательность случайная' : 'Последовательность не случайная'}
                  </div>
                )}

                {testResults && (
                  <div className="bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 text-aqua-white px-6 py-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-aqua-cyan">Результаты тестов на случайность:</h3>
                    <div className="space-y-4">
                      {testResults.map((test, index) => (
                        <div key={index} className="border-b border-white border-opacity-20 pb-3 last:border-b-0">
                          <div className="flex items-center justify-between mb-2">
                            <strong className="text-aqua-cyan">{test.testName}</strong>
                            <span className={`px-2 py-1 rounded text-sm ${test.passed ? 'bg-green-500 bg-opacity-20 text-green-200' : 'bg-red-500 bg-opacity-20 text-red-200'}`}>
                              {test.passed ? 'Пройден' : 'Не пройден'}
                            </span>
                          </div>
                          <div className="text-sm opacity-80 mb-1">
                            <strong>P-значение:</strong> {test.pValue.toFixed(6)}
                          </div>
                          <div className="text-sm opacity-80">
                            <strong>Описание:</strong> {test.description}
                          </div>
                          {test.additionalData && (
                            <div className="mt-2 text-xs opacity-60">
                              <strong>Дополнительные данные:</strong>
                              <pre className="mt-1 bg-black bg-opacity-20 p-2 rounded overflow-x-auto">
                                {JSON.stringify(test.additionalData, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Модальное окно авторизации */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialTab={authModalTab}
        onVerificationSuccess={handleVerificationSuccess}
      />
    </div>
  );
}
