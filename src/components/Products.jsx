// components/Products.jsx
import React, { useState } from "react";
import ProductCard from "./ProductCard";

export default function Products({ 
  onAdd, 
  onOpen, 
  productsData 
}) {
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showWishlist, setShowWishlist] = useState(false);
  const [wishlist, setWishlist] = useState([]);

  // Categories with icons
  const categories = [
    { id: "all", name: "All Products", icon: "🌟" },
    { id: "Mobiles", name: "Mobiles", icon: "📱" },
    { id: "Laptops", name: "Laptops", icon: "💻" },
    { id: "Gadgets", name: "Gadgets", icon: "⌚" }
  ];

  // Filter products based on active tab
  const filteredProducts = productsData.filter(product => {
    if (activeTab === "all") return true;
    return product.category === activeTab;
  });

  // Toggle wishlist
  const toggleWishlist = (product) => {
    const productId = product._id || product.id;
    
    if (wishlist.find(p => (p._id || p.id) === productId)) {
      setWishlist(wishlist.filter(p => (p._id || p.id) !== productId));
    } else {
      setWishlist([...wishlist, product]);
    }
  };

  // Quick actions panel
  const QuickActions = ({ product }) => {
    const productId = product._id || product.id;
    const isInWishlist = wishlist.find(p => (p._id || p.id) === productId);

    return (
      <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`p-2 rounded-full shadow-lg ${
            isInWishlist 
              ? "bg-white text-white" 
              : "bg-white text-gray-700"
          }`}
          title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          {isInWishlist ? "❤️" : "🤍"}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAdd(product);
          }}
          className="p-2 bg-white text-white rounded-full shadow-lg hover:bg-blue-600"
          title="Add to Cart"
        >
          🛒
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Floating Wishlist Button */}
      {wishlist.length > 0 && (
        <div className="fixed right-6 bottom-6 z-40">
          <button
            onClick={() => setShowWishlist(true)}
            className="p-3 bg-white text-red-700 rounded-full shadow-2xl hover:bg-red-100 transition-all flex items-center gap-2"
            title="Wishlist"
          >
            ❤️ <span className="text-sm">{wishlist.length}</span>
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="container-center py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Our Products
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Discover amazing tech products
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  activeTab === category.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex justify-center mt-4">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-1">
              {["grid", "masonry"].map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-4 py-2 rounded-full text-sm ${
                    viewMode === mode
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Products Display */}
      <div className="container-center py-8">
        {/* Grid View */}
        {viewMode === "grid" && (
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((p) => (
              <div key={p._id || p.id} className="group relative">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
                  <QuickActions product={p} />
                  <img
                    src={p.img}
                    alt={p.name}
                    className="w-full h-48 object-cover rounded-lg mb-3 cursor-pointer"
                    onClick={() => setSelectedProduct(p)}
                  />
                  <h3 className="font-semibold text-sm mb-1">{p.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-rose-500">
                      ₹{p.price.toLocaleString()}
                    </span>
                    {p.deliveryTime === "7m" && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        ⚡ 7m
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Masonry View */}
        {viewMode === "masonry" && (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
            {filteredProducts.map((p) => (
              <div key={p._id || p.id} className="break-inside-avoid mb-4 group relative">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
                  <QuickActions product={p} />
                  <img
                    src={p.img}
                    alt={p.name}
                    className="w-full h-auto object-cover rounded-lg mb-3 cursor-pointer"
                    onClick={() => setSelectedProduct(p)}
                  />
                  <h3 className="font-semibold text-sm mb-1">{p.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-rose-500">
                      ₹{p.price.toLocaleString()}
                    </span>
                    {p.deliveryTime === "7m" && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        ⚡ 7m
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">😢</div>
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try selecting a different category
            </p>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedProduct(null)} />
          <div className="relative bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
              <div className="grid md:grid-cols-2 gap-6">
                <img
                  src={selectedProduct.img}
                  alt={selectedProduct.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div>
                  <h2 className="text-2xl font-bold mb-3">{selectedProduct.name}</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {selectedProduct.description || selectedProduct.desc}
                  </p>
                  <div className="text-3xl font-bold text-rose-500 mb-4">
                    ₹{selectedProduct.price.toLocaleString()}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => onAdd(selectedProduct)}
                      className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => toggleWishlist(selectedProduct)}
                      className={`p-3 rounded-lg ${
                        wishlist.find(p => (p._id || p.id) === (selectedProduct._id || selectedProduct.id))
                          ? "bg-red-500 text-white"
                          : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    >
                      {wishlist.find(p => (p._id || p.id) === (selectedProduct._id || selectedProduct.id)) ? "❤️" : "🤍"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Wishlist Modal */}
      {showWishlist && wishlist.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowWishlist(false)} />
          <div className="relative bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Your Wishlist</h2>
                <button
                  onClick={() => setShowWishlist(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-3">
                {wishlist.map(product => (
                  <div key={product._id || product.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <img 
                      src={product.img} 
                      alt={product.name} 
                      className="w-12 h-12 object-cover rounded-lg" 
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{product.name}</h3>
                      <div className="text-md font-bold text-rose-500">
                        ₹{product.price.toLocaleString()}
                      </div>
                    </div>
                    <button
                      onClick={() => onAdd(product)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => toggleWishlist(product)}
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}