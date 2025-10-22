'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../components/layout/Navbar';
import AuthModal from '../../components/auth/AuthModal';

export default function HowItWorks() {
  // Состояние демонстрации алгоритма
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [generatedNumber, setGeneratedNumber] = useState(null);
  
  // Состояние авторизации
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');
  
  // Данные для визуализации (генерируются случайно для демо)
  const [randomValues, setRandomValues] = useState({});
  const [isClient, setIsClient] = useState(false);
  
  // Описание этапов работы алгоритма RandAqua
  const steps = [
    {
      title: "Наблюдение за рыбками",
      description: "Специализированные подводные камеры высокого разрешения непрерывно фиксируют движение морских обитателей в их естественной среде обитания. Система отслеживает координаты, скорость и направление движения каждой рыбки в реальном времени.",
      icon: "🐟"
    },
    {
      title: "Анализ траекторий",
      description: "Алгоритмы машинного обучения анализируют полученные данные о движении рыбок, вычисляя математические параметры: скорость, ускорение, угловую скорость, кривизну траектории и другие характеристики, которые создают уникальные паттерны движения.",
      icon: "📊"
    },
    {
      title: "Извлечение энтропии",
      description: "Из хаотичного и непредсказуемого движения морских обитателей извлекается истинная энтропия - фундаментальная случайность природы.",
      icon: "⚡"
    },
    {
      title: "Генерация числа",
      description: "На основе извлеченной энтропии создается криптографически стойкое случайное число, которое невозможно предсказать или воспроизвести.",
      icon: "🎲"
    },
  ];

  // Инициализация случайных значений для демонстрации
  useEffect(() => {
    setIsClient(true);
    setRandomValues({
      fish1: { x: Math.floor(Math.random() * 100), y: Math.floor(Math.random() * 100) },
      fish2: { x: Math.floor(Math.random() * 100), y: Math.floor(Math.random() * 100) },
      fish3: { x: Math.floor(Math.random() * 100), y: Math.floor(Math.random() * 100) },
      fish4: { x: Math.floor(Math.random() * 100), y: Math.floor(Math.random() * 100) },
      speed: (Math.random() * 5).toFixed(2),
      direction: Math.floor(Math.random() * 360),
      acceleration: (Math.random() * 2).toFixed(2),
      hash1: Math.random().toString(16).substr(2, 8),
      hash2: Date.now().toString(16).slice(-8),
      hash3: Math.random().toString(16).substr(2, 8)
    });
  }, []);

  const startDemo = () => {
    setIsRunning(true);
    setCurrentStep(0);
    setGeneratedNumber(null);
    
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length) { // Изменено с steps.length - 1 на steps.length
          clearInterval(stepInterval);
          setIsRunning(false);
          const randomValue = Math.floor(Math.random() * 1000000);
          setGeneratedNumber(randomValue);
          return steps.length; // Устанавливаем значение больше количества шагов для полного прогресса
        }
        return prev + 1;
      });
    }, 2000);
  };

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
    <div className="min-h-screen overflow-x-hidden">
      <Navbar onLoginClick={openAuthModal} />
      <div className="aqua-text-container py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* Демонстрация алгоритма RandAqua - сверху */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 w-full flex flex-col" style={{ height: '485.76px' }}>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Демонстрация алгоритма RandAqua
                </h1>
              </div>

              {/* Шаги алгоритма - горизонтально */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 flex-1 items-center">
                {/* Первые три блока */}
                {steps.slice(0, 3).map((step, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border-2 transition-all duration-500 aspect-square ${
                      currentStep === index
                        ? 'border-blue-500 bg-blue-50 shadow-lg'
                        : currentStep > index
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="text-center h-full flex flex-col">
                      <div className={`text-2xl mb-2 ${currentStep >= index ? 'animate-bounce' : ''}`}>
                        {step.icon}
                      </div>
                      <h3 className={`text-sm font-bold mb-2 ${
                        currentStep === index ? 'text-blue-700' : 
                        currentStep > index ? 'text-blue-700' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </h3>
                      <p className={`text-xs leading-relaxed ${
                        currentStep === index ? 'text-blue-600' : 
                        currentStep > index ? 'text-blue-600' : 'text-gray-400'
                      }`}>
                        {step.description}
                      </p>
                      
                      {/* Прогресс-бар для каждого этапа */}
                      <div className="mt-auto">
                        <div className="w-full bg-gray-200 rounded-full h-2 shadow-inner aqua-demo-progress">
                          <div 
                            className={`h-2 rounded-full aqua-demo-progress-bar ${
                              currentStep > index 
                                ? 'bg-gradient-to-r from-green-400 to-green-600 completed' 
                                : currentStep === index 
                                ? 'bg-gradient-to-r from-blue-400 to-blue-600 active' 
                                : 'bg-gray-300'
                            }`}
                            style={{ 
                              width: currentStep > index ? '100%' : 
                                     currentStep === index ? '75%' : '0%' 
                            }}
                          ></div>
                        </div>
                        <div className={`text-xs mt-1 font-medium aqua-demo-status ${
                          currentStep > index ? 'text-green-600' : 
                          currentStep === index ? 'text-blue-600' : 'text-gray-400'
                        }`}>
                          {currentStep > index ? 'Завершено' : 
                           currentStep === index ? 'Выполняется...' : 'Ожидание'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Блок "Генерация случайного числа" */}
                <div className={`p-3 rounded-lg border-2 transition-all duration-500 aspect-square ${
                  currentStep === 3
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : currentStep > 3
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="text-center h-full flex flex-col">
                    <div className={`text-2xl mb-2 ${currentStep >= 3 ? 'animate-bounce' : ''}`}>
                      🎲
                    </div>
                    <h3 className={`text-sm font-bold mb-2 ${
                      currentStep === 3 ? 'text-blue-700' : 
                      currentStep > 3 ? 'text-blue-700' : 'text-gray-500'
                    }`}>
                      Генерация случайного числа
                    </h3>
                    <p className={`text-xs leading-relaxed ${
                      currentStep === 3 ? 'text-blue-600' : 
                      currentStep > 3 ? 'text-blue-600' : 'text-gray-400'
                    }`}>
                      На основе извлеченной энтропии создается криптографически стойкое случайное число, которое невозможно предсказать или воспроизвести. Полученное число проходит строгие тесты на случайность.
                    </p>
                    
                    {/* Прогресс-бар для генерации числа */}
                    <div className="mt-auto">
                      <div className="w-full bg-gray-200 rounded-full h-2 shadow-inner aqua-demo-progress">
                        <div 
                          className={`h-2 rounded-full aqua-demo-progress-bar ${
                            currentStep > 3 
                              ? 'bg-gradient-to-r from-green-400 to-green-600 completed' 
                              : currentStep === 3 
                              ? 'bg-gradient-to-r from-blue-400 to-blue-600 active' 
                              : 'bg-gray-300'
                          }`}
                          style={{ 
                            width: currentStep > 3 ? '100%' : 
                                   currentStep === 3 ? '75%' : '0%' 
                          }}
                        ></div>
                      </div>
                      <div className={`text-xs mt-1 font-medium aqua-demo-status ${
                        currentStep > 3 ? 'text-green-600' : 
                        currentStep === 3 ? 'text-blue-600' : 'text-gray-400'
                      }`}>
                        {currentStep > 3 ? 'Завершено' : 
                         currentStep === 3 ? 'Выполняется...' : 'Ожидание'}
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>

            </div>

            {/* Наглядная демонстрация - снизу */}
            <div className="bg-gradient-to-br from-white/95 to-blue-50/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-6 w-full flex flex-col" style={{ height: '485.76px' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Наглядная демонстрация
                </h2>
                
                {/* Кнопка запуска */}
                <button
                  onClick={startDemo}
                  disabled={isRunning}
                  className={`aqua-generate-btn text-lg px-8 py-4 ${
                    isRunning ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
                  }`}
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
                  </svg>
                  {isRunning ? 'Демонстрация запущена...' : 'Запустить демонстрацию'}
                </button>
              </div>
              
              {/* Визуализация процесса - горизонтально */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 flex-1 min-h-0 items-center">
                {/* Этап 1: Наблюдение за рыбами */}
                <div className={`p-3 rounded-lg border-2 transition-all duration-700 aspect-square ${
                  currentStep >= 0 ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg' : 'border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100'
                }`}>
                  <div className="text-center h-full flex flex-col ">
                    <div className={`text-2xl mb-2 ${currentStep >= 0 ? 'animate-bounce' : ''}`}>🐟</div>
                    <h3 className="text-sm font-bold text-blue-800 mb-2">Наблюдение за рыбками</h3>
                    <div className="grid grid-cols-2 gap-1 mb-2">
                      {[1, 2, 3, 4].map((fish) => (
                        <div key={fish} className={`text-center p-1 rounded-sm transition-all duration-300 ${
                          currentStep >= 0 ? 'bg-blue-200 animate-pulse shadow-md' : 'bg-gray-200'
                        }`}>
                          <div className="text-xs mb-1">🐠</div>
                           <div className="text-xs font-mono text-gray-700">
                             {currentStep >= 0 && isClient ? `x:${randomValues[`fish${fish}`]?.x || '---'}, y:${randomValues[`fish${fish}`]?.y || '---'}` : '---'}
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Этап 2: Анализ траекторий */}
                <div className={`p-3 rounded-lg border-2 transition-all duration-700 aspect-square ${
                  currentStep >= 1 ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg' : 'border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100'
                }`}>
                  <div className="text-center h-full flex flex-col">
                    <div className={`text-2xl mb-2 ${currentStep >= 1 ? 'animate-bounce' : ''}`}>📊</div>
                    <h3 className="text-sm font-bold text-blue-800 mb-2">Анализ траекторий</h3>
                    <div className="space-y-1 mb-2">
                      <div className="flex justify-between items-center p-1 bg-white/60 rounded-sm">
                        <span className="text-blue-700 font-medium text-xs">Скорость:</span>
                         <span className="font-mono text-blue-600 font-bold text-xs">
                           {currentStep >= 1 && isClient ? `${randomValues.speed} м/с` : '---'}
                         </span>
                      </div>
                      <div className="flex justify-between items-center p-1 bg-white/60 rounded-sm">
                        <span className="text-blue-700 font-medium text-xs">Направление:</span>
                        <span className="font-mono text-blue-600 font-bold text-xs">
                          {currentStep >= 1 && isClient ? `${randomValues.direction}°` : '---'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-1 bg-white/60 rounded-sm">
                        <span className="text-blue-700 font-medium text-xs">Ускорение:</span>
                        <span className="font-mono text-blue-600 font-bold text-xs">
                          {currentStep >= 1 && isClient ? `${randomValues.acceleration} м/с²` : '---'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Этап 3: Извлечение энтропии */}
                <div className={`p-3 rounded-lg border-2 transition-all duration-700 aspect-square ${
                  currentStep >= 2 ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg' : 'border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100'
                }`}>
                  <div className="text-center h-full flex flex-col">
                    <div className={`text-2xl mb-2 ${currentStep >= 2 ? 'animate-bounce' : ''}`}>⚡</div>
                    <h3 className="text-sm font-bold text-blue-800 mb-2">Извлечение энтропии</h3>
                      <div className="text-left bg-gradient-to-br from-gray-900 to-gray-800 text-green-400 p-2 rounded-sm font-mono text-xs shadow-inner border border-gray-700 mb-2">
                      <div className="text-green-300">SHA-256(</div>
                      <div className="ml-1 text-green-300">concat(</div>
                       <div className="ml-1 text-green-400">
                         рыбки_data: {currentStep >= 2 && isClient ? '0x' + randomValues.hash1 : '--------'}
                       </div>
                       <div className="ml-1 text-green-400">
                         timestamp: {currentStep >= 2 && isClient ? randomValues.hash2 : '--------'}
                       </div>
                       <div className="ml-1 text-green-400">
                         vectors: {currentStep >= 2 && isClient ? '0x' + randomValues.hash3 : '--------'}
                       </div>
                      <div className="ml-1 text-green-300">)</div>
                      <div className="text-green-300">)</div>
                    </div>
                  </div>
                </div>

                {/* Этап 4: Генерация числа */}
                <div className={`p-3 rounded-lg border-2 transition-all duration-700 aspect-square ${
                  currentStep >= 3 ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg' : 'border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100'
                }`}>
                  <div className="text-center h-full flex flex-col">
                    <div className={`text-2xl mb-2 ${currentStep >= 3 ? 'animate-bounce' : ''}`}>🎲</div>
                    <h3 className="text-sm font-bold text-blue-800 mb-2">Генерация числа</h3>
                    <div className="bg-gradient-to-br from-purple-400 to-purple-600 text-white p-2 rounded-sm text-center shadow-inner mb-2">
                      <div className="text-sm font-mono font-bold">
                        {generatedNumber ? generatedNumber : '---'}
                      </div>
                      <div className="text-xs text-purple-100 mt-1">
                        {currentStep >= 3 ? 'Сгенерировано!' : 'Ожидание...'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Прогресс-бар */}
              <div className="mt-2 flex-shrink-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-600">Прогресс демонстрации</span>
                  <span className="text-sm font-bold text-blue-600">
                    {currentStep >= steps.length ? steps.length : currentStep} из {steps.length} этапов
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 shadow-inner">
                  <div 
                    className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-1.5 rounded-full transition-all duration-700 shadow-lg"
                    style={{ width: `${Math.min(((currentStep) / steps.length) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

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
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}




