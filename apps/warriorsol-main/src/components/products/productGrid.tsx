// Updated ProductGrid component with fixed preorder display

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
  metafields: Metafield[];
};

interface Metafield {
  namespace: string;
  key: string;
  value: string;
}

interface ProductGridProps {
  products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  const [wishlistLoading, setWishlistLoading] = useState<string | null>(null);
  const [cartLoading, setCartLoading] = useState<string | null>(null);
  const [productVariants, setProductVariants] = useState<
    Record<string, string>
  >({});
  const { data: session } = useSession();

  const { addItem, openCart } = useCartStore();
  const {
    items,
    addItem: addWishlist,
    removeItem: removeWishlist,
  } = useWishlistStore();

  // Helper functions for metafields
  const getMetafieldValue = (
    metafields: Metafield[],
    namespace: string,
    key: string
  ): string | null => {
    if (!metafields || !Array.isArray(metafields)) return null;

    const metafield = metafields.find(
      (field) => field && field.namespace === namespace && field.key === key
    );
    return metafield?.value || null;
  };

  const isPreorder = (metafields: Metafield[]): boolean => {
    const preorderValue = getMetafieldValue(
      metafields,
      "custom",
      "is_preorder"
    );
    return preorderValue === "true";
  };

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
        1,
        session?.user.id || ""
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
        const productIsPreorder = isPreorder(product.metafields);

        return (
          <div key={product.id} className="group relative">
            <a
              href={`/products/${extractShopifyId(product.id)}`}
              className="block overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="relative w-full pt-[100%] overflow-hidden">
                <Image
                  src={product.imageUrl}
                  alt={product.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="absolute top-0 left-0 w-full h-full object-cover object-center transform transition-transform duration-300 group-hover:scale-105"
                />

                {/* Status badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {!product.availableForSale && (
                    <div className="bg-red-600 text-white text-[11px] font-semibold uppercase px-2.5 py-1 rounded-full shadow-lg">
                      Out of Stock
                    </div>
                  )}

                  {productIsPreorder && (
                    <div className="bg-orange-600 text-white text-[11px] font-semibold uppercase px-2.5 py-1 rounded-full shadow-lg">
                      Pre-order
                    </div>
                  )}
                </div>
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
                <Button
                  variant="link"
                  className="bg-white flex items-center justify-center text-lg sm:text-xl !rounded-full shadow p-0 !w-10 !h-10"
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

                <Button
                  variant="link"
                  className="bg-white flex items-center justify-center text-lg sm:text-xl !rounded-full shadow p-0 !w-10 !h-10"
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
