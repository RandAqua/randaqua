"use client";

import { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import AuthModal from '../../components/auth/AuthModal';

export default function GeneratePage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');

  // Form state
  const [count, setCount] = useState(1);
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [entropySource, setEntropySource] = useState('Камеры аквариумов (рыбы)');

  // Demo/computation state
  const [isComputing, setIsComputing] = useState(false);
  const [stage, setStage] = useState(0); // 0..3 stages
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState([]);

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

  // Simple string hash (FNV-1a like) to mix entropy source into RNG
  const hashString = (str) => {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
    }
    return h >>> 0;
  };

  const validate = () => {
    if (min > max) return 'Минимум не может быть больше максимума';
    if (count < 1 || count > 10) return 'Количество должно быть от 1 до 10';
    return '';
  };

  const runComputation = () => {
    const err = validate();
    if (err) {
      alert(err);
      return;
    }
    setIsComputing(true);
    setStage(0);
    setProgress(0);
    setResults([]);

    const startTs = Date.now();
    const timers = [];

    // Stage progression (kept for internal timing, not shown)
    timers.push(setTimeout(() => setStage(0), 0));
    timers.push(setTimeout(() => setStage(1), 1200));
    timers.push(setTimeout(() => setStage(2), 2400));
    timers.push(setTimeout(() => setStage(3), 3600));

    // Progressive generation during progress movement
    const entropySeed = hashString(entropySource);
    const buffer = [];
    let nextIndex = 0;
    const genId = setInterval(() => {
      if (nextIndex >= count) {
        clearInterval(genId);
        return;
      }
      const i = nextIndex;
      const rotated = (entropySeed << (i % 13)) | (entropySeed >>> (32 - (i % 13)));
      const mix = (startTs ^ (i * 2654435761) ^ rotated) + Math.floor(Math.random() * 1e9);
      const span = max - min + 1;
      buffer.push(min + Math.abs(mix) % span);
      nextIndex += 1;
    }, 120);
    timers.push(genId);

    // Progress ticker with finalize at 100%
    const progId = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(100, prev + 8);
        if (next >= 100) {
          clearInterval(progId);
          clearInterval(genId);
          // Ensure buffer has all numbers; if not, fill remaining synchronously
          while (buffer.length < count) {
            const i = buffer.length;
            const rotated = (entropySeed << (i % 13)) | (entropySeed >>> (32 - (i % 13)));
            const mix = (startTs ^ (i * 2654435761) ^ rotated) + Math.floor(Math.random() * 1e9);
            const span = max - min + 1;
            buffer.push(min + Math.abs(mix) % span);
          }
          // Small delay to show 100% progress before showing results
          setTimeout(() => {
            setResults(buffer);
            setIsComputing(false);
          }, 200);
        }
        return next;
      });
    }, 80);
    timers.push(progId);

    return () => timers.forEach(clearTimeout);
  };

  const lenClass = (val) => `len-${String(val).length}`;

  const downloadFingerprint = () => {
    const payload = {
      timestamp: new Date().toISOString(),
      params: { count, min, max, entropySource },
      results,
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
      />
    </div>
  );
}
