import { create } from "zustand";

export interface CartItem {
  id: string;
  name: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  subtotal: number;
  itemCount: number;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,
  subtotal: 0,
  itemCount: 0,

  addItem: (item) => {
    const { items } = get();
    const existing = items.find(
      (i) => i.id === item.id && i.color === item.color && i.size === item.size
    );

    let newItems;
    if (existing) {
      newItems = items.map((i) =>
        i.id === existing.id &&
        i.color === existing.color &&
        i.size === existing.size
          ? { ...i, quantity: i.quantity + 1 }
          : i
      );
    } else {
      newItems = [...items, { ...item, quantity: 1 }];
    }

    const subtotal = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const itemCount = newItems.reduce((sum, i) => sum + i.quantity, 0);

    set({ items: newItems, subtotal, itemCount });
  },

  removeItem: (id) => {
    const newItems = get().items.filter((i) => i.id !== id);
    const subtotal = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const itemCount = newItems.reduce((sum, i) => sum + i.quantity, 0);
    set({ items: newItems, subtotal, itemCount });
  },

  updateQuantity: (id, quantity) => {
    if (quantity <= 0) {
      get().removeItem(id);
      return;
    }

    const newItems = get().items.map((i) =>
      i.id === id ? { ...i, quantity } : i
    );

    const subtotal = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const itemCount = newItems.reduce((sum, i) => sum + i.quantity, 0);

    set({ items: newItems, subtotal, itemCount });
  },

  clearCart: () => set({ items: [], subtotal: 0, itemCount: 0 }),

  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
}));
