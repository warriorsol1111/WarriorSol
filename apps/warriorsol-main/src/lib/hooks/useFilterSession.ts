// hooks/useSessionFilters.ts
import { useState, useEffect } from "react";

export interface FilterState {
  sortBy: string;
  productType: string[];
  color: string[];
  size: string[];
  priceRange: string[];
  availability: string[];
}

export const initialFilterState: FilterState = {
  sortBy: "New In",
  productType: [],
  color: [],
  size: [],
  priceRange: [],
  availability: [],
};

const SESSION_STORAGE_KEY = "product_filters_session";

export const useSessionFilters = () => {
  const [filters, setFiltersState] = useState<FilterState>(initialFilterState);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load filters from sessionStorage on component mount
  useEffect(() => {
    const loadFilters = () => {
      try {
        if (typeof window === "undefined") return; // SSR check

        const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (stored) {
          const parsedFilters = JSON.parse(stored);
          // Validate the structure to prevent errors
          if (parsedFilters && typeof parsedFilters === "object") {
            setFiltersState({
              sortBy: parsedFilters.sortBy || initialFilterState.sortBy,
              productType: Array.isArray(parsedFilters.productType)
                ? parsedFilters.productType
                : [],
              color: Array.isArray(parsedFilters.color)
                ? parsedFilters.color
                : [],
              size: Array.isArray(parsedFilters.size) ? parsedFilters.size : [],
              priceRange: Array.isArray(parsedFilters.priceRange)
                ? parsedFilters.priceRange
                : [],
              availability: Array.isArray(parsedFilters.availability)
                ? parsedFilters.availability
                : [],
            });
          }
        }
      } catch (error) {
        console.error("Error loading filters from sessionStorage:", error);
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
      } finally {
        setIsLoaded(true);
      }
    };

    loadFilters();
  }, []);

  // Save filters to sessionStorage whenever filters change
  const setFilters = (newFilters: FilterState) => {
    setFiltersState(newFilters);

    try {
      if (typeof window === "undefined") return;

      // Check if filters are different from initial state
      const hasActiveFilters =
        newFilters.sortBy !== initialFilterState.sortBy ||
        newFilters.productType.length > 0 ||
        newFilters.color.length > 0 ||
        newFilters.size.length > 0 ||
        newFilters.priceRange.length > 0 ||
        newFilters.availability.length > 0;

      if (hasActiveFilters) {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newFilters));
      } else {
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
      }
    } catch (error) {
      console.error("Error saving filters to sessionStorage:", error);
    }
  };

  const clearSessionFilters = () => {
    try {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
      }
      setFiltersState(initialFilterState);
    } catch (error) {
      console.error("Error clearing session filters:", error);
    }
  };

  return {
    filters,
    setFilters,
    isLoaded,
    clearSessionFilters,
  };
};
