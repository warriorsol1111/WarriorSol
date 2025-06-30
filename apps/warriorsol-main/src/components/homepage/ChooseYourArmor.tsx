"use client";
import React from "react";
import Image, { StaticImageData } from "next/image";
import productImage from "@/assets/product-image.png"; // your static image
import { AiOutlineHeart, AiOutlineShoppingCart } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface Product {
  id: number;
  name: string;
  subtitle: string;
  image: string | StaticImageData;
  price: number;
  originalPrice?: number;
}

const products: Product[] = [
  {
    id: 1,
    name: "Amethyst Blazer",
    subtitle: "Lux Blazer",
    image: productImage,
    price: 79,
    originalPrice: 129,
  },
  {
    id: 2,
    name: "McLaren Cap",
    subtitle: "Lux Blazer",
    image: productImage,
    price: 79,
    originalPrice: 129,
  },
  {
    id: 3,
    name: "Amethyst Blazer",
    subtitle: "Lux Blazer",
    image: productImage,
    price: 79,
    originalPrice: 129,
  },
  {
    id: 4,
    name: "Amethyst Blazer",
    subtitle: "Lux Blazer",
    image: productImage,
    price: 79,
    originalPrice: 129,
  },
  {
    id: 5,
    name: "Amethyst Blazer",
    subtitle: "Lux Blazer",
    image: productImage,
    price: 79,
    originalPrice: 129,
  },
  {
    id: 6,
    name: "Amethyst Blazer",
    subtitle: "Lux Blazer",
    image: productImage,
    price: 79,
    originalPrice: 129,
  },
];

const ChooseYourArmor: React.FC = () => {
  const router = useRouter();
  return (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 lg:py-16">
      {/* Heading */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-6 mb-8 sm:mb-12">
        <div>
          <h2 className="text-4xl sm:text-5xl lg:text-[62px] leading-tight lg:leading-[62px] font-['Cormorant_SC'] font-normal text-[#1F1F1F] capitalize">
            Choose Your Armor
          </h2>
          <p className="text-base sm:text-lg lg:text-[20px] font-light font-['Inter'] text-[#1F1F1F]/70 capitalize mt-2 sm:mt-0">
            Every Collection Tells A Story. Find The One That Speaks To Your
            Journey.
          </p>
        </div>
        <Button
          variant="outline"
          size="lg"
          onClick={() => router.push("/products")}
          className="w-full sm:w-auto border border-black px-4 sm:px-5 py-2.5 sm:py-3 text-base sm:text-lg lg:text-[20px] font-['Inter'] capitalize flex items-center justify-center sm:justify-start gap-2 hover:bg-black hover:text-white transition"
        >
          See All Products
        </Button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
        {products.map((product) => (
          <div key={product.id} className="flex flex-col gap-3">
            {/* Image Card */}
            <div className="relative w-full aspect-[3/4] sm:h-[400px] lg:h-[534px]">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
              <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex gap-2 text-black">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white flex items-center justify-center text-lg sm:text-xl">
                  <AiOutlineHeart />
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white flex items-center justify-center text-lg sm:text-xl">
                  <AiOutlineShoppingCart />
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="flex justify-between px-1 sm:px-2">
              <div>
                <div className="text-sm sm:text-base lg:text-[16px] font-['Cormorant'] font-medium text-[#1F1F1F]">
                  {product.name}
                </div>
                <div className="text-xs sm:text-[12.5px] text-[#1E1E1E99] font-light font-['Inter']">
                  {product.subtitle}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm sm:text-base lg:text-[14px] font-['Cormorant'] font-medium text-[#1F1F1F]">
                  ${product.price.toFixed(2)}
                </div>
                <div className="text-[10px] sm:text-[11px] font-['Inter'] text-[#1E1E1E99] line-through">
                  ${product.originalPrice?.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-3 sm:gap-4 mt-8 sm:mt-12">
        <Button
          variant="outline"
          size="lg"
          className="w-8 h-8 sm:w-10 sm:h-10 border border-[#ccc] text-base sm:text-lg"
        >
          &lt;
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="w-8 h-8 sm:w-10 sm:h-10 border border-[#ccc] text-base sm:text-lg"
        >
          &gt;
        </Button>
      </div>
    </section>
  );
};

export default ChooseYourArmor;
