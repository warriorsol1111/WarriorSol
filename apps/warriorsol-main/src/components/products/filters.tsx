"use client";

import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerClose,
} from "../ui/drawer";
import { Button } from "../ui/button";
import { Check } from "lucide-react";

export interface FilterState {
  sortBy: string;
  productType: string[];
  color: string[];
  size: string[];
  priceRange: string[];
  gender: string[];
  availability: string[];
}

export const initialFilterState: FilterState = {
  sortBy: "New In",
  productType: [],
  color: [],
  size: [],
  priceRange: [],
  gender: [],
  availability: [],
};

interface Collection {
  id: string;
  title: string;
  handle: string;
  productHandles: string[];
}

interface Product {
  id: string;
  title: string;
  category: string;
  price: string;
  imageUrl: string;
  handle: string;
  availableForSale: boolean;
  variants: unknown[];
  colors: string[];
  sizes: string[];
  priceValue: number;
}

interface FilterProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onApplyFilters: () => void;
  collections: Collection[];
  allProducts: Product[];
}

const sortOptions = ["Price Low To High", "Price High To Low", "A-Z", "Z-A"];

const colors = [
  { name: "Black", value: "black", color: "#000000" },
  { name: "White", value: "white", color: "#FFFFFF" },
  { name: "Charcoal", value: "charcoal", color: "#36454F" },
  { name: "Grey", value: "grey", color: "#808080" },
  { name: "Cardinal", value: "cardinal", color: "#C41E3A" },
  { name: "Loden", value: "loden", color: "#6B8E23" },
  { name: "Red", value: "red", color: "#FF0000" },
  { name: "Blue", value: "blue", color: "#0000FF" },
];

const sizes = [
  "2XS",
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "2XL",
  "3XL",
  "4XL",
  "5XL",
  "6XL",
];

const priceRanges = ["Under $25", "$25 - $50", "$50 - $75", "Over $75"];
const availabilityOptions = ["In Stock", "Out of Stock"];
const genderOptions = ["Men", "Women", "Unisex"];

export const Filter: React.FC<FilterProps> = ({
  isOpen,
  onOpenChange,
  filters,
  onFiltersChange,
  onApplyFilters,
  collections,
}) => {
  const [tempFilters, setTempFilters] = useState<FilterState>(filters);

  useEffect(() => {
    if (isOpen) {
      setTempFilters(filters);
    }
  }, [isOpen, filters]);

  const toggleFilter = (category: keyof FilterState, value: string) => {
    if (category === "sortBy") {
      setTempFilters({ ...tempFilters, sortBy: value });
      return;
    }

    const currentFilters = tempFilters[category] as string[];
    const updatedFilters = currentFilters.includes(value)
      ? currentFilters.filter((item) => item !== value)
      : [...currentFilters, value];

    setTempFilters({ ...tempFilters, [category]: updatedFilters });
  };

  const handleClearFilters = () => {
    setTempFilters(initialFilterState);
  };

  const getActiveFiltersCount = () => {
    return (
      tempFilters.productType.length +
      tempFilters.color.length +
      tempFilters.size.length +
      tempFilters.priceRange.length +
      tempFilters.availability.length +
      (tempFilters.sortBy !== "New In" ? 1 : 0)
    );
  };

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="h-full">
        <DrawerHeader className="border-b border-gray-200">
          <div className="flex justify-between items-center">
            <DrawerTitle className="flex items-center text-[21px] md:text-[42px] text-[#1F1F1F] gap-2">
              Sort & Filter
              {getActiveFiltersCount() > 0 && (
                <span className="bg-[#EE9254] text-white text-xl pb-1 rounded-full leading-none w-6 h-6 flex items-center justify-center">
                  {getActiveFiltersCount()}
                </span>
              )}
            </DrawerTitle>
            <DrawerClose className="p-2 cursor-pointer">
              <IoClose size={24} />
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="px-6 py-4 space-y-6 overflow-y-auto flex-1">
          {/* Sort By */}
          <div>
            <h3 className="font-medium mb-3  text-xl text-[#1F1F1F]">
              Sort By
            </h3>
            <div className="flex flex-wrap gap-2">
              {sortOptions.map((option) => (
                <Button
                  size="lg"
                  variant="link"
                  key={option}
                  onClick={() => toggleFilter("sortBy", option)}
                  className={`px-4 py-2 text-[#1F1F1FCC] rounded-md text-lg   border transition-colors ${
                    tempFilters.sortBy === option
                      ? "bg-[#EE9254] text-white"
                      : "bg-white text-[#1F1F1FCC] "
                  }`}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>

          {/* Product Type */}
          <div>
            <h3 className="font-medium mb-3  text-xl text-[#1F1F1F]">
              Product Type
            </h3>
            <div className="flex flex-wrap gap-2">
              {collections.map((collection) => (
                <Button
                  size="lg"
                  variant="link"
                  key={collection.id}
                  onClick={() => toggleFilter("productType", collection.title)}
                  className={`px-4 py-2 rounded-md text-lg  border transition-colors ${
                    tempFilters.productType.includes(collection.title)
                      ? "bg-[#EE9254] text-white"
                      : "bg-white text-[#1F1F1FCC]"
                  }`}
                >
                  {collection.title}
                </Button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <h3 className="font-medium mb-3  text-xl text-[#1F1F1F]">Color</h3>

            <div className="flex flex-wrap gap-3">
              {colors.map((colorOption) => {
                const isSelected = tempFilters.color.includes(
                  colorOption.value
                );

                return (
                  <div
                    key={colorOption.value}
                    className="flex flex-col items-center gap-1 relative"
                  >
                    <Button
                      size="lg"
                      variant="link"
                      onClick={() => toggleFilter("color", colorOption.value)}
                      className={`w-[62px] h-[62px] rounded-full border-2 relative transition-all`}
                      style={{
                        backgroundColor: colorOption.color,
                        borderColor: isSelected ? "#EE9254" : "#d1d5db",
                      }}
                    >
                      {isSelected && (
                        <div className="absolute top-1 right-1 bg-green-500 rounded-full p-[2px] shadow-md">
                          <Check className="w-2 h-2 text-white font-bold stroke-[3]" />
                        </div>
                      )}
                    </Button>
                    <span
                      className={`text-xs ${
                        isSelected
                          ? "font-semibold text-[#EE9254]"
                          : "text-gray-600"
                      }`}
                    >
                      {colorOption.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Size */}
          <div>
            <h3 className="font-medium mb-3  text-xl text-[#1F1F1F]">Size</h3>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <Button
                  size="lg"
                  variant="link"
                  key={size}
                  onClick={() => toggleFilter("size", size)}
                  className={`px-4 py-2 rounded-md text-lg  border transition-colors  ${
                    tempFilters.size.includes(size)
                      ? "bg-[#EE9254] text-white"
                      : "bg-white text-[#1F1F1FCC]"
                  }`}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          {/* Gender */}
          <div>
            <h3 className="font-medium mb-3  text-xl text-[#1F1F1F]">Gender</h3>
            <div className="flex flex-wrap gap-2">
              {genderOptions.map((gender) => (
                <Button
                  size="lg"
                  variant="link"
                  key={gender}
                  onClick={() => toggleFilter("gender", gender)}
                  className={`px-4 py-2 rounded-md text-lg  border transition-colors  ${
                    tempFilters.gender.includes(gender)
                      ? "bg-[#EE9254] text-white"
                      : "bg-white text-[#1F1F1FCC]"
                  }`}
                >
                  {gender}
                </Button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="font-medium mb-3  text-xl text-[#1F1F1F]">
              Price Range
            </h3>
            <div className="flex flex-wrap gap-2">
              {priceRanges.map((range) => (
                <Button
                  size="lg"
                  variant="link"
                  key={range}
                  onClick={() => toggleFilter("priceRange", range)}
                  className={`px-4 py-2 rounded-md text-lg  border transition-colors ${
                    tempFilters.priceRange.includes(range)
                      ? "bg-[#EE9254] text-white"
                      : "bg-white text-[#1F1F1FCC]"
                  }`}
                >
                  {range}
                </Button>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div>
            <h3 className="font-medium mb-3  text-xl text-[#1F1F1F]">
              Availability
            </h3>
            <div className="flex gap-2">
              {availabilityOptions.map((option) => (
                <Button
                  size="lg"
                  variant="link"
                  key={option}
                  onClick={() => toggleFilter("availability", option)}
                  className={`px-4 py-2 rounded-md text-lg  border transition-colors ${
                    tempFilters.availability.includes(option)
                      ? "bg-[#EE9254] text-white"
                      : "bg-white text-[#1F1F1FCC]"
                  }`}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <DrawerFooter className="border-t border-gray-200">
          <div className="flex gap-4 flex-col sm:flex-row">
            <Button
              size="lg"
              onClick={() => {
                onFiltersChange(tempFilters);
                onApplyFilters();
              }}
              variant="link"
              className="flex-1 py-3 px-4 bg-[#EE9254] !text-[20px] text-white rounded-sm hover:bg-[#E97451]/90 transition-colors"
            >
              Apply Filters
            </Button>
            <Button
              size="lg"
              onClick={handleClearFilters}
              variant="link"
              className="flex-1 py-3 px-4 !text-[20px] rounded-sm border border-black hover:bg-gray-50 transition-colors"
              disabled={getActiveFiltersCount() === 0}
            >
              Clear All ({getActiveFiltersCount()})
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default Filter;
