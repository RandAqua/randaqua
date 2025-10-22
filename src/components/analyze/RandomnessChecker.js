"use client";

import { useState, useCallback, useEffect } from 'react';
import Navbar from '../layout/Navbar';
import AuthModal from '../auth/AuthModal';

export default function RandomnessChecker() {
  // Состояние для работы с файлами и текстом
  const [fileContent, setFileContent] = useState('');
  const [textContent, setTextContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  
  // Состояние процесса анализа
  const [isAnalyzingRandomness, setIsAnalyzingRandomness] = useState(false);
  const [randomnessResult, setRandomnessResult] = useState(null);
  const [error, setError] = useState(null);
  
  // Флаги для UI состояния
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [isTextEntered, setIsTextEntered] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  
  // Состояние авторизации
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');

  const handleFileChange = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) {
      setFileContent('');
      setTextContent('');
      setSelectedFile(null);
      setIsTextEntered(false);
      setIsFileSelected(false);
      return;
    }

    if (file.type !== 'text/plain') {
      setError('Пожалуйста, выберите файл .txt.');
      return;
    }

    setError(null);
    setSelectedFile(file);
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
    setSelectedFile(null);
    setIsTextEntered(text.length > 0);
    setIsFileSelected(false);
  }, []);


  const handleAnalyzeRandomnessClick = useCallback(async () => {
    setError(null);
    setRandomnessResult(null);
    setTestResults(null);

    if (!selectedFile && !textContent) {
      setError('Пожалуйста, выберите файл или введите текст для проверки на случайность.');
      return;
    }

    setIsAnalyzingRandomness(true);
    try {
      // Проверяем доступность сервера
      console.log('Проверяем доступность сервера анализа...');
      
      let response;
      
      if (selectedFile) {
        // Отправляем файл на сервер анализа
        const formData = new FormData();
        formData.append('file', selectedFile);
        
        console.log('Отправляем файл:', selectedFile.name, 'размер:', selectedFile.size);
        
        response = await fetch('/api/analyze-randomness', {
          method: 'POST',
          body: formData,
        });
      } else if (textContent) {
        // Создаем временный файл из текста
        const blob = new Blob([textContent], { type: 'text/plain' });
        const file = new File([blob], 'temp.txt', { type: 'text/plain' });
        
        const formData = new FormData();
        formData.append('file', file);
        
        console.log('Отправляем текстовый файл, размер:', file.size);
        
        response = await fetch('/api/analyze-randomness', {
          method: 'POST',
          body: formData,
        });
      } else {
        setError('Пожалуйста, выберите файл или введите текст для проверки на случайности.');
        return;
      }

      console.log('Ответ сервера получен, статус:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Ошибка сервера:', response.status, errorText);
        
        // Специальная обработка для разных статусов
        if (response.status === 404) {
          throw new Error('Endpoint не найден. Возможно, сервер не поддерживает этот API.');
        } else if (response.status === 405) {
          throw new Error('Метод не разрешен. Сервер не поддерживает POST запросы к этому endpoint.');
        } else if (response.status === 413) {
          throw new Error('Файл слишком большой для загрузки.');
        } else if (response.status >= 500) {
          throw new Error(`Ошибка сервера (${response.status}). Попробуйте позже.`);
        } else {
          throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
        }
      }

      const data = await response.json();
      
      // Обрабатываем ответ сервера
      if (data.success && data.analysis) {
        if (data.analysis.analysis_success) {
          // Анализ прошел успешно - парсим результаты
          const rawResponse = data.analysis.raw_response;
          let testResults = [];
          let isRandom = true;
          
          if (rawResponse && rawResponse.testResults) {
            testResults = rawResponse.testResults.map(test => ({
              testName: test.testName,
              passed: test.passed,
              statistic: test.statistic,
              pValue: test.pValue,
              description: test.description,
              additionalData: test.additionalData
            }));
            
            // Определяем общий результат - случайна ли последовательность
            // Если хотя бы один тест не пройден, считаем последовательность не случайной
            isRandom = testResults.every(test => test.passed);
          } else {
            // Fallback для старого формата
            const analysisResult = data.analysis.analysis_result || '';
            isRandom = analysisResult.toLowerCase().includes('random') || 
                      analysisResult.toLowerCase().includes('случайн');
            
            testResults = [{
              testName: 'Анализ случайности',
              passed: data.analysis.analysis_success,
              statistic: null,
              pValue: 0.5,
              description: analysisResult || 'Анализ завершен успешно',
              additionalData: data.analysis
            }];
          }
          
          setRandomnessResult(isRandom);
          setTestResults(testResults);
        } else {
          // Анализ не смог выполниться - показываем конкретную ошибку
          const errorMessage = data.analysis.analysis_error || 'Неизвестная ошибка';
          setRandomnessResult(null);
          
          // Проверяем, это ошибка размера файла или другая ошибка
          if (errorMessage.includes('File too small')) {
            setError('Файл слишком маленький для анализа. Минимум рекомендуется 25 цифр (100 бит).');
          } else if (errorMessage.includes('HTTP 400')) {
            setError('Ошибка анализа: файл не подходит для проверки случайности.');
          } else {
            setError(`Ошибка анализа: ${errorMessage}`);
          }
          
          // Показываем дополнительную информацию для отладки
          console.warn('Детали ошибки анализа:', {
            analysis_error: data.analysis.analysis_error,
            analysis_service_url: data.analysis.analysis_service_url,
            debug_info: data.analysis.debug_info
          });
        }
      } else {
        throw new Error(data.message || 'Ошибка при загрузке файла');
      }
    } catch (error) {
      console.error('Ошибка при анализе случайности:', error);
      
      // Более детальная обработка ошибок
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        setError('Ошибка подключения к серверу анализа. Возможные причины:\n• Проблемы с интернет-соединением\n• Сервер недоступен\n• Блокировка CORS политикой браузера\n\nПопробуйте позже или обратитесь к администратору.');
      } else if (error.message.includes('CORS')) {
        setError('Ошибка CORS: браузер блокирует запрос к внешнему серверу. Обратитесь к администратору для настройки прокси-сервера.');
      } else if (error.message.includes('timeout')) {
        setError('Превышено время ожидания ответа от сервера. Попробуйте еще раз.');
      } else {
        setError(`Не удалось проверить последовательность на случайность: ${error.message}`);
      }
    } finally {
      setIsAnalyzingRandomness(false);
    }
  }, [selectedFile, textContent]);

  const isRandomnessButtonActive = !!(selectedFile || textContent);

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
    <div className="w-full min-h-screen">
      <Navbar onLoginClick={openAuthModal} />
      
      {/* Основной контент */}
      <div className="w-full py-8 aqua-analyze-page">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <label htmlFor="fileInput" className={`aqua-how-btn inline-flex items-center ${isFileSelected ? 'opacity-50' : isTextEntered ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                  </svg>
                  {isTextEntered ? 'Файл заблокирован (введен текст)' : 'Выберите файл'}
                </label>
                <input
                  type="file"
                  accept=".txt"
                  onChange={handleFileChange}
                  className="hidden"
                  id="fileInput"
                  disabled={isTextEntered}
                />
                <div className={`mt-2 text-sm ${isFileSelected ? 'text-aqua-cyan' : isTextEntered ? 'aqua-warning-text' : 'text-aqua-white opacity-70'}`}>
                  {isFileSelected ? '✓ Файл выбран' : isTextEntered ? '⚠️ Файл заблокирован - введен текст' : 'Файл не выбран'}
                </div>
              </div>

              {/* Ввод текста */}
              <div className="relative">
                <textarea
                  className={`w-full p-4 rounded-lg bg-[#e7f5fb] bg-opacity-95 backdrop-blur-sm border-none text-slate-800 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-aqua-cyan focus:border-transparent resize-none ${isFileSelected ? 'opacity-50 cursor-not-allowed' : ''}`}
                  placeholder={isFileSelected ? "Текст заблокирован (выбран файл)" : "Или введите текст здесь..."}
                  value={textContent}
                  onChange={handleTextChange}
                  rows={6}
                  disabled={isFileSelected}
                />
                <div className={`mt-2 text-sm ${isTextEntered ? 'text-aqua-cyan' : isFileSelected ? 'aqua-warning-text' : 'text-aqua-white opacity-70'}`}>
                  {isTextEntered ? '✓ Текст введен' : isFileSelected ? '⚠️ Текст заблокирован - выбран файл' : 'Текст не введен'}
                </div>
              </div>

              {/* Кнопка проверки случайности */}
              <div className="flex justify-center gap-4">
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
                
                {(isFileSelected || isTextEntered) && (
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setTextContent('');
                      setFileContent('');
                      setIsFileSelected(false);
                      setIsTextEntered(false);
                      setError(null);
                      setRandomnessResult(null);
                      setTestResults(null);
                      setShowDetails(false);
                    }}
                    className="aqua-how-btn"
                  >
                    Очистить
                  </button>
                )}
              </div>

              {/* Результаты */}
              {error && (
                <div className="bg-red-500 text-white px-6 py-4 rounded-lg text-center text-lg font-semibold">
                  <div>
                    <h4 className="font-bold text-xl mb-2">Ошибка анализа</h4>
                    <p>{error}</p>
                  </div>
                </div>
              )}


              {randomnessResult !== null && (
                <div className="transform transition-all duration-1000 ease-out animate-slide-in-top">
                  {/* Основное сообщение */}
                  <div className={`stoloto-card p-8 mb-6 ${randomnessResult ? 'bg-teal-100' : 'bg-rose-100'} `}>
                    <div className="text-center">
                      <h2 className={`text-5xl font-black mb-4 tracking-wide ${randomnessResult ? 'text-teal-800' : 'text-[#225bfb]'}`}>
                        {randomnessResult ? 'Последовательность является случайной' : 'Последовательность не является случайной'}
                      </h2>
                    </div>
                  </div>
                  
                  {/* Кнопка "Подробнее" */}
                  <div className="flex justify-center mb-6">
                    <button
                      onClick={() => setShowDetails(!showDetails)}
                      className="aqua-how-btn"
                    >
                      {showDetails ? 'Скрыть подробности' : 'Подробнее'}
                    </button>
                  </div>
                </div>
              )}

              {testResults && showDetails && (
                <div className="stoloto-card p-8 transform transition-all duration-700 ease-out animate-slide-in-top bg-[#e7f5fb]">
                  <h3 className="text-2xl font-black mb-8 aqua-gradient-text text-center">
                    Результаты тестов на случайность
                  </h3>
                  
                  <div className="space-y-6">
                    {testResults.map((test, index) => (
                      <div key={index} className="stoloto-card p-6 transform transition-all duration-500 ease-out animate-slide-in-left bg-[#e7f5fb]" style={{animationDelay: `${index * 150}ms`}}>
                        {/* Заголовок теста */}
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-xl font-bold aqua-gradient-text">
                            {test.testName}
                          </h4>
                          <span className={`px-4 py-2 rounded-full text-sm font-bold w-32 text-center whitespace-nowrap ${
                            test.passed 
                              ? 'bg-green-200 text-green-900' 
                              : 'bg-red-200 text-red-900'
                          }`}>
                            {test.passed ? '✅ Пройден' : '❌ Не пройден'}
                          </span>
                        </div>
                        
                        {/* Статистика и p-значение */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          {test.statistic !== null && (
                            <div className="bg-white rounded-lg p-4 border border-gray-300">
                              <div className="text-sm text-teal-800 font-bold mb-2">Статистика</div>
                              <div className="text-xl font-mono text-blue-900 font-bold">
                                {typeof test.statistic === 'number' ? test.statistic.toFixed(6) : test.statistic}
                              </div>
                            </div>
                          )}
                          
                          <div className="bg-white rounded-lg p-4 border border-gray-300">
                            <div className="text-sm text-blue-800 font-bold mb-2">
                              P-значение {test.pValue >= 0.01 ? '(≥ 0.01 - случайны)' : '(< 0.01 - не случайны)'}
                            </div>
                            <div className={`text-xl font-mono font-bold ${
                              test.pValue >= 0.01 ? 'text-cyan-800' : 'text-red-800'
                            }`}>
                              {test.pValue.toFixed(8)}
                            </div>
                          </div>
                        </div>
                        
                        {/* Описание */}
                        <div className="bg-white rounded-lg p-4 mb-4 border border-gray-300">
                          <div className="text-sm text-blue-800 font-bold mb-2">Описание</div>
                          <div className="text-slate-800 font-medium">{test.description}</div>
                        </div>
                        
                        {/* Дополнительные данные - маленьким шрифтом */}
                        {test.additionalData && (
                          <div className="bg-white rounded-lg p-3 max-h-32 overflow-y-auto border border-gray-300">
                            <div className="text-xs text-teal-800 font-bold mb-2">Дополнительные данные</div>
                            <div className="text-xs text-slate-700 font-mono">
                              <pre className="whitespace-pre-wrap break-words">
                                {Object.entries(test.additionalData).map(([key, value]) => 
                                  `${key}: ${value}`
                                ).join('\n')}
                              </pre>
                            </div>
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
