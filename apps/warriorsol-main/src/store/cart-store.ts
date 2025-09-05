import { create } from "zustand";
import toast from "react-hot-toast";

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

  // Per-item loading state
  itemLoading: Record<string, boolean>;

  // Global cart loading state
  cartLoading: boolean;

  hydrateCart: () => Promise<void>;
  addItem: (
    item: Omit<CartItem, "quantity" | "lineId">,
    quantity: number,
    userId: string
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
  itemLoading: {},
  cartLoading: false,

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

  addItem: async (item, quantity = 1, userId) => {
    set({ cartLoading: true });
    toast.dismiss();
    toast.loading("Adding item to cart...");
    try {
      const res = await fetch("/api/shopify/addItemToCart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          merchandiseId: item.id,
          quantity,
          userId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      await get().hydrateCart();
      toast.dismiss();
      toast.success("Item added to cart!");
    } catch (err) {
      console.error("Add item failed", err);
      toast.dismiss();
      toast.error("Failed to add item to cart");
    } finally {
      set({ cartLoading: false });
    }
  },

  removeItem: async (lineId: string) => {
    set((state) => ({ itemLoading: { ...state.itemLoading, [lineId]: true } }));
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
    } finally {
      set((state) => {
        // Omit the property by destructuring, intentionally unused for property removal
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [lineId]: _removed, ...rest } = state.itemLoading;
        return { itemLoading: rest };
      });
      toast.dismiss();
      toast.success("Item removed successfully");
    }
  },

  updateQuantity: async (lineId: string, quantity: number) => {
    set((state) => ({ itemLoading: { ...state.itemLoading, [lineId]: true } }));
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
    } finally {
      set((state) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [lineId]: _unused, ...rest } = state.itemLoading;
        return { itemLoading: rest };
      });
      toast.dismiss();
      toast.success("Item updated successfully");
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
