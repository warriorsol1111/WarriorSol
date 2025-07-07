"use client";

import React from "react";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import RecommendedProducts from "../community/recommendedProducts";

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem } = useCartStore();

  const isEmpty = items.length === 0;

  return (
    <>
      <div className="min-h-screen px-2 py-8 md:px-12 lg:px-24 bg-white flex justify-center">
        <div className="w-full">
          {/* Title */}
          <h1 className="text-[62px] font-normal text-center mb-1">
            Your Cart
          </h1>
          <p className="text-center font-light text-xl text-gray-500 mb-8">
            Review your items before proceeding to checkout
          </p>

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
              {/* Table Header */}
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

              <div className="space-y-6">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.color}-${item.size}`}
                    className="grid grid-cols-1 md:grid-cols-5 items-center gap-4 bg-white rounded-lg shadow-sm border border-gray-100 py-4 px-2 md:px-0"
                  >
                    {/* Item Info */}
                    <div className="flex col-span-2 gap-4 items-center">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={90}
                        height={90}
                        className="rounded-md object-cover w-[90px] h-[90px]"
                      />
                      <div className="space-y-1">
                        <div className="text-xs text-[#1F1F1FB2] font-medium">
                          Item
                        </div>
                        <p className="font-medium text-sm text-gray-900 leading-tight">
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
                    <div className="text-center text-sm">
                      ${item.price.toFixed(2)}
                    </div>

                    {/* Quantity */}
                    <div className="flex justify-center items-center gap-2">
                      <button
                        className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-500 hover:bg-gray-100"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium text-base tracking-wider">
                        {String(item.quantity).padStart(2, "0")}
                      </span>
                      <button
                        className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-500 hover:bg-gray-100"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        className="w-7 h-7 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 ml-2"
                        onClick={() => removeItem(item.id)}
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Total */}
                    <div className="text-right text-sm font-medium text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Checkout Details Separator */}
              <div className="mt-10 mb-2 bg-[#fafafa] rounded text-center text-xl py-3 font-medium text-gray-700 border">
                Checkout Details
              </div>

              {/* Checkout Summary */}
              <div className="border-t pt-6 space-y-4 mx-auto">
                <div className="flex justify-between text-xl">
                  <span>Cart Subtotal</span>
                  <span className="font-medium text-xl">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-xl font-semibold">
                  <span>Grand Total</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <Button className="w-full py-3 mt-4 bg-[#EE9254] hover:bg-[#EE9254] text-white text-lg rounded-none">
                  Checkout
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
