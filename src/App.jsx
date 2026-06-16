// App.jsx (updated with proper admin authentication)
import React, { useMemo, useState, useEffect } from "react";
import Admin from "./components/Admin";
import AdminLogin from "./components/AdminLogin";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProductCard from "./components/ProductCard";
import Drawer from "./components/Drawer";
import Orders from "./components/Orders";
import Products from "./components/Products";
import Blog from "./components/Blog";
import Account from "./components/Account";
import Payment from "./components/Payment";
import SevenMStore from "./components/SevenMStore";
import Login from "./components/Login";

const INR = new Intl.NumberFormat("en-IN", { 
  style: "currency", 
  currency: "INR", 
  maximumFractionDigits: 0 
});

// API base URL
const API_BASE = "http://localhost:5000/api";

export default function App() {
  const [dark, setDark] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("new");
  const [sort, setSort] = useState("default");
  const [cartOpen, setCartOpen] = useState(false);
  const [detail, setDetail] = useState(null);
  const [cart, setCart] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [sevenMProducts, setSevenMProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sevenMLoading, setSevenMLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState("home");
  const [showPayment, setShowPayment] = useState(false);
  const [activeTab, setActiveTab] = useState("products");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  // Check if user is logged in on app load
  useEffect(() => {
    const savedToken = localStorage.getItem('ncart_token');
    const savedUser = localStorage.getItem('ncart_user');
    
    if (savedToken && savedUser) {
      const userData = JSON.parse(savedUser);
      setToken(savedToken);
      setUser(userData);
      setIsLoggedIn(true);
      
      // Check if user is admin
      if (userData.email === 'admin@ncart.com') {
        setIsAdmin(true);
      }
      
      fetchOrders(savedToken);
    }
  }, []);

  // Fetch all products from backend
  useEffect(() => {
    fetch(`${API_BASE}/products`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then(data => {
        setProductsData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Failed to fetch products:", error);
        setProductsData([]);
        setLoading(false);
      });
  }, []);

  // Fetch 7m products from backend
  useEffect(() => {
    fetch(`${API_BASE}/products/7m`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then(data => {
        setSevenMProducts(data);
        setSevenMLoading(false);
      })
      .catch(error => {
        console.error("Failed to fetch 7m products:", error);
        setSevenMProducts([]);
        setSevenMLoading(false);
      });
  }, []);
  

  // Fetch orders from backend if logged in
  const fetchOrders = async (authToken) => {
    try {
      const response = await fetch(`${API_BASE}/orders`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (response.ok) {
        const ordersData = await response.json();
        setOrders(ordersData);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  const totalCount = cart.reduce((a, c) => a + c.qty, 0);
  const totalPrice = cart.reduce((a, c) => a + c.qty * c.price, 0);

  const products = useMemo(() => {
    let list = productsData.slice();

    // Filter by category - handled by Products.jsx now
    if (category !== "all") {
      list = list.filter((p) => p.category === category);
    }

    // Search
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((p) => (p.name + " " + (p.description || p.desc || '')).toLowerCase().includes(q));
    }

    // Sort by price
    if (sort === "asc") list.sort((a, b) => a.price - b.price);
    if (sort === "desc") list.sort((a, b) => b.price - a.price);

    return list;
  }, [productsData, query, category, sort]);

  function addToCart(p) {
    setCart((prev) => {
      const productId = p._id || p.id;
      const idx = prev.findIndex((x) => x.id == productId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1 };
        return copy;
      }
      return [...prev, { 
        id: productId, 
        name: p.name, 
        price: p.price, 
        qty: 1, 
        image: p.img 
      }];
    });
  }

  function changeQty(id, d) {
    setCart((prev) =>
      prev
        .map((x) => (x.id === id ? { ...x, qty: Math.max(1, x.qty + d) } : x))
        .filter((x) => x.qty > 0)
    );
  }

  function removeItem(id) {
    setCart((prev) => prev.filter((x) => x.id !== id));
  }

  // Handle login
  const handleLogin = async (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    setIsLoggedIn(true);
    localStorage.setItem('ncart_token', authToken);
    localStorage.setItem('ncart_user', JSON.stringify(userData));
    
    // Check if user is admin
    if (userData.email === 'admin@ncart.com') {
      setIsAdmin(true);
      setCurrentPage("admin");
    } else {
      setIsAdmin(false);
      setCurrentPage("home");
    }
    
    // Fetch orders after login
    await fetchOrders(authToken);
  };

  // Handle admin login
  const handleAdminLogin = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    setIsLoggedIn(true);
    setIsAdmin(true);
    localStorage.setItem('ncart_token', authToken);
    localStorage.setItem('ncart_user', JSON.stringify(userData));
    setCurrentPage("admin");
    setShowAdminLogin(false);
  };

  // Handle logout
  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setIsLoggedIn(false);
    setIsAdmin(false);
    localStorage.removeItem('ncart_token');
    localStorage.removeItem('ncart_user');
    setOrders([]);
    setCurrentPage("home");
  };

  // Update user profile
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('ncart_user', JSON.stringify(updatedUser));
  };

  function handleCheckout() {
    if (cart.length === 0) return;
    if (!isLoggedIn) {
      setCartOpen(false);
      setCurrentPage("login");
      alert("Please login to complete your purchase");
      return;
    }
    setShowPayment(true);
  }

  async function handlePaymentSuccess(paymentMethod) {
    try {
      const newOrder = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        items: [...cart],
        total: totalPrice,
        status: "Processing",
        tracking: {
          status: "Processing",
          steps: [
            { name: "Order Placed", completed: true, date: new Date().toISOString() },
            { name: "Processing", completed: false, date: null },
            { name: "Shipped", completed: false, date: null },
            { name: "Out for Delivery", completed: false, date: null },
            { name: "Delivered", completed: false, date: null }
          ]
        },
        paymentMethod,
        address: user?.address || "123 Main St, City, Country"
      };

      const response = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newOrder)
      });

      if (response.ok) {
        const savedOrder = await response.json();
        const updatedOrders = [savedOrder, ...orders];
        setOrders(updatedOrders);
        
        // Update user order count
        const updatedUser = {
          ...user,
          orders: user.orders ? user.orders + 1 : 1
        };
        updateUser(updatedUser);
        
        setCart([]);
        setCartOpen(false);
        setShowPayment(false);
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("There was an error processing your order. Please try again.");
    }
  }

  async function updateOrderStatus(orderId, status, cancellationReason = null) {
    try {
      const orderToUpdate = orders.find(order => order._id === orderId || order.id === orderId);
      if (!orderToUpdate) return;

      const updatedSteps = orderToUpdate.tracking.steps.map(step => {
        if (step.name === status) {
          return { ...step, completed: true, date: new Date().toISOString() };
        }
        return step;
      });

      const requestBody = {
        status,
        tracking: { ...orderToUpdate.tracking, status, steps: updatedSteps }
      };

      // Add cancellation reason if provided
      if (status === 'Cancelled' && cancellationReason) {
        requestBody.cancellationReason = cancellationReason;
      }

      const response = await fetch(`${API_BASE}/orders/${orderToUpdate._id || orderToUpdate.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const savedOrder = await response.json();
        const updatedOrders = orders.map(order => 
          (order._id === savedOrder._id || order.id === savedOrder.id) ? savedOrder : order
        );
        
        setOrders(updatedOrders);
      } else {
        throw new Error('Failed to update order');
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  }

  function generateInvoice(order) {
    // Invoice generation code remains the same
    const invoiceWindow = window.open("", "_blank");
    invoiceWindow.document.write(`
      <html>
        <head>
          <title>Invoice #${order.id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            .details { display: flex; justify-content: space-between; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .total { text-align: right; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>NCart Invoice</h1>
            <p>Invoice #${order.id}</p>
            <p>Date: ${new Date(order.date).toLocaleDateString()}</p>
          </div>
          <div class="details">
            <div>
              <h3>Shipping Address:</h3>
              <p>${user?.name || 'Customer'}</p>
              <p>${user?.address || '123 Main St, City, Country'}</p>
            </div>
            <div>
              <h3>Payment Method:</h3>
              <p>${order.paymentMethod}</p>
              <p>Status: ${order.status}</p>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.qty}</td>
                  <td>${INR.format(item.price)}</td>
                  <td>${INR.format(item.price * item.qty)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="total">
            <p>Total Amount: ${INR.format(order.total)}</p>
          </div>
          <div style="margin-top: 40px; text-align: center;">
            <p>Thank you for shopping with NCart!</p>
          </div>
        </body>
      </html>
    `);
    invoiceWindow.document.close();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        <Header 
          dark={dark} 
          setDark={setDark} 
          query={query} 
          setQuery={setQuery} 
          cartOpen={cartOpen} 
          setCartOpen={setCartOpen} 
          totalCount={totalCount}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          user={user}
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
          isAdmin={isAdmin}
          onAdminLogin={() => setShowAdminLogin(true)}
        />

        {showAdminLogin ? (
          <AdminLogin 
            onAdminLogin={handleAdminLogin} 
            setCurrentPage={setCurrentPage}
            onClose={() => setShowAdminLogin(false)}
          />
        ) : currentPage === "admin" && isAdmin ? (
          <Admin token={token} onLogout={handleLogout} />
        ) : currentPage === "account" && isLoggedIn ? (
          <Account 
            user={user} 
            setUser={updateUser} 
            orders={orders}
            onGenerateInvoice={generateInvoice}
            onUpdateStatus={updateOrderStatus}
            onLogout={handleLogout}
            token={token}
          />
        ) : currentPage === "login" ? (
          <Login onLogin={handleLogin} setCurrentPage={setCurrentPage} />
        ) : currentPage === "blog" ? (
          <Blog />
        ) : currentPage === "orders" && isLoggedIn ? (
          <Orders 
            orders={orders} 
            onGenerateInvoice={generateInvoice}
            onUpdateStatus={updateOrderStatus}
          />
        ) : currentPage === "products" ? (
          <Products 
            onAdd={addToCart}
            onOpen={setDetail}
            query={query}
            setQuery={setQuery}
            category={category}
            setCategory={setCategory}
            sort={sort}
            setSort={setSort}
            productsData={productsData}
          />
        ) : (
          <>
            {/* Tabs for Products and 7m Store - Only show when on home page */}
            {isLoggedIn && currentPage === "home" && (
              <section className="container-center mt-6">
                <div className="flex border-b dark:border-gray-800">
                  <button 
                    className={`px-4 py-2 font-medium ${activeTab === 'products' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
                    onClick={() => setActiveTab('products')}
                  >
                    Products
                  </button>
                  <button 
                    className={`px-4 py-2 font-medium ${activeTab === 'sevenMStore' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
                    onClick={() => setActiveTab('sevenMStore')}
                  >
                    SevenMStore
                  </button>
                </div>
              </section>
            )}

            {!isLoggedIn ? (
              // Show hero section for non-logged in users
              <div className="container-center mt-6">
                <div className="rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-8 relative overflow-hidden text-center">
                  <h3 className="text-sm uppercase tracking-wider font-semibold">Ncart</h3>
                  <h1 className="text-3xl md:text-5xl font-extrabold mt-1">Welcome to Ncart</h1>
                  <p className="mt-2 opacity-90">Shop the latest technology available here in Ncart.</p>
                  <p className="opacity-90">Best deals and discounts every day.</p>
                  <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                      onClick={() => setCurrentPage("login")} 
                      className="px-6 py-3 rounded-xl bg-white text-gray-900 font-semibold hover:opacity-90"
                    >
                      Login / Sign Up
                    </button>
                    <button 
                      onClick={() => {
                        setCurrentPage("products");
                      }} 
                      className="px-6 py-3 rounded-xl bg-transparent border border-white text-white font-semibold hover:bg-white hover:text-gray-900"
                    >
                      Browse Products
                    </button>
                  </div>
                </div>
                
                {/* Show some featured products */}
                <div className="my-8">
                  <h2 className="text-2xl font-bold mb-6 text-center">Featured Products</h2>
                  {products.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {products.slice(0, 4).map((p) => (
                        <ProductCard key={p._id || p.id} p={p} onAdd={addToCart} onOpen={setDetail} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : activeTab === 'products' ? (
              <>
                {/* Hero Banner */}
                <section className="container-center mt-6">
                  <div className="rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-8 relative overflow-hidden">
                    <h3 className="text-sm uppercase tracking-wider font-semibold">Ncart</h3>
                    <h1 className="text-3xl md:text-5xl font-extrabold mt-1">Still Thinking?</h1>
                    <p className="mt-2 opacity-90">Shop the latest technology available here in Ncart.</p>
                    <p className="opacity-90">Best deals and discounts every day.</p>
                    <button className="mt-4 px-4 py-2 rounded-xl bg-white text-gray-900 font-semibold hover:opacity-90">Shop Now</button>
                  </div>
                </section>

                {/* Controls */}
                <section className="container-center mt-6">
                  <div className="flex flex-col md:flex-row items-stretch gap-3">
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-xl border dark:border-gray-800 px-3 py-2 bg-white dark:bg-gray-900">
                      <option value="new">New Launches</option>
                      <option value="Mobiles">Mobiles</option>
                      <option value="Laptops">Laptops</option>
                      <option value="Gadgets">Gadgets</option>
                      <option value="all">All Categories</option>
                    </select>
                    <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-xl border dark:border-gray-800 px-3 py-2 bg-white dark:bg-gray-900">
                      <option value="default">Sort by Price</option>
                      <option value="asc">Low to High</option>
                      <option value="desc">High to Low</option>
                    </select>
                  </div>
                </section>

                {/* Products */}
                <main className="container-center my-6">
                  {products.length === 0 ? (
                    <div className="rounded-xl border dark:border-gray-800 p-6 text-center text-sm">
                      ⚠️ No matching products
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {products.map((p) => (
                        <ProductCard key={p._id || p.id} p={p} onAdd={addToCart} onOpen={setDetail} />
                      ))}
                    </div>
                  )}
                </main>
              </>
            ) : (
              <SevenMStore 
                products={sevenMProducts} 
                onAddToCart={addToCart}
                onOpenDetail={setDetail}
                loading={sevenMLoading}
              />
            )}
          </>
        )}

        <Footer />

        {/* Product Detail Modal */}
        {detail && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/50" onClick={() => setDetail(null)} />
            <div className="absolute left-1/2 top-1/2 w-[92%] max-w-2xl -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 rounded-2xl overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <img src={detail.img} alt={detail.name} className="w-full md:w-1/2 h-64 object-cover" />
                <div className="p-5 md:w-1/2">
                  <h3 className="text-xl font-bold">{detail.name}</h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{detail.description || detail.desc || ''}</p>
                  <div className="mt-3 text-2xl font-extrabold text-rose-500">{INR.format(detail.price)}</div>
                  {detail.deliveryTime === "7m" && (
                    <div className="mt-2 text-sm text-green-600 font-semibold">7-minute delivery available</div>
                  )}
                  <div className="mt-4 flex gap-2">
                    <button onClick={() => { addToCart(detail); setDetail(null); }} className="px-4 py-2 rounded-xl bg-blue-600 text-white">Add to Cart</button>
                    <button onClick={() => setDetail(null)} className="px-4 py-2 rounded-xl border dark:border-gray-800">Close</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cart Drawer */}
        <Drawer open={cartOpen} onClose={() => setCartOpen(false)} title="Your Cart">
          {cart.length === 0 ? (
            <p className="text-sm">Your cart is empty.</p>
          ) : (
            <div className="flex flex-col gap-3 h-full">
              <div className="flex-grow overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 rounded-xl border dark:border-gray-800 p-3 mb-3">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                    <div className="flex-grow">
                      <div className="font-semibold text-sm">{item.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{INR.format(item.price)} each</div>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => changeQty(item.id, -1)} className="px-2 py-1 rounded-lg border dark:border-gray-800">-</button>
                        <div className="w-8 text-center">{item.qty}</div>
                        <button onClick={() => changeQty(item.id, +1)} className="px-2 py-1 rounded-lg border dark:border-gray-800">+</button>
                        <button onClick={() => removeItem(item.id)} className="ml-auto text-red-500 text-sm">Remove</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t dark:border-gray-800 pt-3">
                <div className="flex justify-between font-bold">
                  <div>Total:</div>
                  <div>{INR.format(totalPrice)}</div>
                </div>
                <button onClick={handleCheckout} className="w-full mt-3 px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold">
                  Checkout
                </button>
              </div>
            </div>
          )}
        </Drawer>

        {/* Payment Modal */}
        {showPayment && (
          <Payment 
            total={totalPrice} 
            onClose={() => setShowPayment(false)} 
            onSuccess={handlePaymentSuccess} 
          />
        )}
      </div>
    </div>
  );
}