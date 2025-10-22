# 🎨 RandAqua Frontend

> **Frontend часть системы генерации случайных чисел на основе наблюдения за морской жизнью**

[![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC)](https://tailwindcss.com/)

## 🚀 Быстрый старт

### Предварительные требования

- Node.js 18+ 
- npm или yarn

### Установка

```bash
# Установите зависимости
npm install

# Запустите сервер разработки
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

### Сборка для продакшена

```bash
npm run build
npm start
```

## 🏗️ Архитектура Frontend

```
src/
├── app/                    # Страницы приложения
│   ├── page.js            # Главная страница
│   ├── generate/          # Генерация случайных чисел
│   ├── analyze/           # Анализ случайности
│   ├── how-it-works/      # Демонстрация алгоритма
│   ├── history/           # История генераций
│   └── api/              # API роуты Next.js
├── components/            # React компоненты
│   ├── auth/             # Компоненты авторизации
│   ├── analyze/          # Компоненты анализа
│   ├── layout/           # Компоненты макета
│   ├── forms/            # Формы
│   └── wheel-of-fortune/ # Игровые компоненты
├── config/               # Конфигурация API
└── utils/                # Утилиты
```

## 🎨 Технологический стек

- **Next.js 15.5.6** - React фреймворк с SSR
- **React 19.1.0** - Библиотека пользовательского интерфейса
- **Tailwind CSS 4.0** - Utility-first CSS фреймворк
- **JavaScript ES6+** - Современный JavaScript

## 📱 Основные страницы

### 🏠 Главная страница (`/`)
- Героическая секция с описанием проекта
- Навигация по основным функциям
- Модальное окно авторизации

### 🎲 Генерация (`/generate`)
- Форма для настройки параметров генерации
- Визуализация процесса создания случайности
- Отображение результатов с дополнительной информацией
- Скачивание цифрового слепка

### 🔍 Анализ случайности (`/analyze`)
- Загрузка файлов для проверки случайности
- Ввод текста для анализа
- Детальные результаты статистических тестов
- Визуализация результатов тестов

### 🎓 Как это работает (`/how-it-works`)
- Интерактивная демонстрация алгоритма
- Пошаговое объяснение процесса
- Визуализация каждого этапа генерации

### 📊 История (`/history`)
- Просмотр предыдущих генераций
- Фильтрация и поиск по истории

## 🔧 Разработка

### Структура компонентов

```javascript
// Пример использования API
import { generateBatch } from '../config/api';

const handleGenerate = async () => {
  const result = await generateBatch(5, 1, 100);
  console.log(result.generatedNumbers);
};
```

### Стилизация

Проект использует кастомные CSS классы с морской тематикой:

```css
.aqua-hero-section { /* Стили героической секции */ }
.aqua-main-title { /* Заголовки */ }
.aqua-generate-btn { /* Кнопки генерации */ }
.aqua-how-btn { /* Кнопки действий */ }
```

### Конфигурация API

```javascript
// src/config/api.js
export const API_CONFIG = {
  BASE_URL: 'http://26.237.158.25:8000',
  ENDPOINTS: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    GENERATE_BATCH: '/video/generate-batch-snapshot',
    // ... другие эндпоинты
  }
};
```

## 🎨 UI/UX Особенности

### Морская тематика
- Градиенты в стиле океанских глубин
- Анимированные рыбки и морские элементы
- Цветовая схема: синие, бирюзовые, белые тона

### Адаптивность
- Mobile-first подход
- Responsive дизайн для всех устройств
- Оптимизация для touch-интерфейсов

### Анимации
- Плавные переходы между состояниями
- Анимированные прогресс-бары
- Эффекты появления элементов

## 📈 Производительность

- ⚡ **Быстрая загрузка**: Next.js оптимизация
- 🎯 **SEO-готовность**: Server-side rendering
- 📱 **Адаптивность**: Mobile-first дизайн
- 🔄 **Кэширование**: Оптимизированные запросы

## 🚀 Деплой

### Vercel (рекомендуется)
```bash
# Автоматический деплой через Vercel
vercel --prod
```

### Другие платформы
```bash
npm run build
npm start
```

## 🔗 Связанные репозитории

- [Общий README проекта](../README.md)
- [Backend Documentation](../backend/README.md)
- [Swagger API Documentation](http://26.237.158.25:8000/docs)

## 📞 Контакты

- **GitHub**: [@your-organization](https://github.com/your-organization)
- **Email**: your-email@example.com

---

**RandAqua Frontend** - красивый интерфейс для генерации случайности! 🎨✨