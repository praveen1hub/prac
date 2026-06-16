import React, { useState } from 'react';

const INR = new Intl.NumberFormat("en-IN", { 
  style: "currency", 
  currency: "INR", 
  maximumFractionDigits: 0 
});

export default function Payment({ total, onSuccess, onClose }) {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      onSuccess(paymentMethod === 'card' ? 'Credit Card' : 
                paymentMethod === 'paypal' ? 'PayPal' : 'UPI');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          ✕
        </button>
        
        <h2 className="text-xl font-bold mb-4">Complete Payment</h2>
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
          <div className="text-lg font-semibold text-center">Total: {INR.format(total)}</div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Payment Method</label>
            <select 
              value={paymentMethod} 
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full rounded-xl border dark:border-gray-800 px-3 py-2 bg-white dark:bg-gray-800"
            >
              <option value="card">Credit/Debit Card</option>
              <option value="paypal">PayPal</option>
              <option value="upi">UPI</option>
            </select>
          </div>

          {paymentMethod === 'card' && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Card Number</label>
                <input 
                  type="text" 
                  placeholder="1234 5678 9012 3456" 
                  value={cardDetails.number}
                  onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                  className="w-full rounded-xl border dark:border-gray-800 px-3 py-2 bg-white dark:bg-gray-800"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Cardholder Name</label>
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  value={cardDetails.name}
                  onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                  className="w-full rounded-xl border dark:border-gray-800 px-3 py-2 bg-white dark:bg-gray-800"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Expiry Date</label>
                  <input 
                    type="text" 
                    placeholder="MM/YY" 
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                    className="w-full rounded-xl border dark:border-gray-800 px-3 py-2 bg-white dark:bg-gray-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">CVV</label>
                  <input 
                    type="text" 
                    placeholder="123" 
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                    className="w-full rounded-xl border dark:border-gray-800 px-3 py-2 bg-white dark:bg-gray-800"
                    required
                  />
                </div>
              </div>
            </>
          )}

          {paymentMethod === 'paypal' && (
            <div className="mb-4 p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
              <p className="text-sm text-center">You will be redirected to PayPal to complete your payment.</p>
            </div>
          )}

          {paymentMethod === 'upi' && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">UPI ID</label>
              <input 
                type="text" 
                placeholder="yourname@upi" 
                className="w-full rounded-xl border dark:border-gray-800 px-3 py-2 bg-white dark:bg-gray-800"
                required
              />
            </div>
          )}

          <div className="flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-xl border dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                'Pay Now'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}