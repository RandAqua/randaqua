# Система аутентификации

Этот модуль предоставляет утилиты для управления аутентификацией пользователей, включая сохранение токенов в localStorage и выполнение авторизованных API запросов.

## Основные функции

### `saveAuthData(authData)`
Сохраняет данные аутентификации в localStorage. Поддерживает различные форматы ответов API:

```javascript
// Формат login
const loginData = {
  "success": true,
  "message": "string",
  "token": "string",
  "user_id": "string",
  "expires_in": 3600,
  "token_type": "Bearer",
  "user_uuid": "string"
};

// Формат verify-code
const verifyData = {
  "Success": true,
  "Message": "string",
  "Token": "string",
  "User": {
    "Id": 0,
    "Email": "string",
    "Username": "string"
  }
};

saveAuthData(loginData); // или verifyData
```

### `getToken()`
Возвращает токен из localStorage.

### `getUserData()`
Возвращает данные пользователя из localStorage.

### `isTokenValid()`
Проверяет, действителен ли токен (не истек ли).

### `isAuthenticated()`
Проверяет, авторизован ли пользователь.

### `clearAuthData()`
Очищает все данные аутентификации из localStorage.

### `getAuthHeader()`
Возвращает заголовок Authorization для API запросов.

## Использование в компонентах

### В формах входа и регистрации

```javascript
import { saveAuthData } from '../../utils/auth';

// После успешного ответа от API
if (response.ok) {
  const data = await response.json();
  const authSaved = saveAuthData(data);
  if (authSaved) {
    console.log('Данные аутентификации сохранены');
  }
}
```

### Для проверки статуса аутентификации

```javascript
import { isAuthenticated, getUserData } from '../../utils/auth';

const MyComponent = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    setIsAuth(isAuthenticated());
    setUserData(getUserData());
  }, []);

  if (!isAuth) {
    return <div>Пользователь не авторизован</div>;
  }

  return <div>Добро пожаловать, {userData?.username}!</div>;
};
```

### Для выполнения авторизованных запросов

```javascript
import { makeAuthenticatedRequest, API_URLS } from '../config/api';

const makeRequest = async () => {
  try {
    const response = await makeAuthenticatedRequest(API_URLS.SOME_ENDPOINT, {
      method: 'GET',
      // другие опции
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(data);
    }
  } catch (error) {
    console.error('Ошибка запроса:', error);
  }
};
```

## Структура данных в localStorage

### Ключ: `auth_token`
Содержит JWT токен.

### Ключ: `user_data`
Содержит объект с данными пользователя:

```javascript
{
  "id": "user_id",
  "email": "user@example.com",
  "username": "username",
  "tokenType": "Bearer",
  "expiresAt": 1234567890123 // timestamp или null
}
```

## Автоматическое управление токенами

- Токены автоматически проверяются на истечение срока действия
- При истечении токена данные автоматически очищаются
- Заголовки Authorization добавляются автоматически к запросам

## Примеры компонентов

См. файлы:
- `../components/auth/AuthStatus.js` - компонент для отображения статуса аутентификации
- `../examples/AuthenticatedApiExample.js` - пример выполнения авторизованных запросов
