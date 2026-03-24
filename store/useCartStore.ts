import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  title: string
  type: string
  author: string
  price: number
  image: string
}

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  clearCart: () => void
  subtotal: number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => 
        set((state) => {
          // Prevent duplicates
          if (state.items.find(i => i.id === item.id)) return state
          return { items: [...state.items, item] }
        }),
      removeItem: (id) => 
        set((state) => ({ 
          items: state.items.filter((item) => item.id !== id) 
        })),
      clearCart: () => set({ items: [] }),
      get subtotal() {
        return get().items.reduce((acc, item) => acc + item.price, 0)
      }
    }),
    {
      name: 'digit-hup-cart', // key in local storage
    }
  )
)
