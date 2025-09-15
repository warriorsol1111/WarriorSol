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
import GiftMessage from "./giftComponent";

export default function CartDrawer() {
  const router = useRouter();
  const {
    items,
    isOpen,
    subtotal,
    closeCart,
    updateQuantity,
    removeItem,
    itemLoading,
    cartLoading,
  } = useCartStore();

  const [loading, setLoading] = useState(false);
  const [senderName, setSenderName] = useState("Daniyal Khan");
  const [recipientName, setRecipientName] = useState("Jimmy Mellet");
  const [giftMessage, setGiftMessage] = useState("");
  const [nameError, setNameError] = useState("");
  const [recipientNameError, setRecipientNameError] = useState("");
  const [isGiftSelected, setIsGiftSelected] = useState(false);

  if (!isOpen) return null;

  function validateName(name: string): string | null {
    if (!name || name.trim().length === 0) {
      return "Name cannot be empty.";
    }

    if (name.length < 3) {
      return "Name must be at least 3 characters long.";
    }

    if (name.length > 20) {
      return "Name cannot exceed 20 characters.";
    }

    if (/^\s/.test(name)) {
      return "Name cannot start with a space.";
    }

    if (/\s{2,}/.test(name)) {
      return "Name cannot contain consecutive spaces.";
    }

    return null; // valid
  }

  const handleCheckout = async () => {
    setLoading(true);
    if (isGiftSelected) {
      const senderNameValidationError = validateName(senderName);
      const recipientNameValidationError = validateName(recipientName);

      if (senderNameValidationError || recipientNameValidationError) {
        setNameError(senderNameValidationError || "");
        setRecipientNameError(recipientNameValidationError || "");
        setLoading(false);
        return;
      }
    }
    try {
      const requestBody = isGiftSelected
        ? { giftMessage, senderName, recipientName }
        : {};
      const res = await fetch("/api/shopify/getCheckout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      const data = await res.json();
      if (res.ok && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        console.error(data.error || "Failed to get checkout URL");
      }
    } catch (error) {
      console.error("Failed to get checkout URL", error);
    } finally {
      setLoading(false);
    }
  };

  const clearNameError = () => {
    setNameError("");
  };

  const clearRecipientNameError = () => {
    setRecipientNameError("");
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
                {items.map(
                  (item) => (
                    console.log("item", item),
                    (
                      <div
                        key={`${item.id}-${item.color}-${item.size}`}
                        className="flex flex-col gap-3 pb-6 border-b border-gray-100 last:border-b-0"
                      >
                        {/* Top row: image + details */}
                        <div className="flex flex-col sm:flex-row gap-4">
                          {/* Product Image */}
                          <div className="relative w-full sm:w-[118px] max-w-[100px] sm:max-w-none aspect-square rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={118}
                              height={118}
                              className="w-full h-full object-cover"
                            />
                            {item.tags?.includes("Pre-Order") && (
                              <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-medium px-2 py-0.5 rounded">
                                Pre-Order
                              </span>
                            )}
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
                                  <p className="text-sm md:text-[16px] text-[#1F1F1F] font-medium truncate max-w-[100px] md:max-w-[200px]">
                                    {item.name}
                                  </p>
                                  {item.tags?.includes("Pre-Order") && (
                                    <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded bg-orange-100 text-orange-700 font-medium">
                                      Pre-Order
                                    </span>
                                  )}
                                </div>

                                <div>
                                  <p className="text-xs text-[#1F1F1FB2] uppercase tracking-wide mb-1">
                                    Size
                                  </p>
                                  <p className="text-sm md:text-[16px] text-[#1F1F1F]">
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
                                  <p className="text-sm md:text-[16px] text-[#1F1F1F]">
                                    {item.color || "—"}
                                  </p>
                                </div>

                                <div className="mb-3">
                                  <p className="text-xs text-[#1F1F1FB2] uppercase tracking-wide mb-1">
                                    Price
                                  </p>
                                  <p className="text-sm md:text-[16px] text-[#1F1F1F]">
                                    ${item.price.toFixed(2)}
                                  </p>
                                </div>
                              </div>

                              {/* Remove Button */}
                              <div className="flex justify-end">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    item.lineId && removeItem(item.lineId)
                                  }
                                  className="p-1 !w-8 !h-8 bg-red-100 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-sm"
                                  disabled={
                                    cartLoading ||
                                    (!!item.lineId && itemLoading[item.lineId])
                                  }
                                >
                                  <Trash2 className="!h-3 !w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Bottom row: Quantity controls */}
                        <div className="flex items-center justify-center sm:justify-between w-full md:w-[90%] md:ml-8 border-t border-gray-100 pt-3">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              item.lineId &&
                              updateQuantity(item.lineId, item.quantity - 1)
                            }
                            className="md:w-7 md:h-7  w-5 h-5 !rounded-full border !disabled:cursor-not-allowed border-[#141B34] text-[#141B34] hover:text-black hover:border-black"
                            disabled={
                              cartLoading ||
                              (!!item.lineId && itemLoading[item.lineId]) ||
                              item.quantity === 1
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
                              item.lineId &&
                              updateQuantity(item.lineId, item.quantity + 1)
                            }
                            className="md:w-7 md:h-7  w-5 h-5 !rounded-full border !disabled:cursor-not-allowed border-[#141B34] text-[#141B34] hover:text-black hover:border-black"
                            disabled={
                              cartLoading ||
                              (!!item.lineId && itemLoading[item.lineId])
                            }
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    )
                  )
                )}

                {/* Gift Message Section */}
                <div className="border border-gray-200 rounded-lg p-4 bg-white mt-6">
                  <GiftMessage
                    senderName={senderName}
                    recipientName={recipientName}
                    onSenderNameChange={setSenderName}
                    onRecipientNameChange={setRecipientName}
                    onGiftMessageChange={setGiftMessage}
                    nameError={nameError}
                    recipientNameError={recipientNameError}
                    onClearNameError={clearNameError}
                    onGiftSelectionChange={setIsGiftSelected}
                    onClearRecipientNameError={clearRecipientNameError}
                    isCart={true}
                  />
                </div>
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
                  className="w-full py-4 sm:py-5  font-[Inter]  bg-[#EE9254] hover:bg-[#e8823d] text-white rounded-md"
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
                  className="w-full py-4 sm:py-5  text-[#1F1F1FCC] border-[#1F1F1F] border hover:bg-gray-50 rounded-md"
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
