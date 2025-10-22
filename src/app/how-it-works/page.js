'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/layout/Navbar';

export default function HowItWorks() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [generatedNumber, setGeneratedNumber] = useState(null);
  
  const steps = [
    {
      title: "Наблюдение за рыбами",
      description: "Камеры фиксируют движение морских обитателей в реальном времени",
      icon: "🐟"
    },
    {
      title: "Анализ траекторий",
      description: "Алгоритм анализирует координаты и скорость движения рыб",
      icon: "📊"
    },
    {
      title: "Извлечение энтропии",
      description: "Из хаотичного движения извлекается истинная случайность",
      icon: "⚡"
    },
    {
      title: "Генерация числа",
      description: "Создается криптографически стойкое случайное число",
      icon: "🎲"
    },
  ];

  const startDemo = () => {
    setIsRunning(true);
    setCurrentStep(0);
    setGeneratedNumber(null);
    
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(stepInterval);
          setIsRunning(false);
          const randomValue = Math.floor(Math.random() * 1000000);
          setGeneratedNumber(randomValue);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen aqua-background overflow-x-hidden">
      <Navbar />
      <div className="aqua-fish-background-container">
        <div className="aqua-fish-background">
        {/* Плавающие элементы для фона */}
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
        <div className="aqua-fish-14">🦀</div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 aqua-text-container py-16">
          <div className="space-y-8">
            {/* Демонстрация алгоритма AquaRNG - сверху */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 w-full flex flex-col" style={{ height: '485.76px' }}>
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-blue-900">
                  Демонстрация алгоритма AquaRNG
              </h1>
                <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center aqua-drop-icon">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5z"/>
                      </svg>
                    </div>
                    <span className="text-lg font-bold">AquaRNG</span>
                  </div>
                </Link>
              </div>
              
              <p className="text-gray-600 mb-6">
                Посмотрите, как работает наша революционная система генерации случайных чисел
              </p>

              {/* Кнопка запуска */}
              <div className="flex justify-center mb-6">
                <button
                  onClick={startDemo}
                  disabled={isRunning}
                  className={`aqua-generate-btn text-base px-8 py-4 ${
                    isRunning ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
                  }`}
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
                  </svg>
                  {isRunning ? 'Демонстрация запущена...' : 'Запустить демонстрацию'}
                </button>
              </div>

              {/* Шаги алгоритма - горизонтально */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 flex-1">
                {/* Первые три блока */}
                {steps.slice(0, 3).map((step, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border-2 transition-all duration-500 ${
                      currentStep === index
                        ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                        : currentStep > index
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`text-3xl mb-3 ${currentStep >= index ? 'animate-bounce' : ''}`}>
                        {step.icon}
                      </div>
                      <h3 className={`text-lg font-semibold mb-3 ${
                        currentStep === index ? 'text-blue-700' : 
                        currentStep > index ? 'text-green-700' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </h3>
                      <p className={`text-sm leading-relaxed ${
                        currentStep === index ? 'text-blue-600' : 
                        currentStep > index ? 'text-green-600' : 'text-gray-400'
                      }`}>
                        {step.description}
                      </p>
                      {currentStep > index && (
                        <div className="text-green-500 text-xl mt-3">✓</div>
                      )}
                    </div>
                  </div>
                ))}
                
                {/* Блок "Генерация случайного числа" */}
                <div className={`p-3 rounded-lg border-2 transition-all duration-500 ${
                  currentStep === 3
                    ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                    : currentStep > 3
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="text-center">
                    <div className={`text-3xl mb-3 ${currentStep >= 3 ? 'animate-bounce' : ''}`}>
                      🎲
                    </div>
                    <h3 className={`text-lg font-semibold mb-3 ${
                      currentStep === 3 ? 'text-blue-700' : 
                      currentStep > 3 ? 'text-green-700' : 'text-gray-500'
                    }`}>
                      Генерация случайного числа
                    </h3>
                    <p className={`text-sm leading-relaxed ${
                      currentStep === 3 ? 'text-blue-600' : 
                      currentStep > 3 ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      Создается криптографически стойкое случайное число
                    </p>
                    {currentStep > 3 && (
                      <div className="text-green-500 text-xl mt-3">✓</div>
                    )}
                  </div>
                </div>
                
              </div>

            </div>

            {/* Наглядная демонстрация - снизу */}
            <div className="bg-gradient-to-br from-white/95 to-blue-50/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-6 w-full flex flex-col" style={{ height: '485.76px' }}>
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Наглядная демонстрация
                </h2>
                <p className="text-gray-600 text-sm">Интерактивная визуализация процесса генерации случайных чисел</p>
              </div>
              
              {/* Визуализация процесса - горизонтально */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 flex-1">
                {/* Этап 1: Наблюдение за рыбами */}
                <div className={`p-2 rounded-lg border-2 transition-all duration-700 transform hover:scale-105 aspect-square ${
                  currentStep >= 0 ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg' : 'border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100'
                }`}>
                  <div className="text-center mb-2">
                    <div className={`text-xl mb-1 ${currentStep >= 0 ? 'animate-bounce' : ''}`}>🐟</div>
                    <h3 className="text-xs font-bold text-blue-800 mb-1">Наблюдение за рыбами</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-1 mb-2">
                    {[1, 2, 3, 4].map((fish) => (
                      <div key={fish} className={`text-center p-1 rounded-sm transition-all duration-300 ${
                        currentStep >= 0 ? 'bg-blue-200 animate-pulse shadow-md' : 'bg-gray-200'
                      }`}>
                        <div className="text-xs mb-1">🐠</div>
                        <div className="text-xs font-mono text-gray-700">
                          {currentStep >= 0 ? `x:${Math.floor(Math.random() * 100)}, y:${Math.floor(Math.random() * 100)}` : '---'}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 text-center leading-tight">
                    Камеры фиксируют координаты и движение рыб в реальном времени
                  </p>
                </div>

                {/* Этап 2: Анализ траекторий */}
                <div className={`p-2 rounded-lg border-2 transition-all duration-700 transform hover:scale-105 aspect-square ${
                  currentStep >= 1 ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg' : 'border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100'
                }`}>
                  <div className="text-center mb-2">
                    <div className={`text-xl mb-1 ${currentStep >= 1 ? 'animate-bounce' : ''}`}>📊</div>
                    <h3 className="text-xs font-bold text-green-800 mb-1">Анализ траекторий</h3>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center p-1 bg-white/60 rounded-sm">
                      <span className="text-green-700 font-medium text-xs">Скорость:</span>
                      <span className="font-mono text-green-600 font-bold text-xs">
                        {currentStep >= 1 ? `${(Math.random() * 5).toFixed(2)} м/с` : '---'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-1 bg-white/60 rounded-sm">
                      <span className="text-green-700 font-medium text-xs">Направление:</span>
                      <span className="font-mono text-green-600 font-bold text-xs">
                        {currentStep >= 1 ? `${Math.floor(Math.random() * 360)}°` : '---'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-1 bg-white/60 rounded-sm">
                      <span className="text-green-700 font-medium text-xs">Ускорение:</span>
                      <span className="font-mono text-green-600 font-bold text-xs">
                        {currentStep >= 1 ? `${(Math.random() * 2).toFixed(2)} м/с²` : '---'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Этап 3: Извлечение энтропии */}
                <div className={`p-2 rounded-lg border-2 transition-all duration-700 transform hover:scale-105 aspect-square ${
                  currentStep >= 2 ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg' : 'border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100'
                }`}>
                  <div className="text-center mb-2">
                    <div className={`text-xl mb-1 ${currentStep >= 2 ? 'animate-bounce' : ''}`}>⚡</div>
                    <h3 className="text-xs font-bold text-purple-800 mb-1">Извлечение энтропии</h3>
                  </div>
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-green-400 p-2 rounded-sm font-mono text-xs shadow-inner border border-gray-700">
                    <div className="text-green-300">SHA-256(</div>
                    <div className="ml-1 text-green-300">concat(</div>
                    <div className="ml-1 text-green-400">
                      fish_data: {currentStep >= 2 ? '0x' + Math.random().toString(16).substr(2, 8) : '--------'}
                    </div>
                    <div className="ml-1 text-green-400">
                      timestamp: {currentStep >= 2 ? Date.now().toString(16).slice(-8) : '--------'}
                    </div>
                    <div className="ml-1 text-green-400">
                      vectors: {currentStep >= 2 ? '0x' + Math.random().toString(16).substr(2, 8) : '--------'}
                    </div>
                    <div className="ml-1 text-green-300">)</div>
                    <div className="text-green-300">)</div>
                  </div>
                </div>

                {/* Этап 4: Генерация числа */}
                <div className={`p-2 rounded-lg border-2 transition-all duration-700 transform hover:scale-105 aspect-square ${
                  currentStep >= 3 ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg' : 'border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100'
                }`}>
                  <div className="text-center mb-2">
                    <div className={`text-xl mb-1 ${currentStep >= 3 ? 'animate-bounce' : ''}`}>🎲</div>
                    <h3 className="text-xs font-bold text-purple-800 mb-1">Генерация числа</h3>
                  </div>
                  <div className="bg-gradient-to-br from-purple-400 to-purple-600 text-white p-2 rounded-sm text-center shadow-inner">
                    <div className="text-xs font-mono font-bold">
                      {generatedNumber ? generatedNumber : '---'}
                    </div>
                    <div className="text-xs text-purple-100 mt-1">
                      {currentStep >= 3 ? 'Сгенерировано!' : 'Ожидание...'}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 text-center leading-tight mt-1">
                    Создается криптографически стойкое случайное число
                  </p>
                </div>
              </div>

              {/* Прогресс-бар */}
              <div className="mt-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-gray-600">Прогресс демонстрации</span>
                  <span className="text-xs font-bold text-blue-600">{currentStep} из {steps.length} этапов</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 shadow-inner">
                  <div 
                    className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-1.5 rounded-full transition-all duration-700 shadow-lg"
                    style={{ width: `${(currentStep / steps.length) * 100}%` }}
                  ></div>
                </div>
              </div>

            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}




