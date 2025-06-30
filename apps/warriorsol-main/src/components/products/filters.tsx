"use client";

import React from "react";
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

export interface FilterState {
  sortBy: string;
  productType: string[];
  color: string[];
  size: string[];
  gender: string[];
  collection: string[];
}

export const initialFilterState: FilterState = {
  sortBy: "New In",
  productType: [],
  color: [],
  size: [],
  gender: [],
  collection: [],
};

interface FilterProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onApplyFilters: () => void;
}

const sortOptions = [
  "New In",
  "Trending",
  "Price Low To High",
  "Price High To Low",
];
const productTypes = ["Shirts", "Caps", "Hoodies", "Cancer Wear"];
const colors = ["brown", "coral", "beige", "black"];
const sizes = ["XXS", "XS", "S", "M", "L", "XL", "XXL"];
const genders = ["Men", "Women"];
const collections = ["Warriors Collection"];

export const Filter: React.FC<FilterProps> = ({
  isOpen,
  onOpenChange,
  filters,
  onFiltersChange,
  onApplyFilters,
}) => {
  const toggleFilter = (category: keyof FilterState, value: string) => {
    if (category === "sortBy") {
      onFiltersChange({ ...filters, sortBy: value });
      return;
    }

    const currentFilters = filters[category] as string[];
    const updatedFilters = currentFilters.includes(value)
      ? currentFilters.filter((item) => item !== value)
      : [...currentFilters, value];

    onFiltersChange({ ...filters, [category]: updatedFilters });
  };

  const handleClearFilters = () => {
    onFiltersChange(initialFilterState);
  };

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="h-full">
        <DrawerHeader className="border-b border-gray-200">
          <div className="flex justify-between items-center">
            <DrawerTitle>Sort & Filter</DrawerTitle>
            <DrawerClose className="p-2">
              <IoClose size={24} />
            </DrawerClose>
          </div>
        </DrawerHeader>
        <div className="px-6 py-4 space-y-6 overflow-y-auto flex-1">
          <div>
            <h3 className="font-medium mb-3">Sort By</h3>
            <div className="flex flex-wrap gap-2">
              {sortOptions.map((option) => (
                <Button
                  size="lg"
                  variant="link"
                  key={option}
                  onClick={() => toggleFilter("sortBy", option)}
                  className={`px-4 py-2 rounded-full border ${
                    filters.sortBy === option
                      ? "bg-black text-white"
                      : "bg-white text-black"
                  }`}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Product Type</h3>
            <div className="flex flex-wrap gap-2">
              {productTypes.map((type) => (
                <Button
                  size="lg"
                  variant="link"
                  key={type}
                  onClick={() => toggleFilter("productType", type)}
                  className={`px-4 py-2 rounded-full border ${
                    filters.productType.includes(type)
                      ? "bg-black text-white"
                      : "bg-white text-black"
                  }`}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Color</h3>
            <div className="flex gap-2">
              {colors.map((color) => (
                <Button
                  size="lg"
                  variant="link"
                  key={color}
                  onClick={() => toggleFilter("color", color)}
                  className={`w-12 h-12 rounded-full border ${
                    filters.color.includes(color) ? "ring-2 ring-black" : ""
                  }`}
                  style={{ backgroundColor: color }}
                ></Button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Size</h3>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <Button
                  size="lg"
                  variant="link"
                  key={size}
                  onClick={() => toggleFilter("size", size)}
                  className={`px-4 py-2 rounded-full border ${
                    filters.size.includes(size)
                      ? "bg-black text-white"
                      : "bg-white text-black"
                  }`}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Gender</h3>
            <div className="flex gap-2">
              {genders.map((gender) => (
                <Button
                  size="lg"
                  variant="link"
                  key={gender}
                  onClick={() => toggleFilter("gender", gender)}
                  className={`px-4 py-2 rounded-full border ${
                    filters.gender.includes(gender)
                      ? "bg-black text-white"
                      : "bg-white text-black"
                  }`}
                >
                  {gender}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Warrior Corner</h3>
            <div className="flex gap-2">
              {collections.map((collection) => (
                <Button
                  size="lg"
                  variant="link"
                  key={collection}
                  onClick={() => toggleFilter("collection", collection)}
                  className={`px-4 py-2 rounded-full border ${
                    filters.collection.includes(collection)
                      ? "bg-black text-white"
                      : "bg-white text-black"
                  }`}
                >
                  {collection}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <DrawerFooter className="border-t border-gray-200">
          <div className="flex gap-4">
            <Button
              size="lg"
              onClick={handleClearFilters}
              variant="link"
              className="flex-1 py-3 px-4 border rounded-lg hover:bg-gray-50"
            >
              Clear Filter
            </Button>
            <Button
              size="lg"
              onClick={onApplyFilters}
              variant="link"
              className="flex-1 py-3 px-4 bg-[#E97451] text-white rounded-lg hover:bg-[#E97451]/90"
            >
              Apply Filters
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default Filter;
