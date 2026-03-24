import { create } from 'zustand'

type UserSession = {
  user: any | null
  role: 'buyer' | 'seller' | 'publisher' | 'admin' | null
  isLoading: boolean
  setUser: (user: any) => void
  setRole: (role: 'buyer' | 'seller' | 'publisher' | 'admin' | null) => void
  setLoading: (loading: boolean) => void
}

export const useUserStore = create<UserSession>((set) => ({
  user: null,
  role: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setRole: (role) => set({ role }),
  setLoading: (isLoading) => set({ isLoading }),
}))
