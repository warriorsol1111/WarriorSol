import React from "react";
import Image from "next/image";

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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <a
          key={product.id}
          href={`/product/${extractShopifyId(product.id)}`}
          className="group block overflow-hidden rounded-xl shadow-sm hover:shadow-lg transition-all duration-300"
        >
          <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
            <Image
              src={product.imageUrl}
              alt={product.title}
              width={500}
              height={500}
              className="h-full w-full object-cover transform transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="p-2 flex items-end justify-between">
            <div>
              <h3 className="text-base font-medium">{product.title}</h3>
              <p className="text-xs mt-1 ">{product.category}</p>
            </div>
            <p className="text-sm  mb-1">{product.price}</p>
          </div>
        </a>
      ))}
    </div>
  );
};

export default ProductGrid;
