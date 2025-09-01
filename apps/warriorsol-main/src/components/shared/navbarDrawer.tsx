"use client";

import React, { useState, useEffect } from "react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "../ui/input";
import { DialogTitle } from "@radix-ui/react-dialog";

interface ProductResult {
  handle: string;
  title: string;
  id: string;
  image?: {
    url: string;
  } | null;
}

const NavbarSearchDrawer = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<ProductResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (search.trim().length < 1) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/shopify/searchProducts?q=${encodeURIComponent(search)}`
        );
        const data = await res.json();
        setResults(data.products || []);
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  const extractShopifyId = (gid: string) => {
    const match = gid.match(/\/(Product|products)\/(\d+)/);
    return match ? match[2] : gid;
  };

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="top">
      <DrawerTrigger asChild>
        <Button
          variant="link"
          className="p-1 sm:p-2 cursor-pointer transition-colors"
        >
          <Search className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </DrawerTrigger>

      <DrawerContent className="!h-fit overflow-hidden rounded-b-xl sm:rounded-b-2xl border-b shadow-xl w-full px-3 pt-4 pb-6 sm:px-6 sm:pt-6 sm:pb-10 md:px-8 lg:px-10 xl:max-w-3xl 2xl:max-w-4xl mx-auto">
        <DialogTitle className="sr-only">Product Search</DialogTitle>

        <div className="space-y-3 sm:space-y-4 w-full">
          {/* Search Input */}
          <div className="relative">
            <Input
              type="text"
              placeholder="Search for products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 pr-10"
              autoFocus
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>

          {/* Results Container */}
          <div className="min-h-[200px] sm:min-h-[250px]">
            {isLoading ? (
              <div className="text-center text-sm sm:text-base text-gray-500 py-8 sm:py-12">
                <span className="animate-spin inline-block w-5 h-5 sm:w-6 sm:h-6 mr-2 border-2 border-orange-400 border-t-transparent rounded-full"></span>
                Searching...
              </div>
            ) : search.trim().length >= 1 ? (
              results.length > 0 ? (
                <div className="max-h-[300px] sm:max-h-[400px] lg:max-h-[500px] overflow-y-auto divide-y divide-gray-100">
                  {results.map((product) => (
                    <div
                      key={product.handle}
                      className="flex items-center gap-3 sm:gap-4 py-3 sm:py-4 px-2 sm:px-3 cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 rounded-lg mx-1"
                      onClick={() => {
                        setOpen(false);
                        router.push(
                          `/products/${extractShopifyId(product.id)}`
                        );
                      }}
                    >
                      {/* Product Image */}
                      {product.image?.url ? (
                        <div className="flex-shrink-0">
                          <Image
                            src={product.image.url}
                            alt={product.title}
                            width={48}
                            height={48}
                            className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 object-cover rounded-md shadow-sm"
                          />
                        </div>
                      ) : (
                        <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gray-200 rounded-md flex items-center justify-center">
                          <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                        </div>
                      )}

                      {/* Product Title */}
                      <div className="flex-1 min-w-0">
                        <span className="text-sm sm:text-base font-medium text-gray-900 line-clamp-2 leading-tight">
                          {product.title}
                        </span>
                      </div>

                      {/* Arrow indicator for larger screens */}
                      <div className="hidden sm:block flex-shrink-0">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm sm:text-base text-gray-500 py-8 sm:py-12 text-center">
                  <div className="mb-2">
                    <Search className="h-8 w-8 sm:h-10 sm:w-10 text-gray-300 mx-auto" />
                  </div>
                  <p className="font-medium">No results found</p>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">
                    Try a different keyword!
                  </p>
                </div>
              )
            ) : (
              <div className="text-sm sm:text-base text-gray-500 py-8 sm:py-12 text-center">
                <div className="mb-2">
                  <Search className="h-8 w-8 sm:h-10 sm:w-10 text-gray-300 mx-auto" />
                </div>
                <p className="font-medium">Start typing to search</p>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  Find your warrior gear!
                </p>
              </div>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default NavbarSearchDrawer;
