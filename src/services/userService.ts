import { API_VERSION } from '../config/api.config';
import { apiClient } from './apiClient';

export const USER_API_ENDPOINTS = {
  GET: (id: number | string) => `${API_VERSION.v1}/users/${id}`,
} as const;

export const userService = {
  getUserById: async (id: number): Promise<any | null> => {
    try {
      const response = await apiClient.get(USER_API_ENDPOINTS.GET(id));
      return response?.data?.data || response?.data || response || null;
    } catch (e) {
      return null;
    }
  },
};
