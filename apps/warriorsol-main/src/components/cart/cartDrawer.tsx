"use client";

import React, { useState } from "react";
import { X, Plus, Minus, Trash2, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { useCartStore } from "@/store/cart-store";
import Image from "next/image";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerHeader,
  DrawerFooter,
  DrawerClose,
} from "../ui/drawer";
import { useRouter } from "next/navigation";
import { MdOutlineShoppingBag } from "react-icons/md";
import NProgress from "nprogress";
import { CartItem } from "@/store/cart-store";

const generateItemKey = (item: CartItem): string => {
  return `${item.id}-${item.color}-${item.size}`;
};

export default function CartDrawer() {
  const router = useRouter();
  const {
    items,
    isOpen,
    subtotal,
    closeCart,
    updateQuantity,
    removeItem,
    updateQuantityGuest,
    removeItemGuest,
    itemLoading,
    cartLoading,
    isGuest,
  } = useCartStore();
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleUpdateQuantity = (item: CartItem, quantity: number) => {
    if (isGuest) {
      const itemKey = generateItemKey(item);
      updateQuantityGuest(itemKey, quantity);
    } else {
      updateQuantity(item.lineId!, quantity);
    }
  };

  const handleRemoveItem = (item: CartItem) => {
    if (isGuest) {
      const itemKey = generateItemKey(item);
      removeItemGuest(itemKey);
    } else {
      removeItem(item.lineId!);
    }
  };

  const handleCheckout = async () => {
    if (isGuest) {
      // For guest users, create a guest checkout with all items
      setLoading(true);
      try {
        const response = await fetch("/api/shopify/createGuestCheckout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: items.map((item) => ({
              variantId: item.id,
              quantity: item.quantity,
            })),
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create checkout");
        }

        const data = await response.json();
        window.location.href = data.checkoutUrl;
      } catch (error) {
        console.error("Error creating checkout:", error);
        alert("Failed to create checkout. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      // Authenticated user checkout (existing logic)
      setLoading(true);
      try {
        const res = await fetch("/api/shopify/getCheckout");
        const data = await res.json();
        if (res.ok && data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
        } else {
          alert(data.error || "Failed to get checkout URL");
        }
      } catch {
        alert("Failed to get checkout URL");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open) => (open ? null : closeCart())}
      direction="right"
    >
      <DrawerTitle className="sr-only">Cart Drawer</DrawerTitle>
      <DrawerContent className="w-full sm:max-w-2xl h-full p-0">
        <div className="flex flex-col h-full bg-white">
          {/* Header */}
          <DrawerHeader className="border-b border-gray-200 px-4 sm:px-8 py-4 sm:py-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl sm:text-[42px] text-[#1F1F1F] font-normal tracking-wide">
                Items In Your Cart
              </h2>
              <DrawerClose asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 hover:bg-gray-100"
                >
                  <X className="h-6 sm:h-8 w-6 sm:w-8" />
                </Button>
              </DrawerClose>
            </div>
            {isGuest && (
              <p className="text-sm text-gray-600 mt-2">
                Sign in to save your cart items
              </p>
            )}
          </DrawerHeader>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-4 sm:py-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <p className="text-lg mb-2">Your cart is empty</p>
                <p className="text-sm">Add some items to get started!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {items.map((item) => {
                  const itemKey = generateItemKey(item);
                  const isItemLoading = isGuest
                    ? false
                    : !!item.lineId && itemLoading[item.lineId];

                  return (
                    <div
                      key={itemKey}
                      className="flex flex-col gap-3 pb-6 border-b border-gray-100 last:border-b-0"
                    >
                      {/* Top row: image + details */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Product Image */}
                        <div className="w-full sm:w-[118px] max-w-[100px] sm:max-w-none aspect-square rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={118}
                            height={118}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="grid grid-cols-[1.5fr_1.2fr_auto] gap-4 sm:gap-6 items-start">
                            {/* Item & Size */}
                            <div>
                              <div className="mb-3">
                                <p className="text-xs text-[#1F1F1FB2] uppercase tracking-wide mb-1">
                                  Item
                                </p>
                                <p className="text-sm text-[#1F1F1F] font-medium truncate max-w-[200px]">
                                  {item.name}
                                </p>
                              </div>

                              <div>
                                <p className="text-xs text-[#1F1F1FB2] uppercase tracking-wide mb-1">
                                  Size
                                </p>
                                <p className="text-sm text-[#1F1F1F]">
                                  {item.size || "—"}
                                </p>
                              </div>
                            </div>

                            {/* Color & Price */}
                            <div>
                              <div className="mb-3">
                                <p className="text-xs text-[#1F1F1FB2] uppercase tracking-wide mb-1">
                                  Color
                                </p>
                                <p className="text-sm text-[#1F1F1F]">
                                  {item.color || "—"}
                                </p>
                              </div>

                              <div className="mb-3">
                                <p className="text-xs text-[#1F1F1FB2] uppercase tracking-wide mb-1">
                                  Price
                                </p>
                                <p className="text-sm text-[#1F1F1F]">
                                  ${item.price.toFixed(2)}
                                </p>
                              </div>
                            </div>

                            {/* Remove Button */}
                            <div className="flex justify-end">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveItem(item)}
                                className="p-1 w-8 h-8 bg-red-100 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-sm"
                                disabled={cartLoading || isItemLoading}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom row: Quantity controls */}
                      <div className="flex items-center justify-center sm:justify-between w-[90%] ml-8 border-t border-gray-100 pt-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleUpdateQuantity(item, item.quantity - 1)
                          }
                          className="!w-7 !h-7  !rounded-full border !disabled:cursor-not-allowed border-[#141B34] text-[#141B34] hover:text-black hover:border-black"
                          disabled={
                            cartLoading || isItemLoading || item.quantity === 1
                          }
                        >
                          <Minus className="w-3 h-3" />
                        </Button>

                        <span className="text-lg font-medium flex-1 text-center">
                          {item.quantity.toString().padStart(2, "0")}
                        </span>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleUpdateQuantity(item, item.quantity + 1)
                          }
                          className="!w-7 !h-7 !rounded-full border !disabled:cursor-not-allowed border-[#141B34] text-[#141B34] hover:text-black hover:border-black"
                          disabled={cartLoading || isItemLoading}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <DrawerFooter className="border-t border-gray-200 px-4 sm:px-8 py-4 sm:py-6 space-y-6">
              {/* Subtotal */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <p className="text-2xl sm:text-[32px] font-normal text-[#1F1F1F] mb-1">
                    Sub Total
                  </p>
                  <p className="text-xs text-gray-500">
                    Taxes And Shipping Calculated At Checkout
                  </p>
                </div>
                <p className="text-2xl sm:text-[32px] font-normal text-[#1F1F1F] mb-1">
                  ${subtotal.toFixed(0)}
                </p>
              </div>

              {/* Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  onClick={handleCheckout}
                  className="w-full py-4 sm:py-5 h-13 text-[20px]  sm:text-xl bg-[#EE9254] hover:bg-[#e8823d] text-white rounded-md"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="inline-block mr-2 animate-spin w-4 h-4" />
                  ) : (
                    "Checkout"
                  )}
                </Button>
                <Button
                  onClick={() => {
                    NProgress.start();
                    router.push("/cart");
                    closeCart();
                  }}
                  variant="outline"
                  className="w-full py-4 sm:py-5 text-lg sm:text-xl text-[#1F1F1FCC] border-[#1F1F1F] border h-13 hover:bg-gray-50 rounded-md"
                >
                  <MdOutlineShoppingBag className="inline-block mr-2 !w-6 !h-6" />
                  Goto Cart
                </Button>
              </div>
            </DrawerFooter>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
