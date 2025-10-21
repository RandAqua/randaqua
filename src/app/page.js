import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Героическая секция в стиле Столото */}
      <section className="hero-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="hero-title">
              Генератор лотерейных чисел
            </h1>
            <p className="hero-subtitle">
              Честный и прозрачный генератор случайных чисел для лотерей
            </p>
            <div className="flex justify-center space-x-4">
              <button className="btn-stoloto">
                Создать тираж
              </button>
              <button className="btn-gold">
                Проверить случайность
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Основной контент */}
      <main className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Карточки функций */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="lottery-card text-center">
              <div className="w-16 h-16 mx-auto mb-4 logo-stoloto text-2xl">
                🎲
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Создать тираж
              </h3>
              <p className="text-gray-600">
                Генерируйте случайные числа для различных типов лотерей
              </p>
            </div>

            <div className="lottery-card text-center">
              <div className="w-16 h-16 mx-auto mb-4 logo-stoloto text-2xl">
                🔍
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Проверить случайность
              </h3>
              <p className="text-gray-600">
                Анализируйте качество генерации случайных чисел
              </p>
            </div>

            <div className="lottery-card text-center">
              <div className="w-16 h-16 mx-auto mb-4 logo-stoloto text-2xl">
                ❓
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Как это работает?
              </h3>
              <p className="text-gray-600">
                Узнайте о принципах работы генератора
              </p>
            </div>

            <div className="lottery-card text-center">
              <div className="w-16 h-16 mx-auto mb-4 logo-stoloto text-2xl">
                📊
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                История
              </h3>
              <p className="text-gray-600">
                Просматривайте историю всех созданных тиражей
              </p>
            </div>
          </div>

          {/* Заглушка для основного контента */}
          <div className="stoloto-card p-12 text-center">
            <div className="text-gray-500 text-xl mb-4">
              🚧 Контент будет добавлен позже...
            </div>
            <p className="text-gray-400">
              Здесь будет размещен основной функционал генератора лотерейных чисел
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
