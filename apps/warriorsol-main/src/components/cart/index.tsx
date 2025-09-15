"use client";

import React from "react";
import Image from "next/image";
import { Loader2, Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import RecommendedProducts from "../community/recommendedProducts";
import GiftMessage from "./giftComponent";

export default function CartPage() {
  const {
    items,
    subtotal,
    updateQuantity,
    removeItem,
    itemLoading,
    cartLoading,
  } = useCartStore();
  const isEmpty = items.length === 0;
  const [loading, setLoading] = React.useState(false);
  const [senderName, setSenderName] = React.useState("Daniyal Khan");
  const [recipientName, setRecipientName] = React.useState("Jimmy Mellet");
  const [giftMessage, setGiftMessage] = React.useState("");
  const [nameError, setNameError] = React.useState("");
  const [recipientNameError, setRecipientNameError] = React.useState("");

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
    const senderNameValidationError = validateName(senderName);
    const recipientNameValidationError = validateName(recipientName);

    if (senderNameValidationError || recipientNameValidationError) {
      setNameError(senderNameValidationError || "");
      setRecipientNameError(recipientNameValidationError || "");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/shopify/getCheckout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ giftMessage, senderName, recipientName }),
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
    <>
      <div className="min-h-screen px-3 sm:px-4 md:px-6 lg:px-12 xl:px-24 py-6 sm:py-8 bg-white flex justify-center">
        <div className="w-full max-w-6xl">
          {/* Title */}
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[62px] font-normal text-center mb-2">
            Your Picks{" "}
          </h1>
          <p className="text-center font-light text-sm sm:text-base md:text-lg lg:text-xl text-gray-500 mb-6 sm:mb-8 capitalize px-2">
            Every item you add makes a difference. We donate 11.11% of all
            revenue to fund
            <br className="hidden sm:block" />
            direct support for those facing cancer&apos;s hidden battles.{" "}
          </p>

          {/* Fallback: Empty Cart */}
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center mt-12 sm:mt-20 space-y-4 sm:space-y-6 text-center text-gray-500 px-4">
              <p className="text-xl sm:text-2xl font-medium text-gray-700">
                Your cart is feeling kinda lonely
              </p>
              <p className="text-sm sm:text-base text-gray-500">
                Add some products to give it some company!
              </p>
              <Button
                variant="outline"
                className="mt-2 bg-[#EE9254] text-white px-6 py-2"
                onClick={() => (window.location.href = "/products")}
              >
                Browse Products
              </Button>
            </div>
          ) : (
            <>
              {/* Table Header - Only visible on lg+ */}
              <div className="hidden lg:grid grid-cols-5 gap-4 mb-2">
                <div className="col-span-2 text-lg xl:text-xl bg-[#fafafa] rounded-tl-lg py-3 text-center font-medium text-gray-700 border border-b-0 border-gray-200">
                  Item
                </div>
                <div className="bg-[#fafafa] py-3 text-lg xl:text-xl text-center font-medium text-gray-700 border border-b-0 border-gray-200">
                  Price
                </div>
                <div className="bg-[#fafafa] py-3 text-lg xl:text-xl text-center font-medium text-gray-700 border border-b-0 border-gray-200">
                  Quantity
                </div>
                <div className="bg-[#fafafa] text-lg xl:text-xl rounded-tr-lg py-3 text-center font-medium text-gray-700 border border-b-0 border-gray-200">
                  Total
                </div>
              </div>

              {/* Cart Items */}
              <div className="space-y-4 sm:space-y-6">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.color}-${item.size}`}
                    className="grid grid-cols-1 lg:grid-cols-5 items-start lg:items-center gap-3 sm:gap-4 bg-white rounded-lg shadow-sm border border-gray-100 py-3 sm:py-4 px-3 sm:px-4"
                  >
                    {/* Item Info */}
                    <div className="flex flex-row col-span-1 lg:col-span-2 gap-3 sm:gap-4 items-start">
                      <div className="relative flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="rounded-md object-cover w-16 h-16 xs:w-20 xs:h-20 sm:w-[90px] sm:h-[90px]"
                        />
                        {/* Badge overlay on image */}
                        {item.tags?.includes("Pre-Order") && (
                          <span className="absolute -top-1 left-1 sm:top-[-5px] sm:left-2 bg-orange-500 text-white text-[8px] xs:text-[10px] font-medium px-1 xs:px-2 py-0.5 rounded">
                            Pre-Order
                          </span>
                        )}
                      </div>

                      <div className="space-y-1 text-xs sm:text-sm min-w-0 flex-1">
                        {/* Mobile: Show labels inline with content */}
                        <div className="block lg:hidden">
                          <span className="text-xs text-[#1F1F1FB2] font-medium mr-2">
                            Item:
                          </span>
                          <span className="font-medium text-gray-900 leading-tight line-clamp-2">
                            {item.name}
                          </span>
                        </div>

                        {/* Desktop: Show labels above content */}
                        <div className="hidden lg:block">
                          <div className="text-xs text-[#1F1F1FB2] font-medium">
                            Item
                          </div>
                          <p className="font-medium text-gray-900 leading-tight line-clamp-2">
                            {item.name}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-4 mt-2">
                          <div>
                            <span className="text-xs text-[#1F1F1FB2] font-medium lg:block inline mr-2 lg:mr-0">
                              Size{!item.size ? ":" : ""}
                            </span>
                            <p className="text-xs text-gray-700 lg:block inline">
                              {item.size || "—"}
                            </p>
                          </div>

                          <div>
                            <span className="text-xs text-[#1F1F1FB2] font-medium lg:block inline mr-2 lg:mr-0">
                              Color{!item.color ? ":" : ""}
                            </span>
                            <p className="text-xs text-gray-700 lg:block inline">
                              {item.color || "—"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mobile: Price, Quantity, Total in flex layout */}
                    <div className="flex lg:hidden justify-between items-center gap-4 mt-2">
                      {/* Price */}
                      <div className="text-left">
                        <div className="text-xs text-[#1F1F1FB2] font-medium">
                          Price
                        </div>
                        <div className="text-sm font-medium">
                          ${item.price.toFixed(2)}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1 xs:gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            item.lineId &&
                            updateQuantity(item.lineId, item.quantity - 1)
                          }
                          className="!h-7 !w-7 xs:!h-8 xs:!w-8 p-0 border-gray-300"
                          disabled={
                            cartLoading ||
                            (!!item.lineId && itemLoading[item.lineId])
                          }
                        >
                          <Minus className="h-2.5 w-2.5 xs:h-3 xs:w-3" />
                        </Button>
                        <span className="w-6 xs:w-8 text-center font-medium text-sm">
                          {String(item.quantity).padStart(2, "0")}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            item.lineId &&
                            updateQuantity(item.lineId, item.quantity + 1)
                          }
                          className="!h-7 !w-7 xs:!h-8 xs:!w-8 p-0 border-gray-300"
                          disabled={
                            cartLoading ||
                            (!!item.lineId && itemLoading[item.lineId])
                          }
                        >
                          <Plus className="h-2.5 w-2.5 xs:h-3 xs:w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => item.lineId && removeItem(item.lineId)}
                          className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 ml-1"
                          disabled={
                            cartLoading ||
                            (!!item.lineId && itemLoading[item.lineId])
                          }
                        >
                          <Trash2 className="h-3 w-3 xs:h-4 xs:w-4" />
                        </Button>
                      </div>

                      {/* Total */}
                      <div className="text-right">
                        <div className="text-xs text-[#1F1F1FB2] font-medium">
                          Total
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {/* Desktop: Price, Quantity, Total in grid columns */}
                    <div className="hidden lg:block text-center text-sm md:text-base">
                      ${item.price.toFixed(2)}
                    </div>

                    <div className="hidden lg:flex justify-center items-center flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          item.lineId &&
                          updateQuantity(item.lineId, item.quantity - 1)
                        }
                        className="!h-8 !w-8 p-0 border-gray-300"
                        disabled={
                          cartLoading ||
                          (!!item.lineId && itemLoading[item.lineId])
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
                          item.lineId &&
                          updateQuantity(item.lineId, item.quantity + 1)
                        }
                        className="!h-8 !w-8 p-0 border-gray-300"
                        disabled={
                          cartLoading ||
                          (!!item.lineId && itemLoading[item.lineId])
                        }
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => item.lineId && removeItem(item.lineId)}
                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50"
                        disabled={
                          cartLoading ||
                          (!!item.lineId && itemLoading[item.lineId])
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="hidden lg:block text-right text-sm md:text-base font-medium text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border border-gray-200 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 bg-white mt-6">
                <GiftMessage
                  senderName={senderName}
                  recipientName={recipientName}
                  onSenderNameChange={setSenderName}
                  onRecipientNameChange={setRecipientName}
                  onGiftMessageChange={setGiftMessage}
                  nameError={nameError}
                  recipientNameError={recipientNameError}
                  onClearNameError={clearNameError}
                  onClearRecipientNameError={clearRecipientNameError}
                />
              </div>

              {/* Checkout Heading */}
              <div className="mt-8 sm:mt-10 mb-2 bg-[#fafafa] rounded text-center text-lg sm:text-xl py-3 font-medium text-gray-700 border">
                Checkout Details
              </div>

              {/* Checkout Summary */}
              <div className="border-t pt-4 sm:pt-6 space-y-3 sm:space-y-4 mx-auto max-w-xl">
                <div className="flex justify-between text-base sm:text-lg lg:text-xl">
                  <span>Cart Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base sm:text-lg lg:text-xl font-semibold">
                  <span>Grand Total</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <Button
                  className="w-full py-3 mt-4 bg-[#EE9254] hover:bg-[#e07d38] text-white text-base sm:text-lg rounded"
                  disabled={loading}
                  onClick={handleCheckout}
                >
                  {loading ? (
                    <Loader2 className="animate-spin h-4 w-4 sm:h-5 sm:w-5 mr-2 inline-block" />
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
