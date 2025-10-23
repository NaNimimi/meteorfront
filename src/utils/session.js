// src/utils/session.js

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const SESSION_KEY = "my_app_session";

/**
 * Save session data: access, refresh, and user object
 */
export function saveSession(data) {
  if (!data) return;
  if (data.access) localStorage.setItem(ACCESS_TOKEN_KEY, data.access);
  if (data.refresh) localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh);
  if (data.user) localStorage.setItem(SESSION_KEY, JSON.stringify(data.user));
}

/**
 * Get access token
 */
export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

/**
 * Get refresh token
 */
export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

/**
 * Get stored user info
 */
export function getUser() {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

/**
 * Clear all session data
 */
export function clearSession() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(SESSION_KEY);
}

/**
 * Refresh the access token
 * (Optional – only if your API supports refresh)
 */
export async function refreshToken() {
  const refresh = getRefreshToken();
  if (!refresh) throw new Error("No refresh token");

  const res = await fetch("http://api.meteordub.uz/api/auth/token/refresh/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  if (!res.ok) throw new Error("Failed to refresh token");

  const data = await res.json();
  if (data.access) localStorage.setItem(ACCESS_TOKEN_KEY, data.access);
  return data.access;
}
