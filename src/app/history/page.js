"use client";

import { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import AuthModal from '../../components/auth/AuthModal';
import { isAuthenticated } from '../../utils/auth';

const formatDate = (isoOrMs) => {
  try {
    const d = new Date(isoOrMs);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${dd}.${mm}.${yyyy} ${hh}:${min}`;
  } catch {
    return String(isoOrMs);
  }
};

export default function HistoryPage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [order, setOrder] = useState('desc'); // desc: сначала новые
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Проверка авторизации при загрузке
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsUserAuthenticated(authenticated);
      setIsCheckingAuth(false);
    };
    
    checkAuth();
    
    // Проверяем авторизацию каждые 5 секунд
    const interval = setInterval(checkAuth, 5000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isUserAuthenticated) return;
    setLoading(true);
    setError('');
    // Backend integration: replace with real API (GET /api/history?order=desc|asc) that returns { items: HistoryItem[] }
    fetch(`/api/history?order=${order}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to load');
        const data = await res.json();
        setItems(Array.isArray(data?.items) ? data.items : []);
      })
      .catch(() => {
        // Фоллбэк-демо: удалите когда будет бэкенд
        const demo = [
          {
            id: '1',
            createdAt: Date.now() - 1000 * 60 * 60 * 24,
            fingerprint: { min: 1, max: 49, count: 6, combos: [[3, 11, 22, 27, 35, 44]] },
          },
          {
            id: '2',
            createdAt: Date.now() - 1000 * 60 * 5,
            fingerprint: { min: 1, max: 100, count: 5, combos: [[5, 12, 26, 78, 94]] },
          },
        ];
        setItems(order === 'desc' ? demo.reverse() : demo);
      })
      .finally(() => setLoading(false));
  }, [isUserAuthenticated, order]);

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
    setIsUserAuthenticated(true);
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

  // Показываем загрузку во время проверки авторизации
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen max-w-full overflow-x-hidden">
        <Navbar onLoginClick={openAuthModal} />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="aqua-loader mx-auto mb-4"></div>
            <p className="text-gray-600">Проверка авторизации...</p>
          </div>
        </div>
      </div>
    );
  }

  // Показываем сообщение для неавторизованных пользователей
  if (!isUserAuthenticated) {
    return (
      <div className="min-h-screen max-w-full overflow-x-hidden">
        <Navbar onLoginClick={openAuthModal} />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
              <div className="text-6xl mb-4">🔒</div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Требуется авторизация
              </h1>
              <p className="text-gray-600 mb-6">
                Эта страница предназначена только для авторизованных пользователей. 
                Пожалуйста, войдите в систему, чтобы продолжить.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Используйте кнопки "Регистрация" или "Вход" в верхнем меню для авторизации.
              </p>
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

  return (
    <div className="min-h-screen aqua-background">
      <div className={`main-content ${isAuthModalOpen ? 'blur' : ''}`}>
        <Navbar onLoginClick={openAuthModal} />

        <section className="aqua-hero-section auto-height" style={{ overflow: 'hidden' }}>
          <div className="aqua-fish-background auto-height" style={{ overflow: 'hidden' }}>
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16 relative z-10">
              <div className="text-center flex flex-col items-center" style={{ gap: '64px' }}>
                <h1 className="aqua-main-title" style={{ fontSize: '5rem', margin: 0 }}>
                  <span className="aqua-title-line1">Истинная случайность</span>
                  <span className="aqua-title-line2">из глубин океана</span>
                </h1>

                <div className="stoloto-card no-hover p-4 rounded-2xl bg-white w-full">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-gray-800 font-semibold flex items-center">
                      <span className="history-emoji" aria-hidden>🕒</span>
                      История генераций
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-gray-600">Порядок:</label>
                      <select
                        value={order}
                        onChange={(e) => setOrder(e.target.value)}
                        className="uniform-input bg-white border border-gray-200 rounded-lg px-3 text-gray-800 select-pointer"
                      >
                        <option value="desc">Сначала новые</option>
                        <option value="asc">Сначала старые</option>
                      </select>
                    </div>
                  </div>

                  {error && (
                    <div className="mt-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-medium text-left">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error}
                      </div>
                    </div>
                  )}

                  <div className="mt-3 rounded-xl border border-gray-100 bg-white" style={{ maxHeight: '52vh', overflowY: 'auto' }}>
                    {loading ? (
                      <div className="flex justify-center py-6 text-gray-600">Загрузка…</div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {items.map((it) => (
                          <div key={it.id} className="p-3">
                            <div className="text-gray-800 text-sm font-semibold">Дата и время: {formatDate(it.createdAt)}</div>
                            <div className="text-gray-700 text-sm whitespace-pre mt-1">
                              {`\tЦифровой слепок: min ${it.fingerprint?.min}, max ${it.fingerprint?.max}, count ${it.fingerprint?.count}${Array.isArray(it.fingerprint?.combos) && it.fingerprint.combos.length ? `, комбинации: ${it.fingerprint.combos.map((c)=>`[${c.join(', ')}]`).join('  ')}` : ''}`}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
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


