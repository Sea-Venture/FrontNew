import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  locationService,
  type Location,
  type CreateLocationPayload,
} from '../services/locationService';

interface LocationState {
  locations: Location[];
  searchResults: Location[];
  selectedLocation: Location | null;
  isLoading: boolean;
  isSearching: boolean;
  error: string | null;
  totalCount: number;
}

interface LocationActions {
  fetchAllLocations: (searchName?: string) => Promise<void>;
  
  searchLocations: (name: string) => Promise<void>;
  
  createLocation: (data: CreateLocationPayload) => Promise<Location>;
  
  updateLocation: (id: number, data: Partial<CreateLocationPayload>) => Promise<Location>;
  
  deleteLocation: (id: number) => Promise<void>;
  
  selectLocation: (location: Location | null) => void;
  
  clearError: () => void;
  clearSearchResults: () => void;
  reset: () => void;
}

type LocationStore = LocationState & LocationActions;

const initialState: LocationState = {
  locations: [],
  searchResults: [],
  selectedLocation: null,
  isLoading: false,
  isSearching: false,
  error: null,
  totalCount: 0,
};

export const useLocationStore = create<LocationStore>()(
  persist(
    (set) => ({
      ...initialState,

      fetchAllLocations: async (searchName?: string) => {
        set({ isLoading: true, error: null });

        try {
          const data = await locationService.getAllLocations(searchName);
          const locationsArray = Array.isArray(data) ? data : (data as any)?.data || [];
          set({
            locations: locationsArray,
            totalCount: locationsArray.length,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch locations',
          });
          throw error;
        }
      },

      searchLocations: async (name: string) => {
        if (!name.trim()) {
          set({ searchResults: [], isSearching: false });
          return;
        }

        set({ isSearching: true, error: null });

        try {
          const data = await locationService.searchLocations(name);
          const resultsArray = Array.isArray(data) ? data : (data as any)?.data || [];
          set({
            searchResults: resultsArray,
            isSearching: false,
            error: null,
          });
        } catch (error) {
          set({
            isSearching: false,
            error: error instanceof Error ? error.message : 'Failed to search locations',
          });
          throw error;
        }
      },

      createLocation: async (data: CreateLocationPayload) => {
        set({ isLoading: true, error: null });

        try {
          const newLocation = await locationService.createLocation(data);
          set((state) => ({
            locations: [newLocation, ...state.locations],
            totalCount: state.totalCount + 1,
            isLoading: false,
            error: null,
          }));
          return newLocation;
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to create location',
          });
          throw error;
        }
      },

      updateLocation: async (id: number, data: Partial<CreateLocationPayload>) => {
        set({ isLoading: true, error: null });

        try {
          const updatedLocation = await locationService.updateLocation(id, data);
          set((state) => ({
            locations: state.locations.map((loc) =>
              loc.id === id ? updatedLocation : loc
            ),
            selectedLocation:
              state.selectedLocation?.id === id ? updatedLocation : state.selectedLocation,
            isLoading: false,
            error: null,
          }));
          return updatedLocation;
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to update location',
          });
          throw error;
        }
      },

      deleteLocation: async (id: number) => {
        set({ isLoading: true, error: null });

        try {
          await locationService.deleteLocation(id);
          set((state) => ({
            locations: state.locations.filter((loc) => loc.id !== id),
            searchResults: state.searchResults.filter((loc) => loc.id !== id),
            selectedLocation:
              state.selectedLocation?.id === id ? null : state.selectedLocation,
            totalCount: Math.max(0, state.totalCount - 1),
            isLoading: false,
            error: null,
          }));
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to delete location',
          });
          throw error;
        }
      },

      selectLocation: (location: Location | null) => {
        set({ selectedLocation: location });
      },

      clearError: () => set({ error: null }),

      clearSearchResults: () => set({ searchResults: [] }),

      reset: () => set(initialState),
    }),
    {
      name: 'location-storage',
      partialize: (state) => ({
        locations: state.locations,
        selectedLocation: state.selectedLocation,
        totalCount: state.totalCount,
      }),
    }
  )
);


export const useLocations = () => useLocationStore((state) => state.locations);
export const useSearchResults = () => useLocationStore((state) => state.searchResults);
export const useSelectedLocation = () => useLocationStore((state) => state.selectedLocation);
export const useLocationLoading = () => useLocationStore((state) => state.isLoading);
export const useLocationSearching = () => useLocationStore((state) => state.isSearching);
export const useLocationError = () => useLocationStore((state) => state.error);
export const useLocationTotalCount = () => useLocationStore((state) => state.totalCount);
