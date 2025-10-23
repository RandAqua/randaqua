"use client";

import { useEffect, useState, memo } from 'react';
import Navbar from '../../components/layout/Navbar';
import AuthModal from '../../components/auth/AuthModal';
import { isAuthenticated } from '../../utils/auth';
import { getHistoryPaginated, clearHistory, exportHistory } from '../../utils/historyStorage';

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

// Skeleton loader component for better perceived performance
const SkeletonLoader = () => (
  <div className="animate-pulse space-y-3 p-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-xl p-4 space-y-2">
        <div className="h-5 bg-gray-300 rounded w-1/3"></div>
        <div className="h-4 bg-gray-300 rounded w-full"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
      </div>
    ))}
  </div>
);

// Memoized history item component to prevent unnecessary re-renders
const HistoryItem = memo(({ item, index }) => {
  return (
    <div 
      className="group relative p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-300 rounded-xl"
      style={{
        animation: `slideIn 0.3s ease-out ${index * 0.05}s both`,
      }}
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-cyan-400 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="flex flex-col lg:flex-row items-start gap-6">
        {/* Левая часть: основная информация */}
        <div className="flex-1 space-y-3 min-w-0">
           <div className="flex items-center gap-3">
             <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 text-white font-bold shadow-lg flex-shrink-0">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
             </div>
             <div className="min-w-0">
               <div className="text-gray-800 text-base font-bold">{formatDate(item.createdAt)}</div>
             </div>
           </div>
          
          <div className="pl-13 space-y-2">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
                </svg>
                Диапазон: {item.fingerprint?.min} - {item.fingerprint?.max}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-cyan-100 text-cyan-800">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
                Чисел: {item.fingerprint?.count}
              </span>
            </div>
          </div>
        </div>
        
         {/* Правая часть: комбинации */}
         {item.fingerprint?.combos && item.fingerprint.combos.length > 0 && (
           <div className="flex-shrink-0 lg:w-auto w-full lg:pl-6">
             <div className="space-y-3">
               <div className="text-sm font-bold text-gray-700 flex items-center gap-2 lg:justify-end">
                 <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                   <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                 </svg>
                 Комбинации:
               </div>
               <div className="flex flex-col gap-2">
                 {item.fingerprint.combos.map((combo, idx) => {
                   const isLargeSet = combo.length > 10;
                   
                   return (
                     <div key={idx} className="px-3 py-2 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg shadow-sm border border-blue-200">
                       {isLargeSet ? (
                         // Для больших наборов (>10) - сетка с 10 колонками
                         <div className="grid grid-cols-10 gap-1">
                           {combo.map((num, numIdx) => (
                             <span key={numIdx} className="flex items-center justify-center w-7 h-7 rounded-full bg-white text-blue-700 font-bold text-xs shadow-sm">
                               {num}
                             </span>
                           ))}
                         </div>
                       ) : (
                         // Для маленьких наборов (≤10) - горизонтальная линия
                         <div className="flex items-center gap-1 justify-center lg:justify-end">
                           {combo.map((num, numIdx) => (
                             <span key={numIdx} className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-blue-700 font-bold text-sm shadow-sm">
                               {num}
                             </span>
                           ))}
                         </div>
                       )}
                     </div>
                   );
                 })}
               </div>
             </div>
           </div>
         )}
      </div>
    </div>
  );
});

HistoryItem.displayName = 'HistoryItem';

// Empty state component
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="text-8xl mb-6 animate-bounce">🐠</div>
    <h3 className="text-2xl font-bold text-gray-800 mb-2">История пуста</h3>
    <p className="text-gray-600 text-center max-w-md">
      Здесь будут отображаться все ваши генерации. Начните создавать комбинации!
    </p>
  </div>
);

export default function HistoryPage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [order, setOrder] = useState('desc');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 20;

  // Проверка авторизации при загрузке страницы
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

  // Оптимизированная загрузка истории из LocalStorage с пагинацией
  useEffect(() => {
    // Не загружаем историю, если пользователь не авторизован
    if (!isUserAuthenticated) return;
    
    setLoading(true);
    setError('');
    
    // Небольшая задержка для визуального эффекта загрузки
    const timeoutId = setTimeout(() => {
      try {
        // Читаем из LocalStorage
        const data = getHistoryPaginated({ order, page, limit: itemsPerPage });
        
        if (page === 1) {
          setItems(data.items);
        } else {
          setItems(prev => [...prev, ...data.items]);
        }
        
        setTotalItems(data.total);
        setHasMore(data.hasMore);
      } catch (err) {
        console.error('Ошибка загрузки истории:', err);
        setError('Не удалось загрузить историю');
        setItems([]);
        setTotalItems(0);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    }, 100); // Короткая задержка для плавности
    
    return () => clearTimeout(timeoutId);
  }, [isUserAuthenticated, order, page]);

  // Сброс пагинации при смене сортировки
  useEffect(() => {
    setPage(1);
    setItems([]);
  }, [order]);

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
    // Принудительно обновляем страницу для обновления Navbar и загрузки истории
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

  // Обработчик очистки истории
  const handleClearHistory = () => {
    if (confirm('Вы уверены, что хотите очистить всю историю? Это действие нельзя отменить.')) {
      clearHistory();
      setItems([]);
      setTotalItems(0);
      setPage(1);
      setHasMore(false);
    }
  };

  // Обработчик экспорта истории
  const handleExportHistory = () => {
    exportHistory();
  };

  // Показываем загрузку во время проверки авторизации
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen max-w-full overflow-x-hidden aqua-background">
        <Navbar onLoginClick={openAuthModal} />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="aqua-loader mx-auto mb-4"></div>
            <p className="text-white text-lg">Проверка авторизации...</p>
          </div>
        </div>
      </div>
    );
  }

  // Показываем сообщение для неавторизованных пользователей
  if (!isUserAuthenticated) {
    return (
      <div className="min-h-screen max-w-full overflow-x-hidden aqua-background">
        <Navbar onLoginClick={openAuthModal} />
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="text-center max-w-lg mx-auto">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-blue-200">
              <div className="text-7xl mb-6 animate-bounce">🔒</div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Вход в систему обязателен
              </h1>
              <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                Вы не можете зайти сюда без аккаунта. Пожалуйста, войдите в систему или зарегистрируйтесь для доступа к истории генераций.
              </p>
              <div className="space-y-3">
                <p className="text-sm text-gray-600 mb-4">
                  Используйте кнопки в верхнем меню для авторизации:
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => openAuthModal('login')}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105"
                  >
                    Войти
                  </button>
                  <button
                    onClick={() => openAuthModal('register')}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105"
                  >
                    Регистрация
                  </button>
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

                <div className="stoloto-card no-hover p-6 rounded-3xl bg-white/95 backdrop-blur-sm w-full shadow-2xl border border-gray-100">
                  {/* Header with gradient background */}
                  <div className="flex flex-col gap-4 pb-4 border-b-2 border-gradient-to-r from-blue-400 to-cyan-400">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h2 className="text-gray-800 text-xl font-bold">История генераций</h2>
                          <p className="text-gray-500 text-sm">Всего записей: {totalItems}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                        </svg>
                        <label className="text-sm font-medium text-gray-700">Порядок:</label>
                        <select
                          value={order}
                          onChange={(e) => setOrder(e.target.value)}
                          className="uniform-input bg-white border-2 border-gray-200 rounded-lg px-4 py-1 text-gray-800 font-medium select-pointer hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        >
                          <option value="desc">Сначала новые</option>
                          <option value="asc">Сначала старые</option>
                        </select>
                      </div>
                    </div>
                    
                    {/* Кнопки управления историей */}
                    {totalItems > 0 && (
                      <div className="flex flex-wrap gap-2 justify-end">
                        <button
                          onClick={handleExportHistory}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Экспорт
                        </button>
                        <button
                          onClick={handleClearHistory}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Очистить
                        </button>
                      </div>
                    )}
                  </div>

                  {error && (
                    <div className="mt-4 px-4 py-3 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 text-red-700 text-sm font-medium text-left shadow-sm">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 rounded-2xl border-2 border-gray-100 bg-gradient-to-br from-gray-50 to-white overflow-hidden history-scroll" style={{ maxHeight: '60vh', overflowY: 'auto', scrollBehavior: 'smooth' }}>
                    {loading && page === 1 ? (
                      <SkeletonLoader />
                    ) : items.length === 0 ? (
                      <EmptyState />
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {items.map((item, index) => (
                          <HistoryItem key={item.id} item={item} index={index} />
                        ))}
                        
                        {loading && page > 1 && (
                          <div className="flex justify-center py-6">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                          </div>
                        )}
                        
                        {!loading && hasMore && (
                          <div className="flex justify-center p-6">
                            <button
                              onClick={() => setPage(p => p + 1)}
                              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                              </svg>
                              Загрузить ещё
                            </button>
                          </div>
                        )}
                        
                        {!loading && !hasMore && items.length > 0 && (
                          <div className="text-center py-6 text-gray-500 text-sm font-medium">
                            🎉 Вы достигли конца истории
                          </div>
                        )}
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


