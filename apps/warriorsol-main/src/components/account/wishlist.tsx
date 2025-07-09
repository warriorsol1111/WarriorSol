"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
import { Loader2 } from "lucide-react";
interface VariantDetail {
  title: string;
  image: string;
  price: string;
  productId: string; // For linking like /products/123
  productTitle: string;
}

interface WishlistItem {
  id: string;
  userId: string;
  variantId: string;
  createdAt: string;
  details?: VariantDetail;
}

export default function Wishlist() {
  const { data: session } = useSession();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const token = session?.user?.token;

  const fetchVariantDetails = async (
    variantId: string
  ): Promise<VariantDetail | null> => {
    try {
      const res = await fetch(
        `/api/shopify/getVariantById?variantId=${variantId}`
      );
      const data = await res.json();

      const productId = data.product.id.split("/Product/")[1];
      const image =
        data.variant.image?.originalSrc ||
        data.product.images[0]?.originalSrc ||
        "";
      const price = `$${parseFloat(data.variant.price.amount).toFixed(2)}`;

      return {
        title: data.variant.title,
        image,
        price,
        productId,
        productTitle: data.product.title,
      };
    } catch (err) {
      console.error(`Error fetching variant ${variantId}:`, err);
      return null;
    }
  };

  useEffect(() => {
    if (!token) return;

    const fetchWishlist = async () => {
      try {
        const [itemsRes, countRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/wishlist`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/wishlist/count`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const itemsData = await itemsRes.json();
        const countData = await countRes.json();

        if (itemsData?.data) {
          const itemsWithDetails = await Promise.all(
            itemsData.data.map(async (item: WishlistItem) => {
              const details = await fetchVariantDetails(item.variantId);
              return { ...item, details };
            })
          );
          setWishlistItems(itemsWithDetails);
        }

        if (countData?.data) setCount(Number(countData.data));
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [token]);

  const handleClearWishlist = async () => {
    try {
      setDeleteLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/wishlist/clear`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const result = await res.json();

      if (res.ok) {
        toast.success("Wishlist cleared successfully");
        setWishlistItems([]);
        setCount(0);
      } else {
        toast.error(result.message || "Failed to clear wishlist");
      }
    } catch (error) {
      console.error("Error clearing wishlist:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-2">Your Wishlist</h1>
      <p className="text-gray-600 mb-6">
        {count} item{count !== 1 && "s"} saved
      </p>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin h-16 w-16 text-[#EE9254]" />
        </div>
      ) : count === 0 ? (
        <>
          <p className="text-gray-500 mb-8">
            Your wishlist is currently empty.
          </p>
          <Link href="/products">
            <Button className="bg-[#EE9254] hover:bg-[#EE9254]">
              Browse Products
            </Button>
          </Link>
        </>
      ) : (
        <div className="w-full max-w-4xl space-y-6">
          <div className="flex justify-end">
            <Button
              variant="destructive"
              className="text-lg"
              onClick={handleClearWishlist}
            >
              {deleteLoading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                "Clear Wishlist"
              )}
            </Button>
          </div>

          <ul className="flex flex-col gap-6">
            {wishlistItems.map((item) => {
              const d = item.details;
              if (!d) return null;

              return (
                <li
                  key={item.id}
                  className="bg-white rounded-xl shadow p-6 flex flex-row items-center gap-6 w-full"
                >
                  {d.image && (
                    <div className="flex-shrink-0">
                      <Image
                        src={d.image}
                        alt={d.title}
                        width={120}
                        height={120}
                        className="rounded-lg w-[120px] h-[120px] object-cover border border-gray-200"
                      />
                    </div>
                  )}
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-4 justify-between w-full">
                    <div className="flex-1 min-w-0">
                      <h2 className="font-bold text-xl text-gray-900 truncate">
                        {d.productTitle}
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">
                        Variant:{" "}
                        <span className="font-medium text-gray-800">
                          {d.title}
                        </span>
                      </p>
                      <p className="text-gray-900 font-semibold text-lg mt-2">
                        {d.price}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Added on {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2 min-w-[140px]">
                      <Link
                        href={`/products/${d.productId}?variant=${item.variantId}`}
                        className="text-lg text-white hover:underline bg-[#EE9254] px-4 py-2 border border-[EE9254] rounded-lg font-bold transition"
                      >
                        View Product
                      </Link>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
