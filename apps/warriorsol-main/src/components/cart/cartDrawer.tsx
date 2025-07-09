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

export default function CartDrawer() {
  const router = useRouter();
  const { items, isOpen, subtotal, closeCart, updateQuantity, removeItem } =
    useCartStore();
  const [loading, setLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  if (!isOpen) return null;

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open) => (open ? null : closeCart())}
      direction="right"
    >
      <DrawerTitle className="sr-only">Cart Drawer</DrawerTitle>
      <DrawerContent className="max-w-md w-full h-full p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <DrawerHeader className="border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-light tracking-wide text-gray-900">
                Items In Your Cart
              </h2>
              <DrawerClose asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <p className="text-lg mb-2">Your cart is empty</p>
                <p className="text-sm">Add some items to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.color}-${item.size}`}
                    className="flex gap-4 p-4 border border-gray-200 rounded-lg"
                  >
                    {/* Product Image */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {item.name}
                          </h3>
                          <div className="mt-1 space-y-1">
                            <p className="text-xs text-gray-500">
                              Color: {item.color}
                            </p>
                            <p className="text-xs text-gray-500">
                              Size: {item.size}
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              ${item.price.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => item.lineId && removeItem(item.lineId)}
                          className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              item.lineId &&
                              updateQuantity(item.lineId, item.quantity - 1)
                            }
                            className="h-8 w-8 p-0 border-gray-300"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>

                          <span className="text-sm font-medium min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              item.lineId &&
                              updateQuantity(item.lineId, item.quantity + 1)
                            }
                            className="h-8 w-8 p-0 border-gray-300"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <DrawerFooter className="border-t space-y-4">
              {/* Subtotal */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-light text-gray-900">Sub Total</p>
                  <p className="text-xs text-gray-500">
                    Taxes And Shipping Calculated At Checkout
                  </p>
                </div>
                <p className="text-2xl font-light text-gray-900">
                  ${subtotal.toFixed(2)}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={async () => {
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
                  }}
                  className="w-full py-3 text-sm font-medium bg-[#EE9254] hover:bg-[#EE9254] text-white"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="inline-block mr-2 animate-spin w-6 h-6" />
                  ) : (
                    "Checkout"
                  )}
                </Button>
                <Button
                  onClick={() => {
                    setCartLoading(true);
                    NProgress.start();
                    router.push("/cart");

                    closeCart();
                    setCartLoading(false);
                  }}
                  variant="outline"
                  className="w-full py-3 text-sm font-medium border-gray-300 hover:bg-gray-50"
                >
                  {cartLoading ? (
                    <Loader2 className="inline-block mr-2 animate-spin w-6 h-6" />
                  ) : (
                    <>
                      <MdOutlineShoppingBag className="inline-block mr-2 w-6 h-6" />
                      View Cart
                    </>
                  )}
                </Button>
              </div>
            </DrawerFooter>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
