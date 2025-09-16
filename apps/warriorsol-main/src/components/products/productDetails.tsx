"use client";
import React, { useState, useMemo, useEffect } from "react";
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatPrice } from "@/lib/utils";
import { Button } from "../ui/button";
import { useCartStore } from "@/store/cart-store";
import { FaRegHeart } from "react-icons/fa6";
import { BsCart2 } from "react-icons/bs";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import Reviews from "./reviews";
import RecommendedProducts from "../community/recommendedProducts";
import { formatDate } from "@/lib/utils";

export interface Review {
  review: {
    id: string;
    userId: string;
    productId: string;
    score: number;
    review: string;
    createdAt: string;
  };
  user: {
    id: string;
    name: string;
    profilePhoto: string;
  };
}

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

interface ProductImage {
  url: string;
  altText?: string | null;
}

interface ProductDetailsProps {
  product: {
    id: string;
    title: string;
    description: string;
    descriptionHtml: string;
    productType: string;
    vendor: string;
    metafields: {
      namespace: string;
      key: string;
      value: string;
    }[];
    tags: string[];
    price: string;

    currencyCode: string;
    images: ProductImage[];
    image: string;
    url: string;
    imageAlt: string;
    variants: ProductVariant[];
    variant: ProductVariant | null;
  };
}

interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  descriptionHtml: string;
  productType: string;
  vendor: string;
  metafields: {
    namespace: string;
    key: string;
    value: string;
  }[];
  tags: string[];
  price: string;
  currencyCode: string;
  images: ProductImage[];
  image: string;
  url: string;
  imageAlt: string;
  variants: ProductVariant[];
  variant: ProductVariant | null;
}

// Custom Carousel Component
interface CarouselProps {
  images: ProductImage[];
  selectedIndex: number;
  onImageSelect: (index: number) => void;
}

function ProductCarousel({
  images,
  selectedIndex,
  onImageSelect,
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(selectedIndex);

  useEffect(() => {
    setCurrentIndex(selectedIndex);
  }, [selectedIndex]);

  const goToPrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
    setCurrentIndex(newIndex);
    onImageSelect(newIndex);
  };

  const goToNext = () => {
    const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    onImageSelect(newIndex);
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-200 rounded-2xl flex items-center justify-center">
        No images available
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Main image display */}
      <div className="relative w-full pt-[100%] bg-gray-100 rounded-2xl overflow-hidden shadow-md">
        <Image
          src={images[currentIndex]?.url || images[0].url}
          alt={images[currentIndex]?.altText || "Product Image"}
          fill
          className="absolute top-0 left-0 w-full h-full object-contain"
          sizes="(max-width: 768px) 100vw, 50vw"
        />

        {/* Navigation arrows - only show if more than 1 image */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 cursor-pointer -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all duration-200"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 cursor-pointer -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all duration-200"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </>
        )}

        {/* Dots indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  onImageSelect(index);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentIndex ? "bg-[#EE9254]" : "bg-white/60"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail navigation */}
      {images.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto">
          {images.map((img, idx) => (
            <div
              key={`${img.url}-${idx}`}
              className={`relative w-20 h-20 rounded-lg overflow-hidden border cursor-pointer flex-shrink-0 ${
                currentIndex === idx
                  ? "border-[#EE9254] ring-1 ring-[#EE9254]"
                  : "border-gray-200"
              }`}
              onClick={() => {
                setCurrentIndex(idx);
                onImageSelect(idx);
              }}
            >
              <Image
                src={img.url}
                alt={img.altText || `Thumbnail ${idx + 1}`}
                fill
                className="object-contain"
                sizes="80px"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const variantIdFromUrl = searchParams.get("variant");
  const [isLoading, setIsLoading] = useState(false);
  const { addItem, openCart } = useCartStore();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [wishListLoading, setWishlistLoading] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  console.log("product", product);

  const { colors, sizes } = useMemo(() => {
    const colorSet = new Set<string>();
    const sizeSet = new Set<string>();
    const variantMap = new Map<string, ProductVariant[]>();

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
        colorSet.add(variant.title);
        if (!variantMap.has(variant.title)) {
          variantMap.set(variant.title, []);
        }
        variantMap.get(variant.title)?.push(variant);
      } else if (titleParts.length > 1) {
        const [color, size] = titleParts;
        colorSet.add(color);
        sizeSet.add(size);

        if (!variantMap.has(color)) {
          variantMap.set(color, []);
        }
        variantMap.get(color)?.push(variant);
      } else {
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
    product.variants[0]?.quantityAvailable || 0
  );

  // Set selected variant if variant ID is in URL
  useEffect(() => {
    if (!variantIdFromUrl || !product.variants.length) return;

    const targetVariant = product.variants.find(
      (v) => v.id === variantIdFromUrl
    );
    if (!targetVariant) return;

    const parts = targetVariant.title.split(" / ");
    const isHatProduct = parts.length === 1;

    if (isHatProduct) {
      setSelectedColor(parts[0]);
    } else if (parts.length === 2) {
      setSelectedColor(parts[0]);
      setSelectedSize(parts[1]);
    }
  }, [variantIdFromUrl, product.variants]);

  useEffect(() => {
    setQuantityInStock(
      product.variants.find((variant) => variant.title === selectedColor)
        ?.quantityAvailable || 0
    );
  }, [selectedColor, product.variants]);

  const extractIDFromShopifyID = (id: string) => {
    const parts = id.split("/");
    return parts[parts.length - 1];
  };
  const getMetafield = (
    product: ShopifyProduct | null,
    key: string,
    namespace: string = "custom"
  ) => {
    if (!product?.metafields) return null;

    const field = product.metafields.find(
      (f) => f && f.key === key && f.namespace === namespace
    );

    return field?.value ?? null;
  };

  const preorderDate = getMetafield(product, "preorder_ship_date");
  const isPreorderMeta = getMetafield(product, "is_preorder") === "true";

  useEffect(() => {
    const fetchReviews = async () => {
      if (!session?.user.token) return;
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/reviews/${extractIDFromShopifyID(product.id)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${session?.user.token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }
        const { data } = await response.json();
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, [product.id, session?.user.token]);

  const selectedVariant = useMemo(() => {
    const isHatProduct = product.variants.every((variant) => {
      const parts = variant.title.split(" / ");
      return (
        parts.length <= 1 ||
        (parts.length === 2 && !parts[1].match(/^[0-9XLS]+$/i))
      );
    });

    if (isHatProduct) {
      return (
        product.variants.find((variant) => variant.title === selectedColor) ||
        product.variants[0]
      );
    }

    return (
      product.variants.find(
        (variant) => variant.title === `${selectedColor} / ${selectedSize}`
      ) || product.variants[0]
    );
  }, [selectedColor, selectedSize, product.variants]);

  // Update selected image when variant changes
  useEffect(() => {
    if (selectedVariant?.image?.url) {
      const index = product.images.findIndex(
        (img) => img.url === selectedVariant.image.url
      );
      if (index >= 0) setSelectedImageIndex(index);
    }
  }, [selectedVariant, product.images]);

  // Update selected variant when user clicks on an image
  const handleImageSelect = (index: number) => {
    setSelectedImageIndex(index);
    const clickedImage = product.images[index];
    // Check if this image belongs to a variant
    const variant = product.variants.find(
      (v) => v.image?.url === clickedImage.url
    );
    if (variant) {
      setSelectedColor(variant.title.split(" / ")[0]);
      const size = variant.title.split(" / ")[1];
      if (size) setSelectedSize(size);
    }
  };

  useEffect(() => {
    const checkWishlist = async () => {
      if (!selectedVariant?.id || !session) return;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/wishlist/check?variantId=${selectedVariant.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${session?.user.token}`,
          },
        }
      );
      const result = await res.json();
      if (result?.data?.isInWishlist) setIsInWishlist(true);
      else setIsInWishlist(false);
    };

    checkWishlist();
  }, [selectedVariant?.id, session]);

  const toggleWishlist = async () => {
    try {
      setWishlistLoading(true);
      const method = isInWishlist ? "DELETE" : "POST";

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/wishlist`,
        {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user.token}`,
          },
          body: JSON.stringify({ variantId: selectedVariant.id }),
        }
      );

      const result = await res.json();
      if (res.ok) {
        toast.dismiss();
        toast.success(
          isInWishlist ? "Item removed from Wishlist" : "Item Added to Wishlist"
        );
        setIsInWishlist(!isInWishlist);
      } else {
        console.error(result?.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      toast.dismiss();
      toast.error("Failed to update wishlist. Please try again.");
    } finally {
      setWishlistLoading(false);
    }
  };
  const isPreOrder =
    isPreorderMeta ||
    product.tags?.includes("Pre-Order") ||
    (quantityInStock <= 0 && selectedVariant?.availableForSale);

  const handleAddItemToCart = () => {
    try {
      setLoading(true);
      addItem(
        {
          id: selectedVariant.id,
          name: product.title,
          price: parseFloat(selectedVariant.price.amount),
          color: selectedColor || "Default",
          size: selectedSize || "One Size",
          image: selectedVariant.image?.url || product.image,
        },
        quantity,
        session?.user.id || "",
        isPreOrder
      );
      openCart();
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast.dismiss();
      toast.error("Failed to add item to cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

  const handleVariantChange = (newColor: string, newSize?: string) => {
    setSelectedColor(newColor);
    if (newSize) setSelectedSize(newSize);

    // Remove the 'variant' query param
    const params = new URLSearchParams(searchParams.toString());
    params.delete("variant");
    router.replace(
      `${pathname}${params.toString() ? "?" + params.toString() : ""}`
    );
  };

  const handleGuestBuyProduct = async () => {
    if (!selectedVariant) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/shopify/createGuestCheckout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          variantId: selectedVariant.id,
          quantity: quantity,
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
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="p-4 sm:p-6 md:p-8 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          <div className="flex justify-center items-center p-4 sm:p-6">
            {/* Product Image with Custom Carousel */}
            <div className="relative w-full max-w-md">
              <ProductCarousel
                images={product.images}
                selectedIndex={selectedImageIndex}
                onImageSelect={handleImageSelect}
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6 lg:space-y-8">
            {/* Header */}
            <div className="flex flex-col xl:flex-row sm:justify-between sm:items-start gap-4">
              <div>
                {isPreOrder && (
                  <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                    Pre-Order
                  </span>
                )}

                <h1 className="text-3xl sm:text-4xl lg:text-[62px] font-normal text-[#1F1F1F]">
                  {product.title}
                </h1>
                <p className="text-lg sm:text-xl text-[#1F1F1FB2] mt-2 ">
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
            <div className="flex flex-col md:flex-row items-center gap-2">
              {!isPreOrder && (
                <div
                  className={`w-2 h-2 rounded-full ${selectedVariant?.availableForSale ? "bg-green-500" : "bg-red-500"}`}
                ></div>
              )}
              {!isPreOrder && (
                <span
                  className={`text-lg font-medium ${selectedVariant?.availableForSale ? "text-green-600" : "text-red-600"}`}
                >
                  {selectedVariant?.availableForSale
                    ? "In Stock"
                    : "Out of Stock"}
                </span>
              )}
              {isPreOrder ? (
                <div>
                  <span className="text-lg font-medium text-orange-600">
                    Available for Pre-Order
                  </span>
                  <br />
                  <span className="text-lg font-medium">
                    Ships on {formatDate(preorderDate as string)}
                  </span>
                </div>
              ) : quantityInStock > 0 ? (
                <span className="text-lg font-medium text-gray-700">
                  {quantityInStock} in stock
                </span>
              ) : null}
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
                      onClick={() => handleVariantChange(color)}
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
                        onClick={() => handleVariantChange(selectedColor, size)}
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
                  disabled={quantity === 1}
                  className="p-2 text-[20px]"
                >
                  <AiOutlineMinus size={20} />
                </Button>
                <span className="w-12 text-center text-[20px] font-medium  text-[#1F1F1F]">
                  {quantity.toString().padStart(2, "0")}
                </span>
                <Button
                  variant="link"
                  size="lg"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-[20px] "
                >
                  <AiOutlinePlus size={20} />
                </Button>
              </div>
            </div>

            {/* Action Buttons - Conditional based on authentication */}
            {session ? (
              // If user is logged in, show Add to Wishlist and Add to Cart buttons
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="link"
                  size="lg"
                  onClick={toggleWishlist}
                  className={`flex items-center justify-center gap-2 border border-black transition-all duration-200 px-4 py-2 rounded-md group
        ${
          isInWishlist
            ? "bg-red-100 text-red-600 border-red-200 hover:bg-red-200 hover:text-red-800"
            : "bg-white text-gray-800 hover:bg-gray-100 hover:text-black"
        }`}
                >
                  {wishListLoading ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : isInWishlist ? (
                    <>
                      <FaRegHeart
                        size={20}
                        className="text-red-600 animate-pulse"
                      />
                      <span className="font-medium">Remove from Wishlist</span>
                    </>
                  ) : (
                    <>
                      <FaRegHeart size={20} />
                      <span className="font-medium">Add to Wishlist</span>
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  disabled={!selectedVariant?.availableForSale}
                  onClick={handleAddItemToCart}
                  className={`flex items-center justify-center gap-2 ${"bg-[#EE9254] text-white hover:bg-[#EE9254] hover:text-white"}`}
                >
                  {loading ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : isPreOrder ? (
                    "Pre-Order Now"
                  ) : (
                    <>
                      <BsCart2 size={20} />
                      Add to Cart
                    </>
                  )}
                </Button>
              </div>
            ) : (
              // If user is not logged in, show only Buy Now button
              <div className="w-full">
                <Button
                  className="flex items-center w-full cursor-pointer justify-center gap-2 py-3 px-6 bg-[#EE9254] text-white rounded-lg text-base font-medium hover:bg-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!selectedVariant?.availableForSale || isLoading}
                  onClick={handleGuestBuyProduct}
                  size="lg"
                >
                  <AiOutlineShoppingCart size={20} />
                  {isLoading ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : selectedVariant?.availableForSale ? (
                    "Buy Now"
                  ) : (
                    "Out of Stock"
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="w-full  p-4 sm:p-6 md:p-8 lg:p-10 mx-auto">
        <Tabs defaultValue="description" className="w-full min-w-0">
          {/* TabsList: stacked on mobile, horizontal on sm+ */}
          <TabsList
            className="
      flex flex-col sm:flex-row
      gap-3 sm:gap-4
      h-auto p-0 bg-transparent !rounded-none
      w-full text-[20px] text-[#1F1F1FCC]
    "
          >
            <TabsTrigger
              className="w-full sm:w-auto text-[20px] text-[#1F1F1FCC] text-center"
              value="description"
            >
              Description
            </TabsTrigger>
            <TabsTrigger
              className="w-full sm:w-auto text-[20px] text-[#1F1F1FCC] text-center"
              value="reviews"
            >
              Reviews
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6 lg:mt-8 min-w-0">
            <div
              className="space-y-4 text-base md:text-2xl  prose prose-base md:prose-lg max-w-none"
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

          <TabsContent value="reviews" className="mt-6 lg:mt-8 min-w-0">
            <Reviews reviews={reviews} />
          </TabsContent>
        </Tabs>
      </div>
      <RecommendedProducts />
    </div>
  );
}
