import React from "react";
import Image from "next/image";
import { Heart } from "lucide-react";
import { MdOutlineShoppingBag } from "react-icons/md";
import { Button } from "../ui/button";

type Product = {
  id: string;
  title: string;
  category: string;
  price: string;
  imageUrl: string;
  handle: string;
};

interface ProductGridProps {
  products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  const extractShopifyId = (gid: string) => {
    const match = gid.match(/\/Product\/(\d+)/);
    return match ? match[1] : gid;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
      {products.map((product) => (
        <div key={product.id} className="group relative">
          <a
            href={`/products/${extractShopifyId(product.id)}`}
            className="block overflow-hidden rounded-xl shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden relative">
              <Image
                src={product.imageUrl}
                alt={product.title}
                width={500}
                height={500}
                className="h-full w-full object-cover object-center transform transition-transform duration-300 group-hover:scale-105"
              />
              {/* Overlay with icons */}
              <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex flex-row gap-2 sm:gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button
                  variant="link"
                  className="p-1.5 sm:p-2 bg-white/90 backdrop-blur-sm cursor-pointer hover:bg-white transition-colors shadow-md rounded-full"
                  onClick={(e) => {
                    e.preventDefault();
                    // Add wishlist functionality here
                  }}
                >
                  <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
                <Button
                  variant="link"
                  className="p-1.5 sm:p-2 bg-white/90 backdrop-blur-sm cursor-pointer hover:bg-white transition-colors shadow-md rounded-full"
                  onClick={(e) => {
                    e.preventDefault();
                    // Add to cart functionality here
                  }}
                >
                  <MdOutlineShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </div>
            </div>
            <div className="p-3 sm:p-4">
              <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate">
                {product.title}
              </h3>
              <p className="mt-1 text-sm sm:text-base font-medium text-gray-700">
                {product.price}
              </p>
              <p className="mt-1 text-xs sm:text-sm text-gray-500">
                {product.category}
              </p>
            </div>
          </a>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
