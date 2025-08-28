"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { Button } from "../ui/button";

type Product = {
  id: string;
  title: string;
  category: string;
  price: string;
  imageUrl: string;
  handle: string;
  availableForSale: boolean;
};

interface ProductGridProps {
  products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  const [wishlistLoading, setWishlistLoading] = useState<string | null>(null);
  const [cartLoading, setCartLoading] = useState<string | null>(null);
  // Track variant IDs for each product
  const [productVariants, setProductVariants] = useState<
    Record<string, string>
  >({});
  const { data: session } = useSession();

  // ✅ Global stores
  const { addItem, openCart } = useCartStore();
  const {
    items,
    addItem: addWishlist,
    removeItem: removeWishlist,
  } = useWishlistStore();

  // Helper to get first variantId for a product
  const getFirstVariantId = async (id: string): Promise<string> => {
    try {
      const res = await fetch(
        `/api/shopify/getProductById?id=${encodeURIComponent(id)}`
      );
      const data = await res.json();
      const variantId =
        data?.variants?.[0]?.id ||
        data?.variant?.id ||
        data?.variants?.edges?.[0]?.node?.id;
      return variantId;
    } catch {
      return "";
    }
  };

  // Load variant IDs for all products on mount
  useEffect(() => {
    const loadVariantIds = async () => {
      const variants: Record<string, string> = {};

      await Promise.all(
        products.map(async (product) => {
          const variantId = await getFirstVariantId(product.id);
          if (variantId) {
            variants[product.id] = variantId;
          }
        })
      );

      setProductVariants(variants);
    };

    loadVariantIds();
  }, [products]);

  // ✅ Wishlist toggle using store
  const handleToggleWishlist = async (product: Product) => {
    setWishlistLoading(product.id);
    let variantId = productVariants[product.id];

    if (!variantId) {
      variantId = await getFirstVariantId(product.id);
      if (variantId) {
        setProductVariants((prev) => ({ ...prev, [product.id]: variantId }));
      }
    }

    if (!variantId) {
      toast.error("Could not find product variant.");
      setWishlistLoading(null);
      return;
    }
    if (!session) {
      toast.error("Please log in to use wishlist.");
      setWishlistLoading(null);
      return;
    }

    const isInWishlist = items.includes(variantId);
    const method = isInWishlist ? "DELETE" : "POST";

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/wishlist`,
        {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user.token}`,
          },
          body: JSON.stringify({ variantId }),
        }
      );
      const result = await res.json();
      if (res.ok) {
        if (isInWishlist) {
          removeWishlist(variantId);
          toast.success("Item removed from Wishlist");
        } else {
          addWishlist(variantId);
          toast.success("Item added to Wishlist");
        }
      } else {
        toast.error(result?.message || "Something went wrong");
      }
    } catch {
      toast.error("Failed to update wishlist. Please try again.");
    } finally {
      setWishlistLoading(null);
    }
  };

  // ✅ Add to cart
  const handleAddToCart = async (product: Product) => {
    setCartLoading(product.id);
    let variantId = productVariants[product.id];

    if (!variantId) {
      variantId = await getFirstVariantId(product.id);
      if (variantId) {
        setProductVariants((prev) => ({ ...prev, [product.id]: variantId }));
      }
    }

    if (!variantId) {
      toast.error("Could not find product variant.");
      setCartLoading(null);
      return;
    }
    try {
      await addItem(
        {
          id: variantId,
          name: product.title,
          price: parseFloat(product.price.replace("$", "")),
          color: "Default",
          size: "One Size",
          image: product.imageUrl,
        },
        1
      );
      openCart();
      toast.success("Added to cart!");
    } catch {
      toast.error("Failed to add item to cart. Please try again.");
    } finally {
      setCartLoading(null);
    }
  };

  const extractShopifyId = (gid: string) => {
    const match = gid.match(/\/Product\/(\d+)/);
    return match ? match[1] : gid;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
      {products.map((product) => {
        const variantId = productVariants[product.id];
        const isInWishlist = variantId ? items.includes(variantId) : false;

        return (
          <div key={product.id} className="group relative">
            <a
              href={`/products/${extractShopifyId(product.id)}`}
              className="block overflow-hidden rounded-xl shadow-sm hover:shadow-lg transition-all duration-300"
            >
              {/* Only the image and info go here */}
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden relative">
                <Image
                  src={product.imageUrl}
                  alt={product.title}
                  width={500}
                  height={500}
                  className="h-full w-full object-cover object-center transform transition-transform duration-300 group-hover:scale-105"
                />
                {!product.availableForSale && (
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-[11px] font-semibold uppercase px-2.5 py-1 rounded-full shadow-lg">
                    Out of Stock
                  </div>
                )}
              </div>
              <div className="p-3 sm:p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm sm:text-base font-medium text-[#1F1F1F] truncate">
                    {product.title}
                  </h3>
                  <p className="text-sm sm:text-base font-medium text-[#1F1F1F] whitespace-nowrap ml-2">
                    {product.price}
                  </p>
                </div>
                <p className="mt-1 text-[12px] sm:text-[12px] text-[#1F1F1F99]">
                  {product.category}
                </p>
              </div>
            </a>
            {session?.user && (
              <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex flex-row gap-2 sm:gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {/* Wishlist button */}
                <Button
                  variant="link"
                  className="p-1.5 sm:p-2 bg-white/90 backdrop-blur-sm cursor-pointer hover:bg-white transition-colors shadow-md rounded-full"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleToggleWishlist(product);
                  }}
                  disabled={wishlistLoading === product.id}
                >
                  {wishlistLoading === product.id ? (
                    <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                  ) : isInWishlist ? (
                    <AiFillHeart className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                  ) : (
                    <AiOutlineHeart className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                  )}
                </Button>

                {/* Cart button */}
                <Button
                  variant="link"
                  className="p-1.5 sm:p-2 bg-white/90 backdrop-blur-sm cursor-pointer hover:bg-white transition-colors shadow-md rounded-full"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                  disabled={
                    cartLoading === product.id || !product.availableForSale
                  }
                >
                  {cartLoading === product.id ? (
                    <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                  ) : (
                    <AiOutlineShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProductGrid;
