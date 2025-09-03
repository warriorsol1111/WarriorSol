"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
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
  const router = useRouter();

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

  return (
    <section className="w-full p-8 mb-10">
      {/* Heading */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-6">
        <div>
          <h2 className="text-4xl sm:text-5xl lg:text-[62px] leading-tight lg:leading-[62px]  font-normal text-[#1F1F1F] capitalize">
            You might also like
          </h2>
        </div>
        <Button
          variant="outline"
          size="lg"
          onClick={() => router.push("/products")}
          className="w-full sm:w-auto border border-black text-[#1F1F1F] px-4 sm:px-5 py-2.5 sm:py-3 !rounded-none text-base sm:text-lg lg:text-[20px]  capitalize flex items-center justify-center sm:justify-start gap-2 hover:bg-white hover:text-black transition"
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
                    <div className="text-sm sm:text-base lg:text-[16px]  font-medium text-[#1F1F1F]">
                      {product.title}
                    </div>
                    <div className="text-xs sm:text-[12.5px] text-[#1E1E1E99] font-light ">
                      {product.category}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm sm:text-base lg:text-[14px]  font-medium text-[#1F1F1F]">
                      {product.price}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default RecommendedProducts;
