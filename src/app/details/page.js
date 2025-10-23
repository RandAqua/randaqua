'use client';

import Link from 'next/link';
import Navbar from '../../components/layout/Navbar';

export default function Details() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      
      {/* Bubbles animation */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="bubble absolute bg-white/30 rounded-full animate-float" style={{ width: '40px', height: '40px', top: '10%', left: '10%', animationDelay: '0s' }}></div>
        <div className="bubble absolute bg-white/30 rounded-full animate-float" style={{ width: '60px', height: '60px', top: '20%', right: '10%', animationDelay: '2s' }}></div>
        <div className="bubble absolute bg-white/30 rounded-full animate-float" style={{ width: '30px', height: '30px', bottom: '20%', left: '15%', animationDelay: '4s' }}></div>
        <div className="bubble absolute bg-white/30 rounded-full animate-float" style={{ width: '50px', height: '50px', bottom: '10%', right: '20%', animationDelay: '6s' }}></div>
      </div>
      
      <div className="max-w-4xl mx-auto bg-white/95 rounded-3xl shadow-2xl overflow-hidden mt-8 mb-8">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-blue-600 to-cyan-500 text-white p-10 text-center overflow-hidden">
          <div className="absolute inset-0 opacity-40">
            <svg className="w-full h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <path fill="#006699" fillOpacity="0.3" d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,192C1248,192,1344,128,1392,96L1440,64L1440,320L1392,320C1248,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </div>
          <div className="relative z-10">
            <span className="text-5xl mb-4 block">🐠</span>
            <h1 className="text-4xl font-bold mb-3 text-shadow-lg">Случайность Фибоначчи</h1>
            <p className="text-xl opacity-90">Генератор случайных чисел с последовательностью Фибоначчи</p>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-10">
          {/* Section 1 */}
          <div className="mb-10 p-6 bg-white rounded-2xl shadow-lg border-l-4 border-cyan-500">
            <h2 className="text-2xl font-bold text-blue-600 mb-5 flex items-center">
              <span className="mr-3">🎯</span>
              Как это работает (аналогия с рыбками)
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-cyan-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-blue-700 mb-2">Подготовка аквариума</h3>
                  <p className="text-blue-700 leading-relaxed">
                    Когда вы создаёте генератор, вы задаёте "семя" (seed) - это ключ к вашему аквариуму. Создаётся последовательность Фибоначчи - ваш "аквариум с рыбками". Каждая "рыбка" - это число из последовательности.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-cyan-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-blue-700 mb-2">Процесс генерации случайного числа</h3>
                  <p className="text-blue-700 leading-relaxed">
                    Базовый генератор даёт случайное число, затем мы "вылавливаем" текущую рыбку из аквариума, берём её последние две цифры, смешиваем с базовым числом и масштабируем под нужный диапазон.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-cyan-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-blue-700 mb-2">Перемещение по аквариуму</h3>
                  <p className="text-blue-700 leading-relaxed">
                    После использования каждой "рыбки" мы переходим к следующей. Когда доходим до конца аквариума - начинаем сначала, создавая бесконечный цикл.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Section 2 */}
          <div className="mb-10 p-6 bg-white rounded-2xl shadow-lg border-l-4 border-cyan-500">
            <h2 className="text-2xl font-bold text-blue-600 mb-5 flex items-center">
              <span className="mr-3">⚙️</span>
              Параметры конструктора
            </h2>
            
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4 font-mono text-lg border-l-4 border-cyan-500 text-blue-700">
              public FibonacciEnhancedRandom(ulong seed, int fibonacciSequenceLength = 100)
            </div>
            
            <ul className="space-y-2">
              <li><strong className="text-blue-700">seed (ulong)</strong>: <span className="text-blue-700">начальное значение для генерации последовательности</span></li>
              <li><strong className="text-blue-700">fibonacciSequenceLength (int)</strong>: <span className="text-blue-700">количество "рыбок" в аквариуме (по умолчанию 100)</span></li>
            </ul>
          </div>
          
          {/* Section 3 */}
          <div className="mb-10 p-6 bg-white rounded-2xl shadow-lg border-l-4 border-cyan-500">
            <h2 className="text-2xl font-bold text-blue-600 mb-5 flex items-center">
              <span className="mr-3">🔧</span>
              Методы
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-blue-700 mb-2">Случайное целое</h3>
                <p className="text-blue-700">Возвращает целое число в диапазоне [minValue, maxValue]</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-blue-700 mb-2">Случайное дробное</h3>
                <p className="text-blue-700">Возвращает дробное число в диапазоне [minValue, maxValue)</p>
              </div>
              
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                <h3 className="text-lg font-semibold text-green-700 mb-3 flex items-center">
                  <span className="mr-2">💡</span>
                  Пример использования
                </h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 font-mono text-sm border-l-4 border-cyan-500">
                  <div className="text-gray-600">// Создание генератора</div>
                  <div className="text-blue-600">var rng = new FibonacciEnhancedRandom(seed: 12345);</div>
                  <br />
                  <div className="text-gray-600">// Случайное целое число от 1 до 100</div>
                  <div className="text-blue-600">ulong randomInt = rng.Next(1, 100);</div>
                  <br />
                  <div className="text-gray-600">// Случайное дробное число от 0.0 до 1.0</div>
                  <div className="text-blue-600">double randomDouble = rng.NextDouble(0.0, 1.0);</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Section 4 */}
          <div className="mb-10 p-6 bg-white rounded-2xl shadow-lg border-l-4 border-cyan-500">
            <h2 className="text-2xl font-bold text-blue-600 mb-5 flex items-center">
              <span className="mr-3">🧮</span>
              Пример расчёта
            </h2>
            
            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
              <p className="text-blue-700 mb-2"><strong>Базовое число:</strong> 0.45</p>
              <p className="text-blue-700 mb-2"><strong>Число Фибоначчи:</strong> 2584 → mod 100 = 84 → 0.84</p>
              <p className="text-blue-700 mb-2"><strong>Сумма:</strong> 0.45 + 0.84 = 1.29</p>
              <p className="text-blue-700 mb-2"><strong>Дробная часть:</strong> 0.29</p>
              <p className="text-blue-700 mb-2"><strong>Диапазон:</strong> [10, 50]</p>
              <p className="text-blue-700"><strong>Результат:</strong> 10 + 0.29 × 41 ≈ 21</p>
            </div>
          </div>
          
          {/* Section 5 */}
          <div className="mb-10 p-6 bg-white rounded-2xl shadow-lg border-l-4 border-cyan-500">
            <h2 className="text-2xl font-bold text-blue-600 mb-5 flex items-center">
              <span className="mr-3">⚠️</span>
              Важные заметки
            </h2>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
              <ul className="space-y-2 text-blue-700">
                <li>• Не использовать для криптографии!</li>
                <li>• Для разных результатов используйте разное семя</li>
                <li>• При одинаковом семени результаты будут одинаковыми</li>
                <li>• Идеально подходит для игр, симуляций и тестирования</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center p-5 bg-blue-600 text-white text-sm">
          <p>Случайность Фибоначчи - Генератор с "аквариумом рыбок Фибоначчи" 🐠🔢</p>
        </div>
      </div>
      
      {/* Custom styles */}
      <style jsx>{`
        .text-shadow-lg {
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-10px) translateX(20px); }
          75% { transform: translateY(-30px) translateX(5px); }
        }
        
        .animate-float {
          animation: float 15s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
