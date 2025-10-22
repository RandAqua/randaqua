'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../components/layout/Navbar';

export default function AnimatedDemo() {
  const [blurLevel, setBlurLevel] = useState(0);
  const [showPhoto, setShowPhoto] = useState(false);
  const [showText, setShowText] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(null);
  const [currentText, setCurrentText] = useState(null);

  // Постепенно замыливаем бэкграунд
  useEffect(() => {
    const interval = setInterval(() => {
      setBlurLevel(prev => {
        if (prev >= 20) {
          clearInterval(interval);
          return 20;
        }
        return prev + 0.5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // ========================================
  // МЕСТО ДЛЯ ИНТЕГРАЦИИ С БЭКЕНДОМ
  // ========================================
  // Замените этот блок на вызов функции fetchRandomPhotoAndText()

  // Пример функции для получения рандомного фото и текста из бэкенда:
  /*
  const fetchRandomPhotoAndText = async () => {
    try {
      const response = await fetch('/api/random-content', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Ожидаемый формат ответа от бэкенда:
      // {
      //   success: true,
      //   photo: {
      //     url: "https://example.com/photo.jpg",
      //     alt: "Описание фото"
      //   },
      //   text: {
      //     title: "Заголовок",
      //     description: "Описание текста"
      //   }
      // }

      return data;
    } catch (error) {
      console.error('Error fetching random content from backend:', error);
      throw error;
    }
  };
  */

  // Текущий код (удалить после интеграции с бэкендом):
  const getRandomContent = () => {
    const demoPhotos = [
      { url: 'https://picsum.photos/600/400?random=1', alt: 'Random Photo 1' },
      { url: 'https://picsum.photos/600/400?random=2', alt: 'Random Photo 2' },
      { url: 'https://picsum.photos/600/400?random=3', alt: 'Random Photo 3' },
      { url: 'https://picsum.photos/600/400?random=4', alt: 'Random Photo 4' },
    ];

    const demoTexts = [
      { title: 'Алгоритм RandAqua в действии', description: 'Это демонстрация работы нашего уникального алгоритма генерации случайных чисел на основе поведения морских обитателей.' },
      { title: 'Истинная случайность', description: 'Каждое число генерируется с использованием реальных данных о движении рыб в океане, что гарантирует криптографическую стойкость.' },
      { title: 'Инновационная технология', description: 'Наш подход использует хаотичное поведение природы для создания чисел, которые невозможно предсказать или воспроизвести.' },
      { title: 'Будущее генерации чисел', description: 'RandAqua представляет новую эру в области генерации случайных чисел, основанную на принципах естественной энтропии.' },
    ];

    const randomPhoto = demoPhotos[Math.floor(Math.random() * demoPhotos.length)];
    const randomText = demoTexts[Math.floor(Math.random() * demoTexts.length)];

    return { photo: randomPhoto, text: randomText };
  };

  // Запуск анимации при загрузке страницы
  useEffect(() => {
    const timer = setTimeout(() => {
      // Получаем рандомный контент
      const content = getRandomContent();
      setCurrentPhoto(content.photo);
      setCurrentText(content.text);
      
      // Показываем фото с анимацией
      setShowPhoto(true);
      
      // Через 2 секунды показываем текст
      setTimeout(() => {
        setShowText(true);
      }, 2000);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const openAuthModal = (tab = 'login') => {
    // Простая заглушка для навбара
  };

  return (
    <div className="min-h-screen overflow-hidden relative bg-gradient-to-br from-blue-500 to-purple-600">
      <Navbar onLoginClick={openAuthModal} />
      
      {/* Бэкграунд с постепенным замыливанием */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          filter: `blur(${blurLevel}px)`,
          transition: 'filter 0.1s ease-out'
        }}
      >
        {/* Дополнительные элементы для красоты */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 text-6xl">🐟</div>
          <div className="absolute top-20 right-20 text-5xl">🐠</div>
          <div className="absolute bottom-20 left-20 text-4xl">🐡</div>
          <div className="absolute bottom-10 right-10 text-5xl">🦈</div>
          <div className="absolute top-1/2 left-1/4 text-3xl">🐙</div>
          <div className="absolute top-1/3 right-1/3 text-4xl">🦑</div>
        </div>
      </div>

      {/* Основной контент */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Заголовок вверху */}
        <div className="text-center pt-2">
          <h1 className="text-lg font-bold text-white mb-0">
            Анимированная демонстрация RandAqua
          </h1>
        </div>
        
        {/* Центральный контент - фото с текстом */}
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          {currentPhoto && (
            <div className="flex flex-col items-center justify-center w-full max-w-md">
              <div
                className={`relative transform transition-all duration-1000 ease-out ${
                  showPhoto
                    ? 'translate-y-0 opacity-100 scale-100 rotate-0'
                    : 'translate-y-20 opacity-0 scale-95 rotate-3'
                }`}
                style={{
                  filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.25))',
                }}
              >
                <img
                  src={currentPhoto.url}
                  alt={currentPhoto.alt}
                  className="w-80 h-52 object-cover rounded-2xl border-2 border-white/20 shadow-2xl mx-auto"
                  style={{
                    animation: showPhoto ? 'photoGlow 2s ease-in-out infinite alternate' : 'none'
                  }}
                />
                
                {/* Эффект свечения вокруг фото */}
                <div 
                  className={`absolute inset-0 rounded-2xl transition-all duration-1000 ${
                    showPhoto ? 'opacity-30' : 'opacity-0'
                  }`}
                  style={{
                    background: 'linear-gradient(45deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))',
                    filter: 'blur(20px)',
                    transform: 'scale(1.1)',
                    zIndex: -1
                  }}
                ></div>
              </div>

              {/* Текст с ебейшей анимацией - маленький отступ от фото */}
              {currentText && (
                <div
                  className={`mt-6 text-center transform transition-all duration-1000 ease-out delay-500 w-full ${
                    showText
                      ? 'translate-y-0 opacity-100 scale-100'
                      : 'translate-y-10 opacity-0 scale-95'
                  }`}
                >
                  <h2 
                    className="text-xl font-bold text-white mb-3"
                    style={{
                      background: 'linear-gradient(45deg, #ffffff, #e0e7ff)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow: '0 0 30px rgba(255,255,255,0.5)',
                      animation: showText ? 'textGlow 3s ease-in-out infinite alternate' : 'none'
                    }}
                  >
                    {currentText.title}
                  </h2>
                  <p 
                    className="text-sm text-white/90 max-w-lg mx-auto leading-relaxed"
                    style={{
                      textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                      animation: showText ? 'textSlide 2s ease-out' : 'none'
                    }}
                  >
                    {currentText.description}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Кнопка "Назад" внизу страницы */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
          <Link 
            href="/"
            className="group relative inline-flex items-center px-8 py-4 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-2xl shadow-2xl transition-all duration-300 ease-out border-2 border-gray-600 hover:border-gray-500 hover:shadow-3xl hover:scale-110 hover:-translate-y-1"
            style={{
              background: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)'
            }}
          >
            <svg 
              className="w-6 h-6 mr-3 transition-transform duration-300 group-hover:-translate-x-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2.5} 
                d="M10 19l-7-7m0 0l7-7m-7 7h18" 
              />
            </svg>
            <span className="text-lg">Назад к демонстрации</span>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
        </div>
      </div>
      
      
      {/* CSS анимации */}
      <style jsx>{`
        @keyframes photoGlow {
          0% {
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
          }
          100% {
            box-shadow: 0 0 40px rgba(255, 255, 255, 0.6), 0 0 60px rgba(255, 255, 255, 0.3);
          }
        }
        
        @keyframes textGlow {
          0% {
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
          }
          100% {
            text-shadow: 0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(255, 255, 255, 0.3);
          }
        }
        
        @keyframes textSlide {
          0% {
            transform: translateX(-20px);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
