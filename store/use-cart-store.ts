import { create } from 'zustand'

type CartItem = {
  id: string
  title: string
  price: number
  type: 'service' | 'product'
  quantity: number
  addons?: any[]
  package?: string
}

type CartState = {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  setIsOpen: (isOpen: boolean) => void
  getUniqueItemsCount: () => number
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,
  addItem: (item) => set((state) => {
    const existingItem = state.items.find((i) => i.id === item.id)
    if (existingItem) {
      return {
        items: state.items.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        ),
      }
    }
    return { items: [...state.items, item] }
  }),
  removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
  updateQuantity: (id, quantity) => set((state) => ({
    items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
  })),
  clearCart: () => set({ items: [] }),
  setIsOpen: (isOpen) => set({ isOpen }),
  getUniqueItemsCount: () => get().items.length,
}))
