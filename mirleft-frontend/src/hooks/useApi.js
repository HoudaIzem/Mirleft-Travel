import { useCallback, useEffect, useState } from 'react';
import { API_BASE, apiFetch, normalizePaginated } from '../utils/apiHelpers';
import { useTranslation } from 'react-i18next';

export { API_BASE, apiFetch, normalizePaginated };

export async function postJson(path, body, token = null) {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const authToken = token || localStorage.getItem('auth_token');
  if (authToken && !token) headers.Authorization = `Bearer ${authToken}`;

  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  const json = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(json?.message || `API error: ${response.status}`);
  return json;
}

function usePaginatedCollection(path, params = {}) {
  const { i18n } = useTranslation();
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const query = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== '' && v != null),
  ).toString();

  const fullPath = query ? `${path}?${query}` : path;

  const reload = useCallback(() => {
    setLoading(true);
    setError(null);
    return apiFetch(fullPath)
      .then((json) => {
        const { items: list, meta: m } = normalizePaginated(json);
        setItems(list);
        setMeta(m);
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [fullPath]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    apiFetch(fullPath)
      .then((json) => {
        if (!mounted) return;
        const { items: list, meta: m } = normalizePaginated(json);
        setItems(list);
        setMeta(m);
      })
      .catch((err) => {
        if (mounted) setError(err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [fullPath, i18n.language]);

  return { data: items, items, meta, loading, error, reload };
}

function useItem(path, enabled = true) {
  const { i18n } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled || !path) return;
    let mounted = true;
    setLoading(true);
    apiFetch(path)
      .then((json) => {
        if (!mounted) return;
        setData(json?.data ?? json);
      })
      .catch((err) => {
        if (mounted) setError(err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [path, enabled, i18n.language]);

  return { data, loading, error };
}

export function useProperties(params = {}) {
  return usePaginatedCollection('/properties', { per_page: 12, ...params });
}

export function useVacationRentals(params = {}) {
  return usePaginatedCollection('/vacation-rentals', { per_page: 12, ...params });
}

export function useProperty(id) {
  return useItem(id ? `/properties/${id}` : null, Boolean(id));
}

export function useRestaurants(params = {}) {
  return usePaginatedCollection('/restaurants', { per_page: 12, ...params });
}

export function useRestaurant(id) {
  return useItem(id ? `/restaurants/${id}` : null, Boolean(id));
}

export function useActivities(params = {}) {
  return usePaginatedCollection('/activities', { per_page: 12, ...params });
}

export function useActivity(id) {
  return useItem(id ? `/activities/${id}` : null, Boolean(id));
}

export function useHome() {
  const { i18n } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiFetch('/home')
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [i18n.language]);

  return { data, loading, error };
}
