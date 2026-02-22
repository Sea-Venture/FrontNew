import { API_VERSION } from '../config/api.config';
import { apiClient } from './apiClient';

import type { Post } from '@/pages/guide/types/types';

export const POST_API_ENDPOINTS = {
  BASE: `${API_VERSION.v1}/posts`,
  PAGINATED: `${API_VERSION.v1}/posts/paginated`,
  BY_ID: (id: number) => `${API_VERSION.v1}/posts/${id}`,
} as const;

const extractList = (resp: any): Post[] => {
  if (Array.isArray(resp)) return resp;
  if (Array.isArray(resp?.data)) return resp.data;
  if (Array.isArray(resp?.data?.data)) return resp.data.data;
  return [] as Post[];
};

export const postService = {
  getAllPosts: async (): Promise<Post[]> => {
    const response = await apiClient.get(POST_API_ENDPOINTS.BASE);
    return extractList(response);
  },

  getPaginatedPosts: async (page = 1, limit = 10): Promise<{ data: Post[]; total: number; page: number; limit: number }> => {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', String(limit));
    const url = `${POST_API_ENDPOINTS.PAGINATED}?${params.toString()}`;
    const response = await apiClient.get(url);

  
    const data = response?.data || response;
    return {
      data: Array.isArray(data?.data) ? data.data : extractList(data),
      total: Number(data?.total || 0),
      page: Number(data?.page || page),
      limit: Number(data?.limit || limit),
    };
  },

  getPost: async (id: number): Promise<Post | null> => {
    const response = await apiClient.get(POST_API_ENDPOINTS.BY_ID(id));
    return response?.data?.data || response?.data || response || null;
  },

  createPost: async (data: Partial<Post>): Promise<Post> => {
    const response = await apiClient.post(POST_API_ENDPOINTS.BASE, data);
    return response?.data?.data || response?.data || response;
  },

  updatePost: async (id: number, data: Partial<Post>): Promise<Post> => {
    const response = await apiClient.put(POST_API_ENDPOINTS.BY_ID(id), data);
    return response?.data?.data || response?.data || response;
  },

  deletePost: async (id: number): Promise<void> => {
    await apiClient.delete(POST_API_ENDPOINTS.BY_ID(id));
  },
};
