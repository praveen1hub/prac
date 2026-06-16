import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import CartDrawer from './components/CartDrawer'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'

// ── Seed data ────────────────────────────────────────────────────────────────
export const initialProducts = [
  {
    id: 1,
    name: 'Wireless Headphones',
    category: 'Electronics',
    price: 79.99,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
    description: 'Premium sound quality with active noise cancellation and 30-hour battery life.',
  },
  {
    id: 2,
    name: 'Running Sneakers',
    category: 'Footwear',
    price: 119.99,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
    description: 'Lightweight and breathable, designed for long-distance comfort.',
  },
  {
    id: 3,
    name: 'Leather Backpack',
    category: 'Bags',
    price: 89.99,
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80',
    description: 'Genuine leather with laptop sleeve and multiple pockets.',
  },
  {
    id: 4,
    name: 'Smart Watch',
    category: 'Electronics',
    price: 199.99,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
    description: 'Track fitness, notifications, and more from your wrist.',
  },
  {
    id: 5,
    name: 'Sunglasses',
    category: 'Accessories',
    price: 49.99,
    rating: 4.2,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80',
    description: 'UV400 polarised lenses in a classic aviator frame.',
  },
  {
    id: 6,
    name: 'Yoga Mat',
    category: 'Sports',
    price: 34.99,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1601925228500-68f75f400625?w=400&q=80',
    description: 'Non-slip, eco-friendly TPE material. 6mm cushioning.',
  },
  {
    id: 7,
    name: 'Coffee Maker',
    category: 'Kitchen',
    price: 59.99,
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&q=80',
    description: '12-cup programmable drip coffee maker with thermal carafe.',
  },
  {
    id: 8,
    name: 'Desk Lamp',
    category: 'Home',
    price: 29.99,
    rating: 4.1,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80',
    description: 'LED desk lamp with adjustable brightness and USB charging port.',
  },
]

export default function App() {
  const [darkMode, setDarkMode]   = useState(false)
  const [cart, setCart]           = useState([])
  const [cartOpen, setCartOpen]   = useState(false)

  // ── Cart helpers ──────────────────────────────────────────────────────────
  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.id === product.id)
      if (exists) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        )
      }
      return [...prev, { ...product, qty: 1 }]
    })
    setCartOpen(true)
  }

  const removeFromCart = (id) =>
    setCart((prev) => prev.filter((i) => i.id !== id))

  const updateQty = (id, qty) => {
    if (qty < 1) return removeFromCart(id)
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)))
  }

  const cartCount = cart.reduce((s, i) => s + i.qty, 0)

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <Navbar
          darkMode={darkMode}
          toggleDark={() => setDarkMode((d) => !d)}
          cartCount={cartCount}
          onCartOpen={() => setCartOpen(true)}
        />

        <Routes>
          <Route
            path="/*"
            element={
              <Home products={initialProducts} onAddToCart={addToCart} />
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProductDetail
                products={initialProducts}
                onAddToCart={addToCart}
              />
            }
          />
        </Routes>

        <CartDrawer
          open={cartOpen}
          onClose={() => setCartOpen(false)}
          cart={cart}
          onRemove={removeFromCart}
          onUpdateQty={updateQty}
        />
      </div>
    </div>
  )
}
