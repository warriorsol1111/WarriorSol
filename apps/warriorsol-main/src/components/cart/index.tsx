"use client";

import React from "react";
import Image from "next/image";
import { Loader2, Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import RecommendedProducts from "../community/recommendedProducts";
import { CartItem } from "@/store/cart-store";

const generateItemKey = (item: {
  id: string;
  color: string;
  size: string;
}): string => {
  return `${item.id}-${item.color}-${item.size}`;
};

export default function CartPage() {
  const {
    items,
    subtotal,
    updateQuantity,
    removeItem,
    updateQuantityGuest,
    removeItemGuest,
    itemLoading,
    cartLoading,
    isGuest,
  } = useCartStore();
  const isEmpty = items.length === 0;
  const [loading, setLoading] = React.useState(false);

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
    setLoading(true);

    try {
      if (isGuest) {
        // For guest users, create a guest checkout with all items
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
      } else {
        // Authenticated user checkout
        const res = await fetch("/api/shopify/getCheckout");
        const data = await res.json();
        if (res.ok && data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
        } else {
          console.error(data.error || "Failed to get checkout URL");
        }
      }
    } catch (error) {
      console.error("Failed to get checkout URL", error);
      alert("Failed to create checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen px-4 sm:px-6 md:px-12 lg:px-24 py-8 bg-white flex justify-center">
        <div className="w-full max-w-6xl">
          {/* Title */}
          <h1 className="text-[36px] sm:text-[48px] lg:text-[62px] font-normal text-center mb-2">
            Your Cart
          </h1>
          <p className="text-center text-lg sm:text-xl text-gray-500 mb-2">
            Review your items before proceeding to checkout
          </p>
          {isGuest && (
            <p className="text-center text-sm text-orange-600 mb-8">
              Sign in to save your cart items permanently
            </p>
          )}

          {/* Fallback: Empty Cart */}
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center mt-20 space-y-6 text-center text-gray-500">
              <p className="text-2xl font-medium text-gray-700">
                Your cart is feeling kinda lonely
              </p>
              <p className="text-base text-gray-500">
                Add some products to give it some company!
              </p>
              <Button
                variant="outline"
                className="mt-2 bg-[#EE9254] text-white"
                onClick={() => (window.location.href = "/products")}
              >
                Browse Products
              </Button>
            </div>
          ) : (
            <>
              {/* Table Header - Only visible on md+ */}
              <div className="hidden md:grid grid-cols-5 gap-4 mb-2">
                <div className="col-span-2 text-xl bg-[#fafafa] rounded-tl-lg py-3 text-center font-medium text-gray-700 border border-b-0 border-gray-200">
                  Item
                </div>
                <div className="bg-[#fafafa] py-3 text-xl text-center font-medium text-gray-700 border border-b-0 border-gray-200">
                  Price
                </div>
                <div className="bg-[#fafafa] py-3 text-xl text-center font-medium text-gray-700 border border-b-0 border-gray-200">
                  Quantity
                </div>
                <div className="bg-[#fafafa] text-xl rounded-tr-lg py-3 text-center font-medium text-gray-700 border border-b-0 border-gray-200">
                  Total
                </div>
              </div>

              {/* Cart Items */}
              <div className="space-y-6">
                {items.map((item) => {
                  const itemKey = generateItemKey(item);
                  const isItemLoading = isGuest
                    ? false
                    : !!item.lineId && itemLoading[item.lineId];

                  return (
                    <div
                      key={itemKey}
                      className="grid grid-cols-1 md:grid-cols-5 items-center gap-4 bg-white rounded-lg shadow-sm border border-gray-100 py-4 px-4"
                    >
                      {/* Item Info */}
                      <div className="flex flex-col sm:flex-row col-span-2 gap-4 items-start sm:items-center">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={90}
                          height={90}
                          className="rounded-md object-cover w-[90px] h-[90px]"
                        />
                        <div className="space-y-1 text-sm">
                          <div className="text-xs text-[#1F1F1FB2] font-medium">
                            Item
                          </div>
                          <p className="font-medium text-gray-900 leading-tight">
                            {item.name}
                          </p>
                          <div className="text-xs text-[#1F1F1FB2] font-medium mt-2">
                            Size
                          </div>
                          <p className="text-xs text-gray-700">{item.size}</p>
                          <div className="text-xs text-[#1F1F1FB2] font-medium mt-2">
                            Color
                          </div>
                          <p className="text-xs text-gray-700">{item.color}</p>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-center text-sm md:text-base">
                        ${item.price.toFixed(2)}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex justify-center items-center flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleUpdateQuantity(item, item.quantity - 1)
                          }
                          className="h-8 w-8 p-0 border-gray-300"
                          disabled={
                            cartLoading || isItemLoading || item.quantity === 1
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-medium text-base">
                          {String(item.quantity).padStart(2, "0")}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleUpdateQuantity(item, item.quantity + 1)
                          }
                          className="h-8 w-8 p-0 border-gray-300"
                          disabled={cartLoading || isItemLoading}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item)}
                          className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50"
                          disabled={cartLoading || isItemLoading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Total */}
                      <div className="text-right text-sm md:text-base font-medium text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Checkout Heading */}
              <div className="mt-10 mb-2 bg-[#fafafa] rounded text-center text-xl py-3 font-medium text-gray-700 border">
                Checkout Details
              </div>

              {/* Checkout Summary */}
              <div className="border-t pt-6 space-y-4 mx-auto max-w-xl">
                <div className="flex justify-between text-lg sm:text-xl">
                  <span>Cart Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg sm:text-xl font-semibold">
                  <span>Grand Total</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <Button
                  className="w-full py-3 mt-4 bg-[#EE9254] hover:bg-[#e07d38] text-white text-lg rounded"
                  disabled={loading}
                  onClick={handleCheckout}
                >
                  {loading ? (
                    <Loader2 className="animate-spin h-5 w-5 mr-2 inline-block" />
                  ) : (
                    "Checkout"
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      <RecommendedProducts />
    </>
  );
}
