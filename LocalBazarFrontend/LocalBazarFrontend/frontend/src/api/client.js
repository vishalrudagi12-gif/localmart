export const API_BASE = (
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' &&
  (window.location.hostname.includes('trycloudflare.com') ||
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1')
    ? ''
    : 'https://lesson-bind-pike-senator.trycloudflare.com')
).replace(/\/+$/, '');

const API = API_BASE ? `${API_BASE}/api` : '/api';

export function resolveImageUrl(url) {
  if (!url) return '';
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('blob:') ||
    url.startsWith('data:')
  ) {
    return url;
  }
  const base = API_BASE || '';
  return `${base}${url.startsWith('/') ? url : `/${url}`}`;
}

function storedToken() {
  try {
    const saved = JSON.parse(localStorage.getItem('lb_auth'));
    return saved?.token || null;
  } catch {
    return null;
  }
}

export async function api(path, { method = 'GET', body, token, formData } = {}) {
  const headers = {};
  const auth = token || storedToken();
  if (auth) {
    headers.Authorization = `Bearer ${auth}`;
  }
  let payload;
  if (formData) {
    payload = formData;
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }
  let res;
  try {
    res = await fetch(`${API}${path}`, {
      method,
      headers,
      body: payload,
    });
  } catch {
    throw new Error('Request failed: backend is not reachable.');
  }
  if (res.status === 204) {
    return null;
  }
  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }
  if (!res.ok) {
    const message = data?.message || data?.error || `Request failed (${res.status})`;
    const error = new Error(message);
    error.status = res.status;
    throw error;
  }
  return data;
}

export function toAuthUser(payload) {
  return {
    token: payload.token,
    user: {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      emailVerified: payload.emailVerified,
    },
  };
}
