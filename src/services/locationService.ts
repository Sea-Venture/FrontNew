import { API_VERSION } from '../config/api.config';
import { apiClient } from './apiClient';

export interface Location {
  id: number;
  name: string;
  description: string;
  latitude: string;
  longitude: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CreateLocationPayload {
  name: string;
  description: string;
  latitude: number;
  longitude: number;
}

export const LOCATION_API_ENDPOINTS = {
  CREATE: `${API_VERSION.v1}/locations`,
  GET: `${API_VERSION.v1}/locations`,
  SEARCH: `${API_VERSION.v1}/locations/search`,
  UPDATE: (id: number) => `${API_VERSION.v1}/locations/${id}`,
  DELETE: (id: number) => `${API_VERSION.v1}/locations/${id}`,
} as const;

export const locationService = {
  createLocation: async (data: CreateLocationPayload): Promise<Location> => {
    const response = await apiClient.post(LOCATION_API_ENDPOINTS.CREATE, data);
    return response?.data?.data || response?.data || response;
  },

  getAllLocations: async (name?: string): Promise<Location[]> => {
    const extractList = (resp: any) => {
      if (Array.isArray(resp)) return resp;
      if (Array.isArray(resp?.data)) return resp.data;
      if (Array.isArray(resp?.data?.data)) return resp.data.data;
      return [] as Location[];
    };

    if (name) {
      const params = new URLSearchParams();
      params.append('name', name);
      const url = `${LOCATION_API_ENDPOINTS.SEARCH}?${params.toString()}`;
      const response = await apiClient.get(url);
      return extractList(response);
    }

    const response = await apiClient.get(LOCATION_API_ENDPOINTS.GET);
    return extractList(response);
  },

  searchLocations: async (name: string): Promise<Location[]> => {
    const response = await apiClient.get(`${LOCATION_API_ENDPOINTS.SEARCH}?name=${encodeURIComponent(name)}`);
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.data?.data)) return response.data.data;
    return [];
  },

  updateLocation: async (id: number, data: Partial<CreateLocationPayload>): Promise<Location> => {
    const response = await apiClient.put(LOCATION_API_ENDPOINTS.UPDATE(id), data);
    return response?.data?.data || response?.data || response;
  },

  deleteLocation: async (id: number): Promise<void> => {
    await apiClient.delete(LOCATION_API_ENDPOINTS.DELETE(id));
  },

  getLocationById: async (id: number): Promise<Location | null> => {
    try {
      const response = await apiClient.get(LOCATION_API_ENDPOINTS.UPDATE(id));
      return response?.data?.data || response?.data || response || null;
    } catch (e) {
      return null;
    }
  },
};
