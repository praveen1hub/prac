import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Star, ShoppingCart } from 'lucide-react'

export default function ProductDetail({ products, onAddToCart }) {
  const { id } = useParams()
  const product = products.find((p) => p.id === Number(id))

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-400">
        <p className="text-xl">Product not found.</p>
        <Link to="/" className="mt-4 inline-block text-brand-500 hover:underline">
          Back to shop
        </Link>
      </div>
    )
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-600 dark:hover:text-brand-400 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to shop
      </Link>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-80 md:h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <span className="text-sm font-medium text-brand-600 dark:text-brand-400 uppercase tracking-wide">
            {product.category}
          </span>
          <h1 className="text-3xl font-bold mt-2 text-gray-900 dark:text-gray-100">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-3">
            {[1,2,3,4,5].map((s) => (
              <Star
                key={s}
                className={`w-4 h-4 ${s <= Math.round(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
              />
            ))}
            <span className="text-sm text-gray-500 ml-1">{product.rating} out of 5</span>
          </div>

          <p className="mt-5 text-gray-600 dark:text-gray-400 leading-relaxed">
            {product.description}
          </p>

          <p className="text-4xl font-bold mt-6 text-gray-900 dark:text-gray-100">
            ${product.price.toFixed(2)}
          </p>

          <button
            onClick={() => onAddToCart(product)}
            className="mt-6 flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600
              text-white font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
          </button>
        </div>
      </div>
    </main>
  )
}
