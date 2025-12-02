import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SortConfig, User } from '../types';

interface UserPreferences {
  pageSize: number;
}

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;

  search: string;
  genderFilter: string;
  sort: SortConfig;
  page: number;
  preferences: UserPreferences;
  selectedIds: Set<string>;

  setUsers: (users: User[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  setSearch: (value: string) => void;
  setGenderFilter: (gender: string) => void;
  setSort: (sort: SortConfig) => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;

  addUser: (user: User) => void;
  updateUser: (id: string, patch: Partial<User>) => void;
  deleteUser: (id: string) => void;
  deleteSelected: () => void;

  toggleSelect: (id: string) => void;
  clearSelection: () => void;
  selectAll: (ids: string[]) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      users: [],
      loading: false,
      error: null,
      search: '',
      genderFilter: 'all',
      sort: { key: null, direction: 'asc' },
      page: 1,
      preferences: {
        pageSize: 10,
      },
      selectedIds: new Set<string>(),

      setUsers: (users) => set({ users }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      setSearch: (value) => set({ search: value, page: 1 }),
      setGenderFilter: (gender) => set({ genderFilter: gender, page: 1 }),
      setSort: (sort) => set({ sort }),
      setPage: (page) => set({ page }),
      setPageSize: (size) =>
        set((state) => ({
          preferences: { ...state.preferences, pageSize: size },
          page: 1,
        })),

      addUser: (user) =>
        set((state) => ({
          users: [...state.users, user],
        })),

      updateUser: (id, patch) =>
        set((state) => ({
          users: state.users.map((u) =>
            u.id === id ? { ...u, ...patch } : u,
          ),
        })),

      deleteUser: (id) =>
        set((state) => ({
          users: state.users.filter((u) => u.id !== id),
          selectedIds: new Set(
            [...state.selectedIds].filter((selectedId) => selectedId !== id),
          ),
        })),

      deleteSelected: () =>
        set((state) => ({
          users: state.users.filter((u) => !state.selectedIds.has(u.id)),
          selectedIds: new Set(),
        })),

      toggleSelect: (id) =>
        set((state) => {
          const next = new Set(state.selectedIds);
          if (next.has(id)) next.delete(id);
          else next.add(id);
          return { selectedIds: next };
        }),

      clearSelection: () => set({ selectedIds: new Set() }),

      selectAll: (ids: string[]) =>
        set(() => ({ selectedIds: new Set(ids) })),
    }),
    {
      name: 'user-dashboard-store',
      partialize: (state) => ({
        users: state.users,
        preferences: state.preferences,
      }),
    },
  ),
);
