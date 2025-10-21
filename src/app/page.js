import Navbar from '../components/Navbar';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen aqua-background">
      <Navbar />
      
      {/* Героическая секция AquaRNG */}
      <section className="aqua-hero-section" style={{ minHeight: '120vh' }}>
        <div className="aqua-fish-background" style={{ minHeight: '120vh' }}>
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
          <div className="aqua-fish-14">🦀</div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 aqua-text-container" style={{ paddingTop: '8rem', paddingBottom: '8rem' }}>
            <div className="text-center">
              <h1 className="aqua-main-title" style={{ fontSize: '5rem', marginBottom: '3rem' }}>
                <span className="aqua-title-line1">Истинная случайность</span>
                <span className="aqua-title-line2">из глубин океана</span>
              </h1>
              <p className="aqua-hero-description" style={{ fontSize: '1.5rem', marginBottom: '4rem', maxWidth: '900px' }}>
                Революционная система генерации случайных чисел на основе наблюдения за морской жизнью. 
                Камеры видеонаблюдения за рыбами создают истинно случайные числа для ваших нужд.
              </p>
              <div className="flex justify-center space-x-6 mt-12">
                <button className="aqua-generate-btn" style={{ padding: '20px 40px', fontSize: '18px' }}>
                  <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
                  </svg>
                  Генерировать число
                </button>
                <Link href="/how-it-works" className="aqua-how-btn" style={{ padding: '20px 40px', fontSize: '18px' }}>
                  <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
                  </svg>
                  Как это работает
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
