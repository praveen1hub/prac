// components/Admin.jsx
import React, { useState, useEffect } from "react";

const INR = new Intl.NumberFormat("en-IN", { 
  style: "currency", 
  currency: "INR", 
  maximumFractionDigits: 0 
});

const API_BASE = "http://localhost:5000/api";

export default function Admin({ token, onLogout }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalBlogPosts: 0
  });

  // Fetch all data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchUsers(),
        fetchOrders(),
        fetchProducts(),
        fetchBlogPosts()
      ]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const usersData = await response.json();
        setUsers(usersData);
        setStats(prev => ({ ...prev, totalUsers: usersData.length }));
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const ordersData = await response.json();
        setOrders(ordersData);
        
        // Calculate total revenue
        const revenue = ordersData
          .filter(order => order.status === 'Delivered')
          .reduce((sum, order) => sum + (order.total || 0), 0);
        
        setStats(prev => ({ 
          ...prev, 
          totalOrders: ordersData.length,
          totalRevenue: revenue
        }));
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE}/products`);
      
      if (response.ok) {
        const productsData = await response.json();
        setProducts(productsData);
        setStats(prev => ({ ...prev, totalProducts: productsData.length }));
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const fetchBlogPosts = async () => {
    try {
      const response = await fetch(`${API_BASE}/blog`);
      
      if (response.ok) {
        const blogData = await response.json();
        setBlogPosts(blogData);
        setStats(prev => ({ ...prev, totalBlogPosts: blogData.length }));
      }
    } catch (error) {
      console.error("Failed to fetch blog posts:", error);
    }
  };

  const updateOrderStatus = async (orderId, status, cancellationReason = null) => {
    try {
      const bodyData = cancellationReason 
        ? { status, cancellationReason }
        : { status };

      const response = await fetch(`${API_BASE}/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bodyData)
      });

      if (response.ok) {
        // Refresh orders
        fetchOrders();
      } else {
        alert('Failed to update order status');
      }
    } catch (error) {
      console.error("Error updating order:", error);
      alert('Error updating order status');
    }
  };

  const deleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const response = await fetch(`${API_BASE}/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Refresh products
        fetchProducts();
        alert('Product deleted successfully');
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert('Error deleting product');
    }
  };

  const deleteBlogPost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;
    
    try {
      const response = await fetch(`${API_BASE}/admin/blog/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Refresh blog posts
        fetchBlogPosts();
        alert('Blog post deleted successfully');
      } else {
        alert('Failed to delete blog post');
      }
    } catch (error) {
      console.error("Error deleting blog post:", error);
      alert('Error deleting blog post');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="container-center py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container-center mt-6">
        <div className="flex border-b dark:border-gray-700 overflow-x-auto">
          {['dashboard', 'users', 'orders', 'products', 'blog'].map(tab => (
            <button
              key={tab}
              className={`px-6 py-3 font-medium capitalize ${activeTab === tab ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="container-center my-6">
        {activeTab === 'dashboard' && (
          <DashboardTab stats={stats} orders={orders} />
        )}

        {activeTab === 'users' && (
          <UsersTab users={users} />
        )}

        {activeTab === 'orders' && (
          <OrdersTab orders={orders} onUpdateStatus={updateOrderStatus} />
        )}

        {activeTab === 'products' && (
          <ProductsTab products={products} onDelete={deleteProduct} />
        )}

        {activeTab === 'blog' && (
          <BlogTab blogPosts={blogPosts} onDelete={deleteBlogPost} />
        )}
      </div>
    </div>
  );
}

// Dashboard Tab Component
function DashboardTab({ stats, orders }) {
  const recentOrders = orders.slice(0, 5);
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Overview</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
          <div className="text-3xl font-bold text-blue-600">{stats.totalUsers}</div>
          <div className="text-gray-600 dark:text-gray-400 mt-1">Total Users</div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
          <div className="text-3xl font-bold text-green-600">{stats.totalOrders}</div>
          <div className="text-gray-600 dark:text-gray-400 mt-1">Total Orders</div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
          <div className="text-3xl font-bold text-purple-600">{INR.format(stats.totalRevenue)}</div>
          <div className="text-gray-600 dark:text-gray-400 mt-1">Total Revenue</div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
          <div className="text-3xl font-bold text-yellow-600">{stats.totalProducts}</div>
          <div className="text-gray-600 dark:text-gray-400 mt-1">Products</div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
          <div className="text-3xl font-bold text-pink-600">{stats.totalBlogPosts}</div>
          <div className="text-gray-600 dark:text-gray-400 mt-1">Blog Posts</div>
        </div>
      </div>
      
      {/* Recent Orders */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Recent Orders</h3>
        
        {recentOrders.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="text-left py-2">Order ID</th>
                  <th className="text-left py-2">Date</th>
                  <th className="text-left py-2">Customer</th>
                  <th className="text-left py-2">Amount</th>
                  <th className="text-left py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order._id} className="border-b dark:border-gray-700">
                    <td className="py-3">#{order._id?.substring(0, 8) || order.id}</td>
                    <td className="py-3">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="py-3">User #{order.userId?.substring(0, 8)}</td>
                    <td className="py-3">{INR.format(order.total)}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Users Tab Component
function UsersTab({ users }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Users Management</h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 overflow-hidden">
        {users.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            No users found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  <th className="text-left p-4">Name</th>
                  <th className="text-left p-4">Email</th>
                  <th className="text-left p-4">Phone</th>
                  <th className="text-left p-4">Orders</th>
                  <th className="text-left p-4">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900">
                    <td className="p-4">{user.firstName} {user.lastName}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">{user.phone || '-'}</td>
                    <td className="p-4">{user.orders || 0}</td>
                    <td className="p-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Orders Tab Component with Cancellation Modal
function OrdersTab({ orders, onUpdateStatus }) {
  const [cancellationModal, setCancellationModal] = useState({ 
    isOpen: false, 
    orderId: null 
  });

  const handleCancelOrder = (orderId, cancellationReason) => {
    onUpdateStatus(orderId, 'Cancelled', cancellationReason);
    setCancellationModal({ isOpen: false, orderId: null });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Orders Management</h2>
      
      {/* Cancellation Modal */}
      <CancellationModal
        isOpen={cancellationModal.isOpen}
        onClose={() => setCancellationModal({ isOpen: false, orderId: null })}
        onConfirm={handleCancelOrder}
        orderId={cancellationModal.orderId}
      />

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            No orders found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  <th className="text-left p-4">Order ID</th>
                  <th className="text-left p-4">Date</th>
                  <th className="text-left p-4">Items</th>
                  <th className="text-left p-4">Amount</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Cancellation Reason</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900">
                    <td className="p-4">#{order._id?.substring(0, 8) || order.id}</td>
                    <td className="p-4">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="p-4">{order.items?.length || 0} items</td>
                    <td className="p-4">{INR.format(order.total)}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {order.status === 'Cancelled' && order.cancellationReason ? (
                        <div className="text-sm">
                          <div className="font-medium text-red-600">{order.cancellationReason.reason}</div>
                          {order.cancellationReason.comment && (
                            <div className="text-gray-500 mt-1">{order.cancellationReason.comment}</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      {order.status !== 'Cancelled' ? (
                        <button
                          onClick={() => setCancellationModal({ isOpen: true, orderId: order._id || order.id })}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 mr-2"
                        >
                          Cancel
                        </button>
                      ) : null}
                      
                      <select 
                        value={order.status} 
                        onChange={(e) => {
                          if (e.target.value === 'Cancelled') {
                            setCancellationModal({ isOpen: true, orderId: order._id || order.id });
                          } else {
                            onUpdateStatus(order._id || order.id, e.target.value);
                          }
                        }}
                        className="px-2 py-1 border rounded text-sm dark:bg-gray-800 dark:border-gray-700"
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Cancellation Modal Component
function CancellationModal({ isOpen, onClose, onConfirm, orderId }) {
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (!reason) {
      alert("Please select a cancellation reason");
      return;
    }
    
    onConfirm(orderId, { reason, comment });
    setReason("");
    setComment("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Cancel Order</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 dark:text-gray-300">Reason for cancellation</label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
          >
            <option value="">Select a reason</option>
            <option value="Out of Stock">Out of Stock</option>
            <option value="Customer Request">Customer Request</option>
            <option value="Delivery Issues">Delivery Issues</option>
            <option value="Payment Issues">Payment Issues</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 dark:text-gray-300">Additional comments</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
            rows="3"
            placeholder="Optional details about the cancellation"
          />
        </div>
        
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Confirm Cancellation
          </button>
        </div>
      </div>
    </div>
  );
}

// Products Tab Component
function ProductsTab({ products, onDelete }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Products Management</h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 overflow-hidden">
        {products.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            No products found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  <th className="text-left p-4">Product</th>
                  <th className="text-left p-4">Category</th>
                  <th className="text-left p-4">Price</th>
                  <th className="text-left p-4">Delivery</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product._id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={product.img} alt={product.name} className="w-10 h-10 object-cover rounded" />
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 capitalize">{product.category}</td>
                    <td className="p-4">{INR.format(product.price)}</td>
                    <td className="p-4">
                      {product.deliveryTime === "7m" ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">7-min</span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Standard</span>
                      )}
                    </td>
                    <td className="p-4">
                      <button 
                        onClick={() => onDelete(product._id)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Blog Tab Component
function BlogTab({ blogPosts, onDelete }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Blog Management</h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 overflow-hidden">
        {blogPosts.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            No blog posts found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  <th className="text-left p-4">Title</th>
                  <th className="text-left p-4">Author</th>
                  <th className="text-left p-4">Category</th>
                  <th className="text-left p-4">Date</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogPosts.map(post => (
                  <tr key={post._id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900">
                    <td className="p-4">
                      <div className="font-medium">{post.title}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                        {post.excerpt}
                      </div>
                    </td>
                    <td className="p-4">{post.author}</td>
                    <td className="p-4 capitalize">{post.category}</td>
                    <td className="p-4">{new Date(post.date).toLocaleDateString()}</td>
                    <td className="p-4">
                      <button 
                        onClick={() => onDelete(post._id)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function for status styling
const getStatusClass = (status) => {
  switch (status) {
    case 'Delivered':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'Processing':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'Cancelled':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case 'Shipped':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  }
};