"use client";
import React, { useEffect, useState, useCallback } from "react";
import Navbar from "../../shared/navbar";
import Footer from "../../shared/footer";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import ProductGrid from ".././productGrid";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../..//ui/tabs";
import Filter, { FilterState, initialFilterState } from "./filters";
import { BsFilterLeft } from "react-icons/bs";
import { Button } from "../../ui/button";
import { SocialLinks } from "../../shared/socialLinks";

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
    availableForSale: boolean;
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

const WarriorProducts = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(initialFilterState);

  const transformProducts = (data: ShopifyProductResponse): Product[] => {
    if (!data.products?.edges) return [];
    console.log("Transforming products:", data.products.edges);

    return data.products.edges.map((edge: ShopifyProductEdge) => {
      const product = edge.node;
      const firstVariant = product.variants?.edges?.[0]?.node;
      const firstImage = product.images?.edges?.[0]?.node;

      // Check if ANY variant is available for sale
      const hasAvailableVariant =
        product.variants?.edges?.some(
          (variantEdge) => variantEdge.node.availableForSale
        ) ?? false;

      return {
        id: product.id,
        title: product.title,
        category: product.productType || "General",
        price: firstVariant?.price ? `$${firstVariant.price}` : "$0.00",
        imageUrl: firstImage?.originalSrc || "/placeholder-image.jpg",
        handle: product.handle,
        availableForSale: hasAvailableVariant, // Now checks all variants
      };
    });
  };

  const fetchProducts = useCallback(
    async (tabValue: string, currentFilters: FilterState) => {
      const PUBLIC_URL = process.env.NEXT_PUBLIC_APP_URL;
      setLoading(true);
      setError(null);

      try {
        const endpoint = `${PUBLIC_URL}/api/shopify/getAllProducts`;
        const queryParams = new URLSearchParams();

        // Add tab value to query
        switch (tabValue) {
          case "bestsellers":
            queryParams.append("type", "bestsellers");
            break;
          case "community":
            queryParams.append("type", "community");
            break;
        }

        // Add filters to query
        if (currentFilters.productType.length > 0) {
          queryParams.append(
            "productType",
            currentFilters.productType.join(",")
          );
        }
        if (currentFilters.color.length > 0) {
          queryParams.append("color", currentFilters.color.join(","));
        }
        if (currentFilters.size.length > 0) {
          queryParams.append("size", currentFilters.size.join(","));
        }
        if (currentFilters.gender.length > 0) {
          queryParams.append("gender", currentFilters.gender.join(","));
        }
        if (currentFilters.collection.length > 0) {
          queryParams.append("collection", currentFilters.collection.join(","));
        }
        if (currentFilters.sortBy !== "New In") {
          queryParams.append("sortBy", currentFilters.sortBy.toLowerCase());
        }

        const queryString = queryParams.toString();
        const finalEndpoint = queryString
          ? `${endpoint}?${queryString}`
          : endpoint;

        const response = await fetch(finalEndpoint);

        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`);
        }

        const data = await response.json();
        const transformedProducts = transformProducts(data);
        setProducts(transformedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch products"
        );
        setProducts([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchProducts(activeTab, filters);
  }, [activeTab, filters, fetchProducts]);

  const handleApplyFilters = () => {
    setIsFilterOpen(false);
    fetchProducts(activeTab, filters);
  };

  return (
    <div>
      <Navbar />
      <div className="px-4 sm:px-6 md:px-8 lg:px-10 pt-6 pb-4 relative">
        {/* Header with title and filter button */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
          <h1 className="text-[32px] md:text-[48px] text-center md:text-start lg:text-[62px] font-normal">
            View Our Warriors Collection
          </h1>

          {/* Filter button - hidden on mobile, shown as small button on tablet+ */}
          <Button
            onClick={() => setIsFilterOpen(true)}
            variant="link"
            size="default"
            className="hidden md:flex items-center gap-2 border border-gray-300 py-2 px-4 text-sm hover:bg-gray-50 transition-colors rounded"
          >
            <BsFilterLeft size={16} />
            <span>Sort & Filter</span>
          </Button>
        </div>

        <p className="text-base md:text-lg lg:text-xl font-light font-inter text-gray-600 mb-6">
          Every collection tells a story. Find the one that speaks to your
          journey.
        </p>

        {/* Mobile filter button - full width */}
        <Button
          variant="link"
          onClick={() => setIsFilterOpen(true)}
          className="md:hidden w-full border border-gray-300 py-3 px-4 flex items-center justify-between text-base hover:bg-gray-50 transition mb-6"
        >
          <span>Sort & Filter</span>
          <BsFilterLeft size={20} />
        </Button>

        <Filter
          isOpen={isFilterOpen}
          onOpenChange={setIsFilterOpen}
          filters={filters}
          onFiltersChange={setFilters}
          onApplyFilters={handleApplyFilters}
        />
      </div>
      <div className="px-4 sm:px-6 md:px-8 lg:px-10">
        <Tabs
          defaultValue="all"
          className="w-full"
          onValueChange={(value) => {
            setActiveTab(value);
          }}
        >
          <TabsList className="grid grid-cols-1 sm:grid-cols-3 w-full max-w-full sm:max-w-fit gap-2 sm:gap-0 mb-6 h-auto sm:h-auto bg-transparent p-0">
            <TabsTrigger
              value="all"
              className="w-full py-3 px-4 border border-gray-300 text-center text-sm sm:text-base hover:bg-gray-50 transition data-[state=active]:bg-[#EE9254] data-[state=active]:text-white data-[state=active]:border-black rounded-none sm:rounded-l-md"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="bestsellers"
              className="w-full py-3 px-4 border border-gray-300 text-center text-sm sm:text-base hover:bg-gray-50 transition data-[state=active]:bg-[#EE9254] data-[state=active]:text-white data-[state=active]:border-black rounded-none sm:border-l-0"
            >
              Bestsellers
            </TabsTrigger>
            <TabsTrigger
              value="community"
              className="w-full py-3 px-4 border border-gray-300 text-center text-sm sm:text-base hover:bg-gray-50 transition data-[state=active]:bg-[#EE9254] data-[state=active]:text-white data-[state=active]:border-black rounded-none sm:rounded-r-md sm:border-l-0"
            >
              Community Picks
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <AiOutlineLoading3Quarters className="w-8 h-8 animate-spin" />
                <span className="ml-2">Loading products...</span>
              </div>
            ) : error ? (
              <div className="text-center py-20 text-red-600">
                <p>Error: {error}</p>
                <p className="text-sm text-gray-600 mt-2">
                  Please try again later
                </p>
              </div>
            ) : (
              <ProductGrid products={products} />
            )}
          </TabsContent>
          <TabsContent value="bestsellers">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <AiOutlineLoading3Quarters className="w-8 h-8 animate-spin" />
                <span className="ml-2">Loading bestsellers...</span>
              </div>
            ) : error ? (
              <div className="text-center py-20 text-red-600">
                <p>Error: {error}</p>
                <p className="text-sm text-gray-600 mt-2">
                  Please try again later
                </p>
              </div>
            ) : (
              <ProductGrid products={products} />
            )}
          </TabsContent>
          <TabsContent value="community">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <AiOutlineLoading3Quarters className="w-8 h-8 animate-spin" />
                <span className="ml-2">Loading community picks...</span>
              </div>
            ) : error ? (
              <div className="text-center py-20 text-red-600">
                <p>Error: {error}</p>
                <p className="text-sm text-gray-600 mt-2">
                  Please try again later
                </p>
              </div>
            ) : (
              <ProductGrid products={products} />
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Social Links Grid */}
      <SocialLinks />
      <Footer />
    </div>
  );
};

export default WarriorProducts;
