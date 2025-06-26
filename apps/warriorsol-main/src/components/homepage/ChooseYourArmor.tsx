import React from 'react';
import Image, { StaticImageData } from 'next/image';
import productImage from '@/assets/product-image.png'; // your static image
import { AiOutlineHeart, AiOutlineShoppingCart } from 'react-icons/ai';

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
    name: 'Amethyst Blazer',
    subtitle: 'Lux Blazer',
    image: productImage,
    price: 79,
    originalPrice: 129,
  },
  {
    id: 2,
    name: 'McLaren Cap',
    subtitle: 'Lux Blazer',
    image: productImage,
    price: 79,
    originalPrice: 129,
  },
  {
    id: 3,
    name: 'Amethyst Blazer',
    subtitle: 'Lux Blazer',
    image: productImage,
    price: 79,
    originalPrice: 129,
  },
  {
    id: 4,
    name: 'Amethyst Blazer',
    subtitle: 'Lux Blazer',
    image: productImage,
    price: 79,
    originalPrice: 129,
  },
  {
    id: 5,
    name: 'Amethyst Blazer',
    subtitle: 'Lux Blazer',
    image: productImage,
    price: 79,
    originalPrice: 129,
  },
  {
    id: 6,
    name: 'Amethyst Blazer',
    subtitle: 'Lux Blazer',
    image: productImage,
    price: 79,
    originalPrice: 129,
  },
];

const ChooseYourArmor: React.FC = () => {
  return (
    <section className="w-full px-12 py-16">
      {/* Heading */}
      <div className="flex justify-between items-start mb-12">
        <div>
          <h2 className="text-[62px] leading-[62px] font-['Cormorant_SC'] font-normal text-[#1F1F1F] capitalize">
            Choose Your Armor
          </h2>
          <p className="text-[20px] font-light font-['Inter'] text-[#1F1F1F]/70 capitalize">
            Every Collection Tells A Story. Find The One That Speaks To Your Journey.
          </p>
        </div>
        <button className="border border-black px-5 py-3 text-[20px] font-['Inter'] capitalize flex items-center gap-2 hover:bg-black hover:text-white transition">
          See All Products ↗
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {products.map((product) => (
          <div key={product.id} className="flex flex-col gap-3">
            {/* Image Card */}
            <div className="relative h-[534px] w-full">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 right-4 flex gap-2 text-black">
                <div className="w-10 h-10 bg-white flex items-center justify-center text-xl">
                  <AiOutlineHeart />
                </div>
                <div className="w-10 h-10 bg-white flex items-center justify-center text-xl">
                  <AiOutlineShoppingCart />
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="flex justify-between px-2">
              <div>
                <div className="text-[16px] font-['Cormorant'] font-medium text-[#1F1F1F]">
                  {product.name}
                </div>
                <div className="text-[12.5px] text-[#1E1E1E99] font-light font-['Inter']">
                  {product.subtitle}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[14px] font-['Cormorant'] font-medium text-[#1F1F1F]">
                  ${product.price.toFixed(2)}
                </div>
                <div className="text-[11px] font-['Inter'] text-[#1E1E1E99] line-through">
                  ${product.originalPrice?.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-12">
        <button className="w-10 h-10 border border-[#ccc] text-lg">&lt;</button>
        <button className="w-10 h-10 border border-[#ccc] text-lg">&gt;</button>
      </div>
    </section>
  );
};

export default ChooseYourArmor;
