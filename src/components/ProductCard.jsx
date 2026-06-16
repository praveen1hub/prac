import { Link } from 'react-router-dom'
import { Star, ShoppingCart } from 'lucide-react'

export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col group">
      {/* Image */}
      <Link to={`/product/${product.id}`} className="overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs font-medium text-brand-600 dark:text-brand-400 uppercase tracking-wide mb-1">
          {product.category}
        </span>

        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 hover:text-brand-600 dark:hover:text-brand-400 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 flex-1">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-2">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {product.rating}
          </span>
        </div>

        {/* Price + Add to cart */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={() => onAddToCart(product)}
            className="flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>
    </div>
  )
}
