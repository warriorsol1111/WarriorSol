"use client";

import { create } from "zustand";

interface WishlistItem {
  id: string;
  userId: string;
  variantId: string;
  createdAt: string;
}

interface WishlistState {
  items: string[]; // we’ll just store variantIds here
  count: number;
  hydrateWishlist: (token: string) => Promise<void>;
  addItem: (variantId: string) => void;
  removeItem: (variantId: string) => void;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  count: 0,

  hydrateWishlist: async (token: string) => {
    try {
      const [itemsRes, countRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/wishlist/count`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const itemsData = await itemsRes.json();
      const countData = await countRes.json();

      set({
        items: itemsData?.data?.map((i: WishlistItem) => i.variantId) || [],
        count: Number(countData?.data || 0),
      });
    } catch (err) {
      console.error("Error hydrating wishlist:", err);
    }
  },

  addItem: (variantId) => {
    const { items, count } = get();
    if (!items.includes(variantId)) {
      set({
        items: [...items, variantId],
        count: count + 1,
      });
    }
  },

  removeItem: (variantId) => {
    const { items, count } = get();
    set({
      items: items.filter((id) => id !== variantId),
      count: Math.max(count - 1, 0),
    });
  },

  clearWishlist: () => {
    set({ items: [], count: 0 });
  },
}));
