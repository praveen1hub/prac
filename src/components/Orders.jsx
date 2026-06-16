import React, { useState } from 'react';
import CancellationModal from './CancellationModal'; // Add this import

// INR formatter
const INR = new Intl.NumberFormat("en-IN", { 
  style: "currency", 
  currency: "INR", 
  maximumFractionDigits: 0 
});

export default function Orders({ orders, onGenerateInvoice, onUpdateStatus }) {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [cancellationModal, setCancellationModal] = useState({ 
    isOpen: false, 
    orderId: null 
  });

  const toggleOrder = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Shipped': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Processing': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  // Format date safely
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' • ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const handleCancelOrder = (orderId, cancellationReason) => {
    onUpdateStatus(orderId, 'Cancelled', cancellationReason);
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="container-center my-6">
        <div className="rounded-xl border dark:border-gray-800 p-8 text-center">
          <h2 className="text-xl font-bold mb-2">No Orders Yet</h2>
          <p className="text-gray-600 dark:text-gray-400">Your orders will appear here once you make a purchase.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-center my-6">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      
      {/* Cancellation Modal */}
      <CancellationModal
        isOpen={cancellationModal.isOpen}
        onClose={() => setCancellationModal({ isOpen: false, orderId: null })}
        onConfirm={handleCancelOrder}
        orderId={cancellationModal.orderId}
      />

      <div className="space-y-4">
        {orders.map(order => (
          <div key={order._id || order.id} className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border dark:border-gray-800">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
              <div>
                <h3 className="font-semibold">Order #{order._id || order.id}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(order.date)}
                </p>
              </div>
              <div className="flex items-center gap-3 self-end sm:self-auto">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
                <button 
                  onClick={() => onGenerateInvoice(order)}
                  className="px-3 py-1 rounded-xl border dark:border-gray-800 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Invoice
                </button>
                <button 
                  onClick={() => toggleOrder(order._id || order.id)}
                  className="p-2 rounded-lg border dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {expandedOrder === (order._id || order.id) ? '▲' : '▼'}
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mb-4">
              <div className="text-sm">
                <span className="font-medium">Total:</span> {INR.format(order.total || 0)}
              </div>
              <div className="text-sm">
                <span className="font-medium">Payment:</span> {order.paymentMethod || 'Not specified'}
              </div>
            </div>

            {expandedOrder === (order._id || order.id) && (
              <div className="mt-4 pt-4 border-t dark:border-gray-800">
                <h4 className="font-medium mb-3">Items</h4>
                <div className="space-y-3 mb-4">
                  {order.items && order.items.length > 0 ? (
                    order.items.map(item => (
                      <div key={item.id} className="flex items-center gap-3">
                        {item.image && (
                          <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                        )}
                        <div className="flex-grow">
                          <div className="font-medium text-sm">{item.name || 'Unnamed Item'}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {INR.format(item.price || 0)} × {item.qty || 0}
                          </div>
                        </div>
                        <div className="font-medium">{INR.format((item.price || 0) * (item.qty || 0))}</div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No items in this order</p>
                  )}
                </div>

                {order.tracking && (
                  <>
                    <h4 className="font-medium mb-3">Tracking</h4>
                    <div className="mb-4">
                      <div className="flex justify-between mb-2 relative">
                        {order.tracking.steps && order.tracking.steps.map((step, index) => (
                          <div key={index} className={`text-center flex-1 ${index < order.tracking.steps.length - 1 ? 'relative' : ''}`}>
                            <div className={`w-6 h-6 rounded-full mx-auto flex items-center justify-center ${
                              step.completed 
                                ? 'bg-green-500 text-white' 
                                : 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                            }`}>
                              {index + 1}
                            </div>
                            <div className="text-xs mt-1 truncate">{step.name}</div>
                            {step.date && (
                              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                {new Date(step.date).toLocaleDateString()}
                              </div>
                            )}
                            {index < order.tracking.steps.length - 1 && (
                              <div className={`absolute top-3 left-1/2 w-full h-0.5 ${
                                step.completed ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'
                              }`} style={{ transform: 'translateX(50%)' }}></div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {order.address && (
                  <>
                    <h4 className="font-medium mb-2">Shipping Address</h4>
                    <p className="text-sm mb-4">{order.address}</p>
                  </>
                )}

                {/* Show cancellation reason if order is cancelled */}
                {order.status === 'Cancelled' && order.cancellationReason && (
                  <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <h4 className="font-medium text-red-800 dark:text-red-200">Cancellation Reason:</h4>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      {order.cancellationReason.reason}
                    </p>
                    {order.cancellationReason.comment && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                        <strong>Comment:</strong> {order.cancellationReason.comment}
                      </p>
                    )}
                    <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                      Cancelled on: {new Date(order.cancellationReason.cancelledAt).toLocaleString()}
                    </p>
                  </div>
                )}

                {/* Only show Cancel button for orders that can be cancelled */}
                {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t dark:border-gray-800">
                    <button 
                      onClick={() => setCancellationModal({ 
                        isOpen: true, 
                        orderId: order._id || order.id 
                      })}
                      className="px-3 py-1 rounded-xl bg-red-600 text-white text-sm hover:bg-red-700 transition-colors"
                    >
                      Cancel Order
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}