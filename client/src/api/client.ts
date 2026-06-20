const BASE_URL = import.meta.env.VITE_API_URL;

export interface ApiError extends Error {
  status?: number;
  errors?: string[];
}

export const apiFetch = async <T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> => {
  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  let data: any;
  const contentType = response.headers.get('Content-Type');
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  }

  if (!response.ok) {
    const error = new Error(
      data?.message || `HTTP Error: ${response.status} ${response.statusText}`
    ) as ApiError;
    error.status = response.status;
    if (data?.errors) {
      error.errors = data.errors;
    }
    throw error;
  }

  return data as T;
};
