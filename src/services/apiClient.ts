import { useAuthStore } from '../store/authStore';

type FetchOptions = RequestInit;

export const apiClient = {
  async request(endpoint: string, options: FetchOptions = {}) {
    const state = useAuthStore.getState();
    const token = state.accessToken;

    const makeFetch = (bearer?: string | null) =>
      fetch(endpoint, {
        ...options,
        headers: {
          ...options.headers,
          ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
          ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        },
        credentials: 'include',
      });

    const response = await makeFetch(token);

    if (response.status === 401 || response.status === 403) {
      try {
        useAuthStore.setState({ user: null, accessToken: null, isAuthenticated: false });
      } catch (e) {
        console.warn('Failed to clear auth state', e);
      }
      throw new Error('Authentication required');
    }

    if (!response.ok) {
      // Try to parse JSON error body, otherwise fall back to plain text
      let errorMessage = `HTTP ${response.status}`;
      try {
        const json = await response.json();
        if (json && typeof json === 'object') {
          if ('message' in json && json.message) errorMessage = String((json as any).message);
          else errorMessage = JSON.stringify(json);
        } else if (json) {
          errorMessage = String(json);
        }
      } catch (jsonErr) {
        try {
          const text = await response.text();
          if (text) errorMessage = text;
        } catch (textErr) {
          // ignore
        }
      }

      const err: any = new Error(errorMessage);
      err.status = response.status;
      throw err;
    }

    return response.json();
  },

  get(endpoint: string) {
    return this.request(endpoint, { method: 'GET' });
  },

  post(endpoint: string, data?: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  postFormData(endpoint: string, formData: FormData) {
    return this.request(endpoint, {
      method: 'POST',
      body: formData,
    });
  },

  put(endpoint: string, data?: any) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  patch(endpoint: string, data?: any) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  delete(endpoint: string) {
    return this.request(endpoint, { method: 'DELETE' });
  },
};