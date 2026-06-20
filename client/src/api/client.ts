const BASE_URL = 'http://localhost:8000/api';

export interface ApiError extends Error {
  status?: number;
  errors?: string[];
}

export const apiFetch = async <T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = localStorage.getItem('token');
  
  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
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
