import i18n from '../i18n';

export const API_BASE = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api';

export const MODEL_TYPES = {
  property: 'App\\Models\\Property',
  restaurant: 'App\\Models\\Restaurant',
  activity: 'App\\Models\\Activity',
  destination: 'App\\Models\\Destination',
};

/** Unwrap Laravel API resources & paginated responses */
export function unwrapResource(json) {
  if (json == null) return null;
  if (json.data !== undefined && !Array.isArray(json.data) && typeof json.data === 'object') {
    return json.data;
  }
  return json;
}

export function normalizePaginated(json) {
  if (Array.isArray(json)) return { items: json, meta: null };
  if (Array.isArray(json?.data)) {
    return { items: json.data, meta: json.meta ?? null };
  }
  const unwrapped = unwrapResource(json);
  if (Array.isArray(unwrapped)) return { items: unwrapped, meta: null };
  return { items: [], meta: null };
}

export function authHeaders() {
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiFetch(path, options = {}) {
  const currentLang = i18n.language;
  
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Accept-Language': currentLang,
      ...authHeaders(),
      ...(options.headers || {}),
    },
  });

  const json = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(json?.message || `API error ${response.status}`);
  }

  return json;
}
