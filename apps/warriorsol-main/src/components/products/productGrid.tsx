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
  const [wishlist, setWishlist] = useState<{ [id: string]: boolean }>({});
  const [wishlistLoading, setWishlistLoading] = useState<string | null>(null);
  const [cartLoading, setCartLoading] = useState<string | null>(null);
  const { data: session } = useSession();
  const { addItem, openCart } = useCartStore();

  // Helper to get first variantId for a product
  const getFirstVariantId = async (id: string): Promise<string | null> => {
    try {
      const res = await fetch(
        `/api/shopify/getProductById?id=${encodeURIComponent(id)}`
      );
      const data = await res.json();
      const variantId =
        data?.variants?.[0]?.id ||
        data?.variant?.id ||
        data?.variants?.edges?.[0]?.node?.id;
      return variantId || null;
    } catch {
      return null;
    }
  };

  // Check wishlist status for each product
  useEffect(() => {
    const checkAllWishlists = async () => {
      if (!session) return;
      const newWishlist: { [id: string]: boolean } = {};
      for (const product of products) {
        const variantId = await getFirstVariantId(product.id);
        if (!variantId) continue;
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/wishlist/check?variantId=${variantId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${session?.user.token}`,
              },
            }
          );
          const result = await res.json();
          newWishlist[product.id] = !!result?.data?.isInWishlist;
        } catch {
          newWishlist[product.id] = false;
        }
      }
      setWishlist(newWishlist);
    };
    if (products.length && session) checkAllWishlists();
  }, [products, session]);

  const handleToggleWishlist = async (product: Product) => {
    setWishlistLoading(product.id);
    const variantId = await getFirstVariantId(product.id);
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
    const isInWishlist = wishlist[product.id];
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
        toast.success(
          isInWishlist ? "Item removed from Wishlist" : "Item Added to Wishlist"
        );
        setWishlist((prev) => ({ ...prev, [product.id]: !isInWishlist }));
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
    const variantId = await getFirstVariantId(product.id);
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
      {products.map((product) => (
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
            </div>
            <div className="p-3 sm:p-4">
              <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate">
                {product.title}
              </h3>
              <p className="mt-1 text-sm sm:text-base font-medium text-gray-700">
                {product.price}
              </p>
              <p className="mt-1 text-xs sm:text-sm text-gray-500">
                {product.category}
              </p>
            </div>
          </a>
          {session?.user && (
            <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex flex-row gap-2 sm:gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
                ) : wishlist[product.id] ? (
                  <AiFillHeart className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                ) : (
                  <AiOutlineHeart className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                )}
              </Button>
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
      ))}
    </div>
  );
};

export default ProductGrid;
