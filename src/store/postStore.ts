import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { postService } from '@/services/postService';
import type { Post } from '@/pages/guide/types/types';

interface PostState {
  posts: Post[];
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  error: string | null;
}

interface PostActions {
  fetchPosts: (page?: number, limit?: number) => Promise<void>;
  createPost: (data: Partial<Post>) => Promise<Post | null>;
  updatePost: (id: number, data: Partial<Post>) => Promise<Post | null>;
  deletePost: (id: number) => Promise<void>;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  clearError: () => void;
  reset: () => void;
}

type PostStore = PostState & PostActions;

const initialState: PostState = {
  posts: [],
  total: 0,
  page: 1,
  limit: 10,
  isLoading: false,
  error: null,
};

export const usePostStore = create<PostStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      fetchPosts: async (page = get().page, limit = get().limit) => {
        set({ isLoading: true, error: null });
        try {
          const resp = await postService.getPaginatedPosts(page, limit);
          set({ posts: resp.data, total: resp.total, page: resp.page, limit: resp.limit, isLoading: false, error: null });
        } catch (error: any) {
          set({ isLoading: false, error: error instanceof Error ? error.message : String(error) });
          throw error;
        }
      },

      createPost: async (data: Partial<Post>) => {
        set({ isLoading: true, error: null });
        try {
          const created = await postService.createPost(data);
          // refresh current page
          await get().fetchPosts(get().page, get().limit);
          set({ isLoading: false });
          return created as Post;
        } catch (error: any) {
          set({ isLoading: false, error: error instanceof Error ? error.message : String(error) });
          return null;
        }
      },

      updatePost: async (id: number, data: Partial<Post>) => {
        set({ isLoading: true, error: null });
        try {
          const updated = await postService.updatePost(id, data);
          await get().fetchPosts(get().page, get().limit);
          set({ isLoading: false });
          return updated as Post;
        } catch (error: any) {
          set({ isLoading: false, error: error instanceof Error ? error.message : String(error) });
          return null;
        }
      },

      deletePost: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
          await postService.deletePost(id);
          await get().fetchPosts(get().page, get().limit);
          set({ isLoading: false });
        } catch (error: any) {
          set({ isLoading: false, error: error instanceof Error ? error.message : String(error) });
          throw error;
        }
      },

      setPage: (page: number) => set({ page }),
      setLimit: (limit: number) => set({ limit }),
      clearError: () => set({ error: null }),
      reset: () => set(initialState),
    }),
    {
      name: 'post-storage',
      partialize: (s) => ({ posts: s.posts, total: s.total, page: s.page, limit: s.limit }),
    }
  )
);

export const usePosts = () => usePostStore((s) => s.posts);
export const usePostPage = () => usePostStore((s) => s.page);
export const usePostLimit = () => usePostStore((s) => s.limit);
export const usePostTotal = () => usePostStore((s) => s.total);
export const usePostLoading = () => usePostStore((s) => s.isLoading);
export const usePostError = () => usePostStore((s) => s.error);
