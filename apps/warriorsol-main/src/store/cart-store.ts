import { create } from "zustand";

export interface CartItem {
  id: string; // variantId
  name: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
  lineId?: string; // Shopify line item ID
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  subtotal: number;
  itemCount: number;
  checkoutUrl?: string;

  hydrateCart: () => Promise<void>;
  addItem: (
    item: Omit<CartItem, "quantity" | "lineId">,
    quantity: number
  ) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;

  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,
  subtotal: 0,
  itemCount: 0,
  checkoutUrl: undefined,

  hydrateCart: async () => {
    try {
      const res = await fetch("/api/shopify/getCart", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const shopifyItems: CartItem[] = data.cart.items || [];
      const subtotal = shopifyItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      const itemCount = shopifyItems.reduce(
        (acc, item) => acc + item.quantity,
        0
      );
      set({
        items: shopifyItems,
        subtotal,
        itemCount,
        checkoutUrl: data.cart.checkoutUrl,
      });
    } catch (err) {
      console.error("Failed to hydrate cart", err);
    }
  },

  addItem: async (item, quantity = 1) => {
    try {
      const res = await fetch("/api/shopify/addItemToCart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          merchandiseId: item.id,
          quantity,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      await get().hydrateCart();
    } catch (err) {
      console.error("Add item failed", err);
    }
  },

  removeItem: async (lineId: string) => {
    try {
      const res = await fetch("/api/shopify/removeItemFromCart", {
        method: "DELETE",
        body: JSON.stringify({ lineId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      await get().hydrateCart();
    } catch (err) {
      console.error("Remove item failed", err);
    }
  },

  updateQuantity: async (lineId: string, quantity: number) => {
    try {
      const res = await fetch("/api/shopify/updateCart", {
        method: "PATCH",
        body: JSON.stringify({ lineId, quantity }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      await get().hydrateCart();
    } catch (err) {
      console.error("Update quantity failed", err);
    }
  },

  clearCart: async () => {
    try {
      await fetch("/api/shopify/deleteCart", { method: "DELETE" });
      await get().hydrateCart();
    } catch (err) {
      console.error("Clear cart failed", err);
    }
  },

  toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
}));
