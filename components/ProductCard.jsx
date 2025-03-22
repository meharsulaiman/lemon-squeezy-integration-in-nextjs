// components/ProductCard.jsx
import React from "react";
import Image from "next/image";

export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-md">
      <Image
        src={product.image}
        alt={product.name}
        width={400}
        height={300}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-2 h-12 overflow-hidden">
          {product.description}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">
            PKR{product.price.toFixed(2)}
          </span>
          <button
            onClick={() => onAddToCart(product.id)}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
