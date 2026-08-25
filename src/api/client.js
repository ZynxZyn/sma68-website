const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000';

const TOKEN_KEY = 'sma68_access_token';
const REFRESH_KEY = 'sma68_refresh_token';

let refreshing = null;

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setTokens(accessToken, refreshToken) {
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_KEY, refreshToken);
}

export function clearTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem(REFRESH_KEY);
  if (!refreshToken) throw new Error('No refresh token');

  if (!refreshing) {
    refreshing = fetch(`${API_BASE}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Refresh failed');
        const json = await res.json();
        setTokens(json.data.accessToken, json.data.refreshToken);
        return json.data.accessToken;
      })
      .finally(() => {
        refreshing = null;
      });
  }
  return refreshing;
}

export async function apiFetch(path, options = {}) {
  const { headers, ...rest } = options;
  const mergedHeaders = { 'Content-Type': 'application/json', ...headers };

  if (getToken()) mergedHeaders.Authorization = `Bearer ${getToken()}`;

  let res = await fetch(`${API_BASE}${path}`, { ...rest, headers: mergedHeaders });

  if (res.status === 401 && localStorage.getItem(REFRESH_KEY)) {
    try {
      const token = await refreshAccessToken();
      mergedHeaders.Authorization = `Bearer ${token}`;
      res = await fetch(`${API_BASE}${path}`, { ...rest, headers: mergedHeaders });
    } catch {
      clearTokens();
      window.dispatchEvent(new CustomEvent('auth:expired'));
    }
  }

  const text = await res.text();
  const json = text ? JSON.parse(text) : {};
  if (!res.ok) throw new Error(json.error ?? `Request failed (${res.status})`);
  return json.data;
}

export function buildQuery(params = {}) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') q.set(k, v);
  });
  const s = q.toString();
  return s ? `?${s}` : '';
}