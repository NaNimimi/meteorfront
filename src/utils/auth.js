const USERS_KEY = 'my_app_users'
const SESSION_KEY = 'my_app_session'

function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  } catch (e) {
    return []
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function signup({ email, password, name }) {
  const users = loadUsers()
  if (users.find(u => u.email === email)) {
    return { ok: false, message: 'Пользователь с таким email уже существует' }
  }
  const user = { id: Date.now(), email, password, name }
  users.push(user)
  saveUsers(users)
  localStorage.setItem(SESSION_KEY, JSON.stringify({ id: user.id, email: user.email, name: user.name }))
  return { ok: true, user }
}

export function login({ email, password }) {
  const users = loadUsers()
  const user = users.find(u => u.email === email && u.password === password)
  if (!user) {
    return { ok: false, message: 'Неправильный email или пароль' }
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify({ id: user.id, email: user.email, name: user.name }))
  return { ok: true, user }
}

export function logout() {
  localStorage.removeItem(SESSION_KEY)
}

export function currentUser() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')
  } catch (e) {
    return null
  }
}

export function isAuthenticated() {
  return !!currentUser()
}
