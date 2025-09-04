"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import Navbar from "../shared/navbar";
import Footer from "../shared/footer";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import ProductGrid from "./productGrid";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import Filter from "./filters";
import { BsFilterLeft } from "react-icons/bs";
import { Button } from "../ui/button";
import { SocialLinks } from "../shared/socialLinks";
import {
  useSessionFilters,
  initialFilterState,
} from "../../lib/hooks/useFilterSession";

interface Variant {
  title: string;
  price: string;
  availableForSale: boolean;
}

interface Product {
  id: string;
  title: string;
  category: string;
  price: string;
  imageUrl: string;
  handle: string;
  availableForSale: boolean;
  variants: Variant[];
  colors: string[];
  sizes: string[];
  priceValue: number;
}

interface ShopifyProductEdge {
  node: {
    id: string;
    title: string;
    productType: string;
    handle: string;
    variants: {
      edges: Array<{ node: Variant }>;
    };
    images: {
      edges: Array<{
        node: {
          originalSrc: string;
        };
      }>;
    };
    options: Array<{
      name: string;
      values: string[];
    }>;
  };
}

interface Collection {
  id: string;
  title: string;
  handle: string;
  productHandles: string[];
}

interface ShopifyProductResponse {
  products: {
    edges: ShopifyProductEdge[];
  };
  collections: Collection[];
}

const Products: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Use session-based filter persistence
  const { filters, setFilters, isLoaded: filtersLoaded } = useSessionFilters();

  // Helper function to get active filters count (consistent with Filter component)
  const getActiveFiltersCount = () => {
    return (
      filters.productType.length +
      filters.color.length +
      filters.size.length +
      filters.priceRange.length +
      filters.availability.length +
      (filters.sortBy !== "New In" ? 1 : 0)
    );
  };

  const extractColorsFromVariants = (
    variants: Variant[],
    options: ShopifyProductEdge["node"]["options"]
  ): string[] => {
    const colorOption = options?.find(
      (option) => option.name.toLowerCase() === "color"
    );
    if (colorOption) {
      return colorOption.values.map((color) =>
        color.toLowerCase().replace(/[^a-z]/g, "")
      );
    }
    const colors = new Set<string>();
    variants.forEach((variant) => {
      const title = variant.title.toLowerCase();
      if (title.includes("black")) colors.add("black");
      if (title.includes("white")) colors.add("white");
      if (title.includes("grey") || title.includes("gray")) colors.add("grey");
      if (title.includes("charcoal")) colors.add("charcoal");
      if (title.includes("cardinal")) colors.add("cardinal");
      if (title.includes("loden")) colors.add("loden");
      if (title.includes("red")) colors.add("red");
      if (title.includes("blue")) colors.add("blue");
    });
    return Array.from(colors);
  };

  const extractSizesFromVariants = (
    variants: Variant[],
    options: ShopifyProductEdge["node"]["options"]
  ): string[] => {
    const sizeOption = options?.find(
      (option) => option.name.toLowerCase() === "size"
    );
    if (sizeOption) {
      return sizeOption.values;
    }
    const sizes = new Set<string>();
    const sizePattern = /\b(2XS|XS|S|M|L|XL|2XL|3XL|4XL|5XL|6XL)\b/gi;
    variants.forEach((variant) => {
      const matches = variant.title.match(sizePattern);
      if (matches) {
        matches.forEach((size) => sizes.add(size.toUpperCase()));
      }
    });
    return Array.from(sizes);
  };

  const determineProductType = (title: string): string => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("t-shirt") || lowerTitle.includes("tshirt"))
      return "T-Shirts";
    if (
      lowerTitle.includes("cap") ||
      lowerTitle.includes("hat") ||
      lowerTitle.includes("hummingbird")
    )
      return "Caps";
    if (lowerTitle.includes("pants") || lowerTitle.includes("trouser"))
      return "Pants";
    if (lowerTitle.includes("hoodie")) return "Hoodie";
    return "Other";
  };

  // Helper to get first variantId and availability for a product
  const getProductAvailability = async (
    id: string
  ): Promise<{ variantId: string | null; available: boolean }> => {
    try {
      const res = await fetch(
        `/api/shopify/getProductById?id=${encodeURIComponent(id)}`
      );
      const data = await res.json();

      const variant =
        data?.variants?.[0] ||
        data?.variant ||
        data?.variants?.edges?.[0]?.node;
      const variantId = variant?.id || null;
      const available = variant?.availableForSale ?? true;

      return { variantId, available };
    } catch (error) {
      console.error(`Error fetching availability for product ${id}:`, error);
      return { variantId: null, available: true };
    }
  };

  const fetchProducts = useCallback(async () => {
    const transformProducts = (data: ShopifyProductResponse): Product[] => {
      return data.products.edges.map((edge) => {
        const product = edge.node;
        const variants = product.variants.edges.map((v) => v.node);
        const firstVariant = variants[0];
        const firstImage = product.images?.edges?.[0]?.node;
        const hasAvailableVariant = variants.some((v) => v.availableForSale);
        const colors = extractColorsFromVariants(
          variants,
          product.options || []
        );
        const sizes = extractSizesFromVariants(variants, product.options || []);
        const priceValue = firstVariant?.price
          ? parseFloat(firstVariant.price)
          : 0;

        return {
          id: product.id,
          title: product.title,
          category: determineProductType(product.title),
          price: firstVariant?.price ? `$${firstVariant.price}` : "$0.00",
          imageUrl: firstImage?.originalSrc || "/placeholder-image.jpg",
          handle: product.handle,
          availableForSale: hasAvailableVariant,
          variants,
          colors,
          sizes,
          priceValue,
        };
      });
    };

    const PUBLIC_URL = process.env.NEXT_PUBLIC_APP_URL;
    setLoading(true);
    setError(null);

    try {
      const endpoint = `${PUBLIC_URL}/api/shopify/getAllProducts`;
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }
      const data: ShopifyProductResponse = await response.json();
      setCollections(data.collections);
      const transformedProducts = transformProducts(data);

      // Fetch availability for all products concurrently
      const availabilityPromises = transformedProducts.map(async (product) => {
        const { available } = await getProductAvailability(product.id);
        return {
          ...product,
          availableForSale: available,
        };
      });

      // Wait for all availability checks to complete
      const productsWithAvailability = await Promise.all(availabilityPromises);
      setAllProducts(productsWithAvailability);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch products"
      );
      setAllProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const normalizeTitle = (title: string) => {
    return title
      .replace(/["']/g, "")
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .toLowerCase()
      .trim();
  };

  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];

    if (filters.productType.length > 0) {
      filtered = filtered.filter((product) => {
        const categoryMatch = filters.productType.includes(product.category);

        const collectionMatch = filters.productType.some((filterType) => {
          const matchedCollection = collections.find(
            (c) => c.title === filterType
          );
          return (
            matchedCollection &&
            matchedCollection.productHandles.includes(product.handle)
          );
        });

        return categoryMatch || collectionMatch;
      });
    }

    if (filters.color.length > 0) {
      filtered = filtered.filter((product) =>
        product.colors.some((color) => filters.color.includes(color))
      );
    }

    if (filters.size.length > 0) {
      filtered = filtered.filter((product) =>
        product.sizes.some((size) => filters.size.includes(size))
      );
    }

    if (filters.priceRange.length > 0) {
      filtered = filtered.filter((product) => {
        const price = product.priceValue;
        return filters.priceRange.some((range) => {
          switch (range) {
            case "Under $25":
              return price < 25;
            case "$25 - $50":
              return price >= 25 && price <= 50;
            case "$50 - $75":
              return price >= 50 && price <= 75;
            case "Over $75":
              return price > 75;
            default:
              return false;
          }
        });
      });
    }

    if (filters.availability.length > 0) {
      filtered = filtered.filter((product) => {
        if (filters.availability.includes("In Stock")) {
          return product.availableForSale;
        }
        if (filters.availability.includes("Out of Stock")) {
          return !product.availableForSale;
        }
        return true;
      });
    }

    switch (filters.sortBy) {
      case "Price Low To High":
        filtered.sort((a, b) => a.priceValue - b.priceValue);
        break;
      case "Price High To Low":
        filtered.sort((a, b) => b.priceValue - a.priceValue);
        break;
      case "A-Z":
        filtered.sort((a, b) => {
          const titleA = normalizeTitle(a.title);
          const titleB = normalizeTitle(b.title);
          return titleA.localeCompare(titleB);
        });

        break;
      case "Z-A":
        filtered.sort((a, b) => {
          const titleA = normalizeTitle(a.title);
          const titleB = normalizeTitle(b.title);
          return titleB.localeCompare(titleA);
        });
        break;
      default:
        break;
    }

    return filtered;
  }, [allProducts, filters, collections]);

  const handleApplyFilters = () => setIsFilterOpen(false);

  const getTabProducts = (): Product[] => {
    if (activeTab === "all") return filteredProducts;

    const matchedCollection = collections.find((c) => c.handle === activeTab);
    if (matchedCollection) {
      return filteredProducts.filter((p) =>
        matchedCollection.productHandles.includes(p.handle)
      );
    }

    return [];
  };

  const displayProducts = getTabProducts();

  const isFullyLoaded = !loading && filtersLoaded;

  return (
    <div>
      <Navbar />
      <div className="px-4 sm:px-6 md:px-8 lg:px-10 pt-6 pb-4 relative">
        {/* Header with title and filter button */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
          <h1 className="text-[32px] md:text-[48px] text-center md:text-start lg:text-[62px] text-[#1F1F1F] font-normal">
            View Our Collection
          </h1>

          {/* Filter button - hidden on mobile, shown as small button on tablet+ */}
          <Button
            onClick={() => setIsFilterOpen(true)}
            variant="link"
            size="default"
            className="hidden md:flex items-center gap-2 border !h-13 border-black  text-sm hover:bg-gray-50 transition-color"
          >
            <span>Sort & Filter</span>
            <BsFilterLeft size={16} />

            {getActiveFiltersCount() > 0 && (
              <span className="bg-[#EE9254] text-white text-xs rounded-full ml-1 w-5 h-5 flex items-center justify-center min-w-[20px]">
                {getActiveFiltersCount()}
              </span>
            )}
          </Button>
        </div>

        <p className="text-base md:text-lg lg:text-xl text-center md:text-start  font-inter text-[#1F1F1FB2] mb-6">
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
          <div className="flex items-center gap-2">
            {getActiveFiltersCount() > 0 && (
              <span className="bg-[#EE9254] text-white text-xs px-2 py-2 rounded-full">
                {getActiveFiltersCount()}
              </span>
            )}
            <BsFilterLeft size={20} />
          </div>
        </Button>
        <Filter
          isOpen={isFilterOpen}
          onOpenChange={setIsFilterOpen}
          filters={filters}
          onFiltersChange={setFilters}
          onApplyFilters={handleApplyFilters}
          collections={collections}
          allProducts={allProducts}
        />
      </div>

      <div className="px-4 sm:px-6 md:px-8 lg:px-10">
        {/* Results summary */}
        {isFullyLoaded && (
          <div className="mb-4 text-sm text-gray-600">
            Showing {displayProducts.length} of {allProducts.length} products
          </div>
        )}

        <Tabs
          defaultValue="all"
          className="w-full"
          onValueChange={(value) => {
            setActiveTab(value);
          }}
        >
          <TabsList className="flex overflow-x-auto text-[20px]  text-[#1F1F1FCC] sm:justify-center w-full gap-2 sm:gap-4 mb-6 p-1 bg-white rounded-lg scrollbar-hide">
            <TabsTrigger value="all" className="whitespace-nowrap">
              All ({allProducts.length})
            </TabsTrigger>
            {collections.map((collection) => (
              <TabsTrigger key={collection.handle} value={collection.handle}>
                {collection.title}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all">
            {!isFullyLoaded ? (
              <div className="flex justify-center items-center py-20">
                <AiOutlineLoading3Quarters className="w-8 h-8 animate-spin" />
                <span className="ml-2">
                  Loading products and availability...
                </span>
              </div>
            ) : error ? (
              <div className="text-center py-20 text-red-600">
                <p>Error: {error}</p>
                <p className="text-sm text-gray-600 mt-2">
                  Please try again later
                </p>
              </div>
            ) : displayProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-lg text-gray-600 mb-2">No products found</p>
                <p className="text-sm text-gray-500">
                  Try adjusting your filters
                </p>
                <Button
                  onClick={() => setFilters(initialFilterState)}
                  variant="link"
                  className="mt-4 text-[#E97451] hover:text-[#E97451]/80"
                >
                  Clear all filters
                </Button>
              </div>
            ) : (
              <ProductGrid products={displayProducts} />
            )}
          </TabsContent>

          {collections.map((collection) => (
            <TabsContent key={collection.handle} value={collection.handle}>
              {!isFullyLoaded ? (
                <div className="flex justify-center items-center py-20">
                  <AiOutlineLoading3Quarters className="w-8 h-8 animate-spin" />
                  <span className="ml-2">
                    Loading {collection.title} and availability...
                  </span>
                </div>
              ) : error ? (
                <div className="text-center py-20 text-red-600">
                  <p>Error: {error}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    Please try again later
                  </p>
                </div>
              ) : displayProducts.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-lg text-gray-600 mb-2">
                    No products found in {collection.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    Try adjusting your filters
                  </p>
                </div>
              ) : (
                <ProductGrid products={displayProducts} />
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Social Links Grid */}
      <SocialLinks />
      <Footer />
    </div>
  );
};

export default Products;
