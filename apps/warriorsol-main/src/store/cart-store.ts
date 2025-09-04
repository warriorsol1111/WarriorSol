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
  lineId?: string; // Shopify line item ID (only for authenticated users)
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  subtotal: number;
  itemCount: number;
  checkoutUrl?: string;
  isGuest: boolean; // Track if user is guest

  // Per-item loading state
  itemLoading: Record<string, boolean>;

  // Global cart loading state
  cartLoading: boolean;

  hydrateCart: (isAuthenticated?: boolean) => Promise<void>;
  addItem: (
    item: Omit<CartItem, "quantity" | "lineId">,
    quantity: number,
    userId?: string
  ) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;

  // Guest cart methods
  addItemGuest: (
    item: Omit<CartItem, "quantity" | "lineId">,
    quantity: number
  ) => void;
  removeItemGuest: (itemKey: string) => void;
  updateQuantityGuest: (itemKey: string, quantity: number) => void;
  clearGuestCart: () => void;
  migrateGuestCartToUser: (userId: string) => Promise<void>;
  createGuestCheckout: () => Promise<void>;

  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const GUEST_CART_KEY = "guest-cart";

// Helper functions for guest cart
const getGuestCart = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const cart = localStorage.getItem(GUEST_CART_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch {
    return [];
  }
};

const setGuestCart = (items: CartItem[]): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Failed to save guest cart:", error);
  }
};

const generateItemKey = (
  item: Omit<CartItem, "quantity" | "lineId">
): string => {
  return `${item.id}-${item.color}-${item.size}`;
};

const calculateCartTotals = (items: CartItem[]) => {
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  return { subtotal, itemCount };
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,
  subtotal: 0,
  itemCount: 0,
  checkoutUrl: undefined,
  itemLoading: {},
  cartLoading: false,
  isGuest: false,

  hydrateCart: async (isAuthenticated = false) => {
    if (isAuthenticated) {
      // Authenticated user - fetch from Shopify
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
        const { subtotal, itemCount } = calculateCartTotals(shopifyItems);

        set({
          items: shopifyItems,
          subtotal,
          itemCount,
          checkoutUrl: data.cart.checkoutUrl,
          isGuest: false,
        });
      } catch (err) {
        console.error("Failed to hydrate authenticated cart", err);
      }
    } else {
      // Guest user - load from localStorage
      const guestItems = getGuestCart();
      const { subtotal, itemCount } = calculateCartTotals(guestItems);

      set({
        items: guestItems,
        subtotal,
        itemCount,
        checkoutUrl: undefined,
        isGuest: true,
      });
    }
  },
  createGuestCheckout: async () => {
    const { items } = get();

    if (items.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    try {
      set({ cartLoading: true });
      toast.dismiss();
      toast.loading("Redirecting to checkout...");

      const res = await fetch("/api/shopify/createGuestCheckout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            variantId: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      set({ checkoutUrl: data.checkoutUrl });
      toast.dismiss();
      window.location.href = data.checkoutUrl; // 🚀 Shopify checkout
    } catch (err) {
      console.error("Guest checkout failed", err);
      toast.dismiss();
      toast.error("Failed to start checkout");
    } finally {
      set({ cartLoading: false });
    }
  },

  addItem: async (item, quantity = 1, userId) => {
    const { isGuest } = get();

    if (isGuest || !userId) {
      get().addItemGuest(item, quantity);
      return;
    }

    // Authenticated user logic (existing)
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

      await get().hydrateCart(true);
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
    const { isGuest } = get();

    if (isGuest) {
      get().removeItemGuest(lineId);
      return;
    }

    // Authenticated user logic (existing)
    set((state) => ({ itemLoading: { ...state.itemLoading, [lineId]: true } }));
    try {
      const res = await fetch("/api/shopify/removeItemFromCart", {
        method: "DELETE",
        body: JSON.stringify({ lineId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      await get().hydrateCart(true);
    } catch (err) {
      console.error("Remove item failed", err);
    } finally {
      set((state) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [lineId]: _removed, ...rest } = state.itemLoading;
        return { itemLoading: rest };
      });
      toast.dismiss();
      toast.success("Item removed successfully");
    }
  },

  updateQuantity: async (lineId: string, quantity: number) => {
    const { isGuest } = get();

    if (isGuest) {
      get().updateQuantityGuest(lineId, quantity);
      return;
    }

    // Authenticated user logic (existing)
    set((state) => ({ itemLoading: { ...state.itemLoading, [lineId]: true } }));
    try {
      const res = await fetch("/api/shopify/updateCart", {
        method: "PATCH",
        body: JSON.stringify({ lineId, quantity }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      await get().hydrateCart(true);
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
    const { isGuest } = get();

    if (isGuest) {
      get().clearGuestCart();
      return;
    }

    // Authenticated user logic (existing)
    try {
      await fetch("/api/shopify/deleteCart", { method: "DELETE" });
      await get().hydrateCart(true);
    } catch (err) {
      console.error("Clear cart failed", err);
    }
  },

  // Guest cart methods
  addItemGuest: (item, quantity = 1) => {
    const itemKey = generateItemKey(item);
    const currentItems = getGuestCart();

    const existingItemIndex = currentItems.findIndex(
      (cartItem) => generateItemKey(cartItem) === itemKey
    );

    let updatedItems: CartItem[];
    if (existingItemIndex >= 0) {
      // Update existing item quantity
      updatedItems = currentItems.map((cartItem, index) =>
        index === existingItemIndex
          ? { ...cartItem, quantity: cartItem.quantity + quantity }
          : cartItem
      );
    } else {
      // Add new item
      const newItem: CartItem = {
        ...item,
        quantity,
        lineId: itemKey, // Use itemKey as lineId for guest items
      };
      updatedItems = [...currentItems, newItem];
    }

    setGuestCart(updatedItems);
    const { subtotal, itemCount } = calculateCartTotals(updatedItems);

    set({
      items: updatedItems,
      subtotal,
      itemCount,
    });

    toast.dismiss();
    toast.success("Item added to cart!");
  },

  removeItemGuest: (itemKey: string) => {
    const currentItems = getGuestCart();
    const updatedItems = currentItems.filter(
      (item) => generateItemKey(item) !== itemKey
    );

    setGuestCart(updatedItems);
    const { subtotal, itemCount } = calculateCartTotals(updatedItems);

    set({
      items: updatedItems,
      subtotal,
      itemCount,
    });

    toast.dismiss();
    toast.success("Item removed successfully");
  },

  updateQuantityGuest: (itemKey: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeItemGuest(itemKey);
      return;
    }

    const currentItems = getGuestCart();
    const updatedItems = currentItems.map((item) =>
      generateItemKey(item) === itemKey ? { ...item, quantity } : item
    );

    setGuestCart(updatedItems);
    const { subtotal, itemCount } = calculateCartTotals(updatedItems);

    set({
      items: updatedItems,
      subtotal,
      itemCount,
    });

    toast.dismiss();
    toast.success("Item updated successfully");
  },

  clearGuestCart: () => {
    setGuestCart([]);
    set({
      items: [],
      subtotal: 0,
      itemCount: 0,
    });
  },

  migrateGuestCartToUser: async (userId: string) => {
    const guestItems = getGuestCart();
    if (guestItems.length === 0) return;

    set({ cartLoading: true });

    try {
      // Add each guest item to authenticated cart
      for (const item of guestItems) {
        await fetch("/api/shopify/addItemToCart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            merchandiseId: item.id,
            quantity: item.quantity,
            userId,
          }),
        });
      }

      // Clear guest cart and refresh authenticated cart
      get().clearGuestCart();
      await get().hydrateCart(true);

      toast.success("Cart items transferred successfully!");
    } catch (error) {
      console.error("Failed to migrate guest cart:", error);
      toast.error("Failed to transfer cart items");
    } finally {
      set({ cartLoading: false });
    }
  },

  toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
}));
