const API_BASE = 'http://api.meteordub.uz/api'
const SESSION_KEY = 'my_app_session' 
const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

// Глобальная переменная для предотвращения множественного параллельного обновления
let isRefreshing = false;
// Массив для хранения ожидающих запросов
let failedQueue = [];

/**
 * Saves the user object, access token, and refresh token to localStorage.
 * Assumes the input data structure is { access, refresh, user } for login/signup,
 * or the user object itself for fetchMe.
 */
function saveSession(data) {
  // Определяем, является ли data полным ответом (для login/signup) или только объектом пользователя (для fetchMe)
  const userObject = data.user || data; 

  // Обеспечиваем, что URL аватара является полным (если присутствует avatar_url, используем его)
  if (userObject && userObject.avatar_url) {
    userObject.avatar = userObject.avatar_url;
  }
  
  localStorage.setItem(SESSION_KEY, JSON.stringify(userObject))
  if (data.access) localStorage.setItem(ACCESS_TOKEN_KEY, data.access)
  if (data.refresh) localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh)
}

// ------------------------------------------------------------------
// LOCAL STORAGE GETTERS/SETTERS
// ------------------------------------------------------------------

export function getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function currentUser() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')
  } catch {
    return null
  }
}

export function isAuthenticated() {
  return !!currentUser()
}

export function logout() {
  localStorage.removeItem(SESSION_KEY)
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  // Очищаем очередь ожидающих запросов
  failedQueue = [];
}

// ------------------------------------------------------------------
// TOKEN REFRESH LOGIC
// ------------------------------------------------------------------

/**
 * 💡 Использует Refresh Token для получения нового Access Token.
 * @returns {Promise<string|null>} Новый access token или null при ошибке.
 */
async function refreshToken() {
  const refreshTokenValue = getRefreshToken();
  if (!refreshTokenValue) {
    logout();
    return null;
  }

  try {
    const res = await fetch(`${API_BASE}/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshTokenValue }),
    });

    const data = await res.json();

    if (res.ok && data.success && data.data.access) {
      // 🚨 Важно: Обновляем только access токен (refresh может остаться прежним)
      localStorage.setItem(ACCESS_TOKEN_KEY, data.data.access);
      
      // Если сервер также возвращает новый refresh токен, обновляем его
      if (data.data.refresh) {
          localStorage.setItem(REFRESH_TOKEN_KEY, data.data.refresh);
      }

      return data.data.access;
    } else {
      // Если refresh токен недействителен, выходим из системы
      logout();
      return null;
    }
  } catch (err) {
    console.error('Refresh token error:', err);
    logout();
    return null;
  }
}

// ------------------------------------------------------------------
// AUTH API CALLS
// ------------------------------------------------------------------

/**
 * Вспомогательная функция для выполнения запросов с логикой обновления токена.
 * @param {string} url 
 * @param {object} options 
 * @returns {Promise<Response>}
 */
async function authenticatedFetch(url, options) {
  let token = getAccessToken();
  
  // Добавляем токен авторизации
  options.headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}` 
  };
  
  let response = await fetch(url, options);

  // 1. Если 401 и мы уже обновляем токен, ставим запрос в очередь
  if (response.status === 401 && isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject, url, options });
    });
  }

  // 2. Если 401 и мы НЕ обновляем токен, запускаем обновление
  if (response.status === 401 && !isRefreshing) {
    isRefreshing = true;
    
    // Запрос, который сейчас получил 401, тоже ставим в очередь
    const originalRequest = new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject, url, options });
    });
    
    try {
      const newAccessToken = await refreshToken();
      
      if (newAccessToken) {
        // Успешное обновление: обрабатываем очередь
        failedQueue.forEach(p => {
          // Обновляем токен в заголовках всех ожидающих запросов
          p.options.headers['Authorization'] = `Bearer ${newAccessToken}`;
          fetch(p.url, p.options).then(p.resolve).catch(p.reject);
        });
        failedQueue = [];
        
        // Возвращаем результат оригинального запроса
        return originalRequest; 
      }
    } catch (e) {
      // Ошибка обновления: очищаем очередь и выходим
      failedQueue.forEach(p => p.reject(new Error('Token refresh failed')));
      failedQueue = [];
      logout();
      return response; // Возвращаем исходный 401
    } finally {
      isRefreshing = false;
    }
  }
  
  return response;
}

/**
 * Получает актуальные данные пользователя с сервера, используя authenticatedFetch.
 */
export async function fetchMe() {
    if (!isAuthenticated()) return null;

    try {
        // 💡 Используем новую обертку, чтобы автоматически обновить токен при 401
        const res = await authenticatedFetch(`${API_BASE}/me/`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (res.ok) {
            const responseData = await res.json();
            
            const user = responseData.data; 

            if (user) {
                // Обновляем данные пользователя в локальном хранилище
                saveSession(user);
                return user;
            }
        } 
        
        // Если res.status === 401, это уже было обработано в authenticatedFetch
        if (res.status === 401) {
            return null;
        }

    } catch (err) {
        console.error('Fetch Me error:', err);
    }
    return null; 
}


export async function signup({ email, password, name }) {
  try {
    const res = await fetch(`${API_BASE}/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        full_name: name,
      }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      return { ok: false, message: data?.message || 'Ошибка при регистрации', errors: data?.errors };
    }
    
    const registrationData = data.data; 

    if (!registrationData || !registrationData.access || !registrationData.user) {
        return { ok: false, message: 'Неверный формат ответа сервера после регистрации.' };
    }

    // Сохраняем сессию с токенами и объектом пользователя
    saveSession(registrationData);

    return { ok: true, user: currentUser() };
  } catch (err) {
    console.error('Signup error:', err);
    return { ok: false, message: 'Сервер не отвечает' };
  }
}


export async function login({ email, password }) {
  // Логика login остается прежней, так как она не требует access token
  try {
    const res = await fetch(`${API_BASE}/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()

    if (!res.ok || !data.success) {
      return { ok: false, message: data?.message || 'Неправильный email yoki parol' }
    }
    
    const loginData = data.data;

    if (!loginData || !loginData.access || !loginData.user) {
        return { ok: false, message: 'Неверный формат ответа сервера.' }
    }

    // Сохраняем сессию с токенами и объектом пользователя
    saveSession(loginData)

    return { ok: true, user: currentUser() } // Возвращаем текущего пользователя из хранилища
  } catch (err) {
    console.error('Login error:', err)
    return { ok: false, message: 'Сервер не отвечает' }
  }
}

// 💡 Экспортируем authenticatedFetch для использования в других API-сервисах
export { authenticatedFetch };