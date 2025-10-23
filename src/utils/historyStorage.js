/**
 * Утилита для работы с историей генераций в LocalStorage
 */

const HISTORY_KEY = 'aquarng_generation_history';
const MAX_HISTORY_ITEMS = 1000; // Максимальное количество записей в истории

/**
 * Получить всю историю генераций из LocalStorage
 * @returns {Array} Массив объектов истории
 */
export const getHistory = () => {
  try {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Ошибка чтения истории из LocalStorage:', error);
    return [];
  }
};

/**
 * Добавить новую запись в историю
 * @param {Object} item - Объект с данными генерации
 * @param {Array} item.numbers - Массив сгенерированных чисел
 * @param {number} item.min - Минимальное значение диапазона
 * @param {number} item.max - Максимальное значение диапазона
 * @param {number} item.count - Количество чисел
 * @param {string} item.entropySource - Источник энтропии
 * @param {Object} item.serverData - Дополнительные данные с сервера
 */
export const addToHistory = (item) => {
  try {
    if (typeof window === 'undefined') return;
    
    const history = getHistory();
    const newItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
      fingerprint: {
        min: item.min,
        max: item.max,
        count: item.count,
        combos: [item.numbers], // Массив комбинаций (может быть несколько)
      },
      entropySource: item.entropySource,
      serverData: item.serverData || null,
    };
    
    // Добавляем в начало массива (новые записи сверху)
    history.unshift(newItem);
    
    // Ограничиваем размер истории
    const limitedHistory = history.slice(0, MAX_HISTORY_ITEMS);
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(limitedHistory));
    
    return newItem;
  } catch (error) {
    console.error('Ошибка сохранения в историю:', error);
    // Если превышен лимит localStorage, удаляем старые записи
    if (error.name === 'QuotaExceededError') {
      try {
        const history = getHistory();
        const reducedHistory = history.slice(0, Math.floor(MAX_HISTORY_ITEMS / 2));
        localStorage.setItem(HISTORY_KEY, JSON.stringify(reducedHistory));
        console.log('История сокращена из-за превышения лимита хранилища');
      } catch (e) {
        console.error('Не удалось сократить историю:', e);
      }
    }
    return null;
  }
};

/**
 * Очистить всю историю
 */
export const clearHistory = () => {
  try {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('Ошибка очистки истории:', error);
  }
};

/**
 * Удалить конкретную запись из истории
 * @param {string} id - ID записи для удаления
 */
export const deleteHistoryItem = (id) => {
  try {
    if (typeof window === 'undefined') return;
    const history = getHistory();
    const filtered = history.filter(item => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Ошибка удаления записи из истории:', error);
  }
};

/**
 * Получить историю с сортировкой и пагинацией
 * @param {Object} options - Опции фильтрации
 * @param {string} options.order - Порядок сортировки ('asc' или 'desc')
 * @param {number} options.page - Номер страницы (начиная с 1)
 * @param {number} options.limit - Количество записей на странице
 * @returns {Object} Объект с items и total
 */
export const getHistoryPaginated = ({ order = 'desc', page = 1, limit = 20 } = {}) => {
  try {
    let history = getHistory();
    
    // Сортировка
    if (order === 'asc') {
      history = [...history].reverse();
    }
    
    // Пагинация
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const items = history.slice(startIndex, endIndex);
    
    return {
      items,
      total: history.length,
      page,
      limit,
      hasMore: endIndex < history.length,
    };
  } catch (error) {
    console.error('Ошибка получения истории с пагинацией:', error);
    return {
      items: [],
      total: 0,
      page: 1,
      limit,
      hasMore: false,
    };
  }
};

/**
 * Экспортировать всю историю в JSON файл
 */
export const exportHistory = () => {
  try {
    const history = getHistory();
    const dataStr = JSON.stringify(history, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aquarng_history_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Ошибка экспорта истории:', error);
  }
};

/**
 * Импортировать историю из JSON файла
 * @param {File} file - Файл для импорта
 */
export const importHistory = async (file) => {
  try {
    const text = await file.text();
    const importedData = JSON.parse(text);
    
    if (!Array.isArray(importedData)) {
      throw new Error('Неверный формат файла');
    }
    
    // Объединяем с существующей историей
    const currentHistory = getHistory();
    const combined = [...importedData, ...currentHistory];
    
    // Удаляем дубликаты по ID
    const unique = Array.from(
      new Map(combined.map(item => [item.id, item])).values()
    );
    
    // Сортируем по дате (новые сначала) и ограничиваем
    const sorted = unique
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, MAX_HISTORY_ITEMS);
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(sorted));
    
    return {
      success: true,
      imported: importedData.length,
      total: sorted.length,
    };
  } catch (error) {
    console.error('Ошибка импорта истории:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

