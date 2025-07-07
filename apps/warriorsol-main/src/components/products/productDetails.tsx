"use client";
import React, { useState, useMemo, useEffect } from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatPrice } from "@/lib/utils";
import { Button } from "../ui/button";
import { useCartStore } from "@/store/cart-store";
import { FaRegHeart } from "react-icons/fa6";
import { BsCart2 } from "react-icons/bs";

interface ProductVariant {
  id: string;
  title: string;
  sku: string;
  quantityAvailable: number;
  price: {
    amount: string;
    currencyCode: string;
  };
  compareAtPrice: {
    amount: string;
    currencyCode: string;
  } | null;
  availableForSale: boolean;
  image: {
    url: string;
    altText: string | null;
  };
}

interface ProductDetailsProps {
  product: {
    id: string;
    title: string;
    description: string;
    descriptionHtml: string;
    productType: string;
    vendor: string;
    price: string;
    currencyCode: string;
    image: string;
    imageAlt: string;
    variants: ProductVariant[];
    variant: ProductVariant | null;
  };
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  // Get unique colors and sizes from variants
  const { addItem, openCart } = useCartStore();
  const { colors, sizes } = useMemo(() => {
    const colorSet = new Set<string>();
    const sizeSet = new Set<string>();
    const variantMap = new Map<string, ProductVariant[]>();

    // Check if this is a hat product (no sizes)
    const isHatProduct = product.variants.every((variant) => {
      const parts = variant.title.split(" / ");
      return (
        parts.length <= 1 ||
        (parts.length === 2 && !parts[1].match(/^[0-9XLS]+$/i))
      );
    });

    product.variants.forEach((variant) => {
      const titleParts = variant.title.split(" / ");

      if (isHatProduct) {
        // For hats, use the full variant title as the color option
        colorSet.add(variant.title);
        if (!variantMap.has(variant.title)) {
          variantMap.set(variant.title, []);
        }
        variantMap.get(variant.title)?.push(variant);
      } else if (titleParts.length > 1) {
        // Case: "Color / Size" format for shirts
        const [color, size] = titleParts;
        colorSet.add(color);
        sizeSet.add(size);

        if (!variantMap.has(color)) {
          variantMap.set(color, []);
        }
        variantMap.get(color)?.push(variant);
      } else {
        // Case: Single value format (size only for pants)
        const value = titleParts[0];
        if (/^[0-9XLS]+$/i.test(value)) {
          sizeSet.add(value);
          const defaultColor = "Default";
          if (!variantMap.has(defaultColor)) {
            variantMap.set(defaultColor, []);
          }
          variantMap.get(defaultColor)?.push(variant);
        }
      }
    });

    return {
      colors: Array.from(colorSet),
      sizes: Array.from(sizeSet),
      variantsByColor: variantMap,
    };
  }, [product.variants]);

  const [selectedColor, setSelectedColor] = useState<string>(colors[0]);
  const [selectedSize, setSelectedSize] = useState<string>(sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [quantityInStock, setQuantityInStock] = useState(
    product.variants[0].quantityAvailable || 0
  );
  useEffect(() => {
    setQuantityInStock(
      product.variants.find((variant) => variant.title === selectedColor)
        ?.quantityAvailable || 0
    );
  }, [selectedColor, product.variants]);

  // const [isLoading, setIsLoading] = useState(false);
  // Find the selected variant based on color and size
  const selectedVariant = useMemo(() => {
    const isHatProduct = product.variants.every((variant) => {
      const parts = variant.title.split(" / ");
      return (
        parts.length <= 1 ||
        (parts.length === 2 && !parts[1].match(/^[0-9XLS]+$/i))
      );
    });

    if (isHatProduct) {
      // For hats, match the exact variant title
      return (
        product.variants.find((variant) => variant.title === selectedColor) ||
        product.variants[0]
      );
    }

    const hasMultipleValues = product.variants[0].title.includes(" / ");
    const isSizeOnly =
      !hasMultipleValues && /^[0-9XLS]+$/i.test(product.variants[0].title);

    if (hasMultipleValues) {
      // For shirts with color/size combinations
      return (
        product.variants.find(
          (variant) => variant.title === `${selectedColor} / ${selectedSize}`
        ) || product.variants[0]
      );
    } else if (isSizeOnly) {
      // For pants with only sizes
      return (
        product.variants.find((variant) => variant.title === selectedSize) ||
        product.variants[0]
      );
    }

    return product.variants[0];
  }, [selectedColor, selectedSize, product.variants]);

  const formattedPrice = formatPrice({
    amount: selectedVariant?.price.amount || product.price,
    currencyCode: selectedVariant?.price.currencyCode || product.currencyCode,
  });

  const formattedCompareAtPrice = selectedVariant?.compareAtPrice
    ? formatPrice({
        amount: selectedVariant.compareAtPrice.amount,
        currencyCode: selectedVariant.compareAtPrice.currencyCode,
      })
    : null;

  // const handleBuyProduct = async () => {
  //   if (!selectedVariant) return;

  //   setIsLoading(true);
  //   try {
  //     const response = await fetch("/api/shopify/createCheckout", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         variantId: selectedVariant.id,
  //         quantity: quantity,
  //       }),
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to create checkout");
  //     }

  //     const data = await response.json();
  //     window.location.href = data.checkoutUrl;
  //   } catch (error) {
  //     console.error("Error creating checkout:", error);
  //     alert("Failed to create checkout. Please try again.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <div className="min-h-screen bg-white">
      <div className="p-4 sm:p-6 md:p-8 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          <div className="flex justify-center items-center p-4 sm:p-6">
            {/* Product Image */}
            <div className="relative w-full max-w-md">
              <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-md">
                <Image
                  key={selectedVariant?.image.url}
                  src={selectedVariant?.image.url || product.image}
                  alt={selectedVariant?.image.altText || product.imageAlt}
                  className="w-full h-full object-contain"
                  width={500}
                  height={500}
                />
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6 lg:space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-[62px] font-normal text-black">
                  {product.title}
                </h1>
                <p className="text-lg sm:text-xl font-light">
                  {product.vendor}
                </p>
              </div>
              {/* Price */}
              <div className="flex items-center text-2xl sm:text-3xl lg:text-[62px] gap-2 sm:gap-3">
                {formattedCompareAtPrice && (
                  <span className="text-lg sm:text-xl lg:text-[42px] text-[#1F1F1F4D] line-through">
                    {formattedCompareAtPrice}
                  </span>
                )}
                <span className="text-2xl sm:text-3xl lg:text-[62px] font-semibold text-gray-900">
                  {formattedPrice}
                </span>
              </div>
            </div>

            {/* Availability */}
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${selectedVariant?.availableForSale ? "bg-green-500" : "bg-red-500"}`}
              ></div>
              <span
                className={`text-lg font-medium ${selectedVariant?.availableForSale ? "text-green-600" : "text-red-600"}`}
              >
                {selectedVariant?.availableForSale
                  ? "In Stock"
                  : "Out of Stock"}
              </span>
              {quantityInStock > 0 && (
                <span className="text-lg font-medium text-gray-700">
                  {quantityInStock} in stock
                </span>
              )}
            </div>

            {/* Variant Selection */}
            {colors.length > 1 && colors[0] !== "Default" && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {product.variants.every((v) => !v.title.includes(" / "))
                    ? "Style"
                    : "Color"}
                </label>
                <div className="flex flex-wrap gap-5">
                  {colors.map((color) => (
                    <Button
                      variant="link"
                      size="lg"
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 text-lg rounded-md border cursor-pointer transition-all duration-200 shadow-sm ${
                        selectedColor === color
                          ? "bg-[#EE9254] text-white border-transparent"
                          : "bg-white text-gray-700 border-gray-300 hover:border-[#EE9254]"
                      }`}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            {/* Size Selection - Only show for shirts and pants */}
            {sizes.length > 0 &&
              !product.variants.every((variant) => {
                const parts = variant.title.split(" / ");
                return (
                  parts.length <= 1 ||
                  (parts.length === 2 && !parts[1].match(/^[0-9XLS]+$/i))
                );
              }) && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Size
                  </label>
                  <div className="flex flex-wrap gap-5">
                    {sizes.map((size) => (
                      <Button
                        variant="link"
                        size="lg"
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 text-lg rounded-md border cursor-pointer transition-all duration-200 shadow-sm ${
                          selectedSize === size
                            ? "bg-[#EE9254] text-white border-transparent"
                            : "bg-white text-gray-700 border-gray-300 hover:border-[#EE9254]"
                        }`}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-200 rounded w-full justify-between">
                <Button
                  variant="link"
                  size="lg"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-gray-600 hover:text-gray-900"
                >
                  <AiOutlineMinus size={16} />
                </Button>
                <span className="w-12 text-center text-sm font-medium">
                  {quantity.toString().padStart(2, "0")}
                </span>
                <Button
                  variant="link"
                  size="lg"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-gray-600 hover:text-gray-900"
                >
                  <AiOutlinePlus size={16} />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="link"
                size="lg"
                className="flex items-center justify-center gap-2 text-gray-800 border-1 border-black hover:text-black"
              >
                <FaRegHeart size={20} />
                Add To Wishlist
              </Button>
              <Button
                variant="outline"
                size="lg"
                disabled={!selectedVariant?.availableForSale}
                onClick={() => {
                  addItem({
                    id: selectedVariant.id,
                    name: product.title,
                    price: parseFloat(selectedVariant.price.amount),
                    color: selectedColor || "Default",
                    size: selectedSize || "One Size",
                    image: selectedVariant.image?.url || product.image,
                  });
                  openCart();
                }}
                className="flex items-center justify-center gap-2 bg-[#EE9254] text-white hover:bg-orange-500 transition-colors"
              >
                <BsCart2 size={20} />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full mb-10 p-4 sm:p-6 md:p-8 lg:p-10 mx-auto">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="flex h-auto p-0 bg-transparent rounded-none space-x-2 sm:space-x-4 overflow-x-auto">
            <TabsTrigger
              value="description"
              className="px-4 sm:px-6 lg:px-8 py-2 text-base md:text-lg border rounded-md border-[#E5E5E5] data-[state=active]:!text-white data-[state=active]:!bg-[#EE9254] data-[state=active]:!border-primary whitespace-nowrap"
            >
              Description
            </TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-6 lg:mt-8">
            <div
              className="space-y-4 text-base md:text-lg font-inter prose prose-base md:prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
            <style jsx global>{`
              .size-guide-title {
                display: block;
                font-size: 1.3em;
                margin-top: 2em;
                margin-bottom: 1em;
              }
              .table-responsive {
                overflow-x: auto;
                margin-bottom: 1em;
              }
              .table-responsive table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 1em;
              }
              .table-responsive td {
                border: 1px solid #e5e5e5;
                padding: 8px 12px;
                font-size: 1.05em;
              }
              .table-responsive tr:first-child {
                background-color: #f5f5f5;
              }
            `}</style>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
