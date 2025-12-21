import { API_VERSION } from '../config/api.config';

export const AUTH_API_ENDPOINTS = {
  LOGIN: `${API_VERSION.v1}/auth/login`,
  REGISTER: `${API_VERSION.v1}/auth/register`,
  LOGOUT: `${API_VERSION.v1}/auth/logout`,
  REFRESH_TOKEN: `${API_VERSION.v1}/auth/refresh-token`,
  ME: `${API_VERSION.v1}/auth/me`
} as const;

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  accesses?: Array<{
    resource: string;
    actions: boolean;
  }>;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name?: string;
    accesses?: Array<{
      resource: string;
      actions: boolean;
    }>;
  };
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}


const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  return response.json();
};


const getAuthHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};


export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await fetch(AUTH_API_ENDPOINTS.LOGIN, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(credentials),
  });

  return handleResponse(response);
};


export const register = async (userData: RegisterData): Promise<AuthResponse> => {
  const registerPayload = {
    ...userData,
    accesses: userData.accesses || [
      {
        resource: "grant_user",
        actions: true
      }
    ]
  };

  const response = await fetch(AUTH_API_ENDPOINTS.REGISTER, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(registerPayload),
  });

  return handleResponse(response);
};


export const logout = async (token?: string): Promise<void> => {
  const response = await fetch(AUTH_API_ENDPOINTS.LOGOUT, {
    method: 'POST',
    headers: getAuthHeaders(token),
  });

  if (!response.ok) {
    console.warn('Logout request failed, but proceeding with local cleanup');
  }
};

export const refreshToken = async (refreshToken: string): Promise<RefreshTokenResponse> => {
  const response = await fetch(AUTH_API_ENDPOINTS.REFRESH_TOKEN, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ refreshToken }),
  });

  return handleResponse(response);
};

export const getCurrentUser = async (token: string) => {
  const response = await fetch(AUTH_API_ENDPOINTS.ME, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });

  return handleResponse(response);
};


