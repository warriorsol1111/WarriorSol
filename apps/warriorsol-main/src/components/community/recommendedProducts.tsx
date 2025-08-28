"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useCartStore } from "@/store/cart-store";
import { GoArrowUpRight } from "react-icons/go";
interface Product {
  id: string;
  title: string;
  category: string;
  price: string;
  imageUrl: string;
  handle: string;
  availableForSale: boolean;
}

interface ShopifyProductEdge {
  node: {
    id: string;
    title: string;
    productType: string;
    handle: string;
    variants: {
      edges: Array<{
        node: {
          price: string;
          availableForSale: boolean;
        };
      }>;
    };
    images: {
      edges: Array<{
        node: {
          originalSrc: string;
        };
      }>;
    };
  };
}

interface ShopifyProductResponse {
  products: {
    edges: ShopifyProductEdge[];
  };
}

const RecommendedProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [wishlistLoading, setWishlistLoading] = useState<string | null>(null);
  const [cartLoading, setCartLoading] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<{ [id: string]: boolean }>({});
  const router = useRouter();
  const { data: session } = useSession();
  const { addItem, openCart } = useCartStore();

  const extractIDFromShopifyID = (id: string): string => {
    return id.split("/").pop() || "";
  };
  const transformProducts = (data: ShopifyProductResponse): Product[] => {
    if (!data.products?.edges) return [];
    return data.products.edges.map((edge: ShopifyProductEdge) => {
      const product = edge.node;
      const firstVariant = product.variants?.edges?.[0]?.node;
      const firstImage = product.images?.edges?.[0]?.node;
      return {
        id: product.id,
        title: product.title,
        category: product.productType || "General",
        price: firstVariant?.price ? `$${firstVariant.price}` : "$0.00",
        imageUrl: firstImage?.originalSrc || "/placeholder-image.jpg",
        handle: product.handle,
        availableForSale: firstVariant?.availableForSale ?? false,
      };
    });
  };

  const fetchProducts = useCallback(async () => {
    const PUBLIC_URL = process.env.NEXT_PUBLIC_APP_URL;
    setLoading(true);
    try {
      const endpoint = `${PUBLIC_URL}/api/shopify/getAllProducts`;
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }
      const data = await response.json();
      const transformed = transformProducts(data);
      setProducts(transformed.slice(0, 3)); // Limit to 3 items
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Helper to get first variantId for a product
  const getFirstVariantId = async (id: string): Promise<string | null> => {
    try {
      const res = await fetch(
        `/api/shopify/getProductById?id=${encodeURIComponent(id)}`
      );
      const data = await res.json();
      // The structure may be: data.variants.edges[0].id or similar
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

  // Add these handlers inside the component
  const handleToggleWishlist = async (product: Product) => {
    setWishlistLoading(product.id);
    const variantId = await getFirstVariantId(product.id);
    if (!variantId) {
      toast.dismiss();
      toast.error("Could not find product variant.");
      setWishlistLoading(null);
      return;
    }
    if (!session) {
      toast.dismiss();
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
        toast.dismiss();
        toast.success(
          isInWishlist ? "Item removed from Wishlist" : "Item Added to Wishlist"
        );
        setWishlist((prev) => ({ ...prev, [product.id]: !isInWishlist }));
      } else {
        toast.dismiss();
        toast.error(result?.message || "Something went wrong");
      }
    } catch {
      toast.dismiss();
      toast.error("Failed to update wishlist. Please try again.");
    } finally {
      setWishlistLoading(null);
    }
  };

  const handleAddToCart = async (product: Product) => {
    setCartLoading(product.id);
    const variantId = await getFirstVariantId(product.id);
    if (!variantId) {
      toast.dismiss();
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
      toast.dismiss();
      toast.success("Added to cart!");
    } catch {
      toast.dismiss();
      toast.error("Failed to add item to cart. Please try again.");
    } finally {
      setCartLoading(null);
    }
  };

  return (
    <section className="w-full ">
      {/* Heading */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-6">
        <div>
          <h2 className="text-4xl sm:text-5xl lg:text-[62px] leading-tight lg:leading-[62px] font-['Cormorant_SC'] font-normal text-[#1F1F1F] capitalize">
            You might also like
          </h2>
        </div>
        <Button
          variant="outline"
          size="lg"
          onClick={() => router.push("/products")}
          className="w-full sm:w-auto border border-black text-[#1F1F1F] px-4 sm:px-5 py-2.5 sm:py-3 !rounded-none text-base sm:text-lg lg:text-[20px] font-['Inter'] capitalize flex items-center justify-center sm:justify-start gap-2 hover:bg-white hover:text-black transition"
        >
          See All Products
          <GoArrowUpRight className="w-6 h-6" />
        </Button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
        {loading ? (
          <div className="col-span-full flex justify-center">
            <Loader2 className="animate-spin h-8 w-8 text-[#EE9254]" />
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="group flex flex-col gap-3 relative"
            >
              <Link
                href={`/products/${extractIDFromShopifyID(product.id)}`}
                className="block"
              >
                {/* Image Card */}
                {/* Image Card */}
                <div className="relative w-full aspect-[4/5]">
                  <Image
                    src={product.imageUrl}
                    alt={product.title}
                    fill
                    className="object-contain rounded-md bg-white"
                  />
                </div>

                {/* Details */}
                <div className="flex justify-between px-1 sm:px-2">
                  <div>
                    <div className="text-sm sm:text-base lg:text-[16px] font-['Cormorant'] font-medium text-[#1F1F1F]">
                      {product.title}
                    </div>
                    <div className="text-xs sm:text-[12.5px] text-[#1E1E1E99] font-light font-['Inter']">
                      {product.category}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm sm:text-base lg:text-[14px] font-['Cormorant'] font-medium text-[#1F1F1F]">
                      {product.price}
                    </div>
                  </div>
                </div>
              </Link>
              {/* Overlay with icons OUTSIDE the anchor */}
              <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="link"
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-white flex items-center justify-center text-lg sm:text-xl rounded-full shadow p-0"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleToggleWishlist(product);
                  }}
                  disabled={wishlistLoading === product.id}
                >
                  {wishlistLoading === product.id ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : wishlist[product.id] ? (
                    <AiFillHeart className="text-red-500" />
                  ) : (
                    <AiOutlineHeart className="text-gray-500" />
                  )}
                </Button>
                {!product.availableForSale ? (
                  <div title="Out of stock">
                    <Button
                      variant="link"
                      className="w-8 h-8 sm:w-10 sm:h-10 bg-white flex items-center justify-center text-lg sm:text-xl rounded-full shadow p-0"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      disabled
                    >
                      <AiOutlineShoppingCart />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="link"
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-white flex items-center justify-center text-lg sm:text-xl rounded-full shadow p-0"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                    disabled={cartLoading === product.id}
                  >
                    {cartLoading === product.id ? (
                      <Loader2 className="animate-spin h-5 w-5" />
                    ) : (
                      <AiOutlineShoppingCart />
                    )}
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default RecommendedProducts;
