import React from "react";
import ProductCard from "./ProductCard";

const INR = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export default function SevenMStore({ products, onAddToCart, onOpenDetail, loading }) {
  return (
    <div className="container-center my-6">
      {/* Header Section */}
      <div className="rounded-3xl bg-gradient-to-r from-green-500 to-emerald-600 text-white p-8 mb-6 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold">SevenM Delivery Store</h1>
        <p className="mt-2 opacity-90">Products that will be delivered within 7 minutes</p>
        <p className="opacity-90">Fast delivery for your urgent needs</p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading 7m delivery products...</p>
        </div>
      )}

      {/* Products Grid */}
      {!loading && products.length === 0 ? (
        <div className="rounded-xl border dark:border-gray-800 p-6 text-center text-sm">
          ⚠️ No 7m delivery products available at the moment
        </div>
      ) : (
        <>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => (
              <ProductCard key={p._id || p.id} p={p} onAdd={onAddToCart} onOpen={onOpenDetail} />
            ))}
          </div>
          
          {/* Info Banner */}
          <div className="mt-8 rounded-xl bg-blue-50 dark:bg-blue-900/20 p-4 border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-blue-800 dark:text-blue-200">About 7m Delivery</h3>
            <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
              These products are available for ultra-fast delivery within 7 minutes. 
              Order now and enjoy lightning-fast service!
            </p>
          </div>
        </>
      )}
    </div>
  );
}