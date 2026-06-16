import React, { useState } from 'react';

const CANCELLATION_REASONS = [
  "Changed my mind",
  "Found a better price elsewhere",
  "Delivery time too long",
  "Product specifications not matching",
  "Financial reasons"
];

export default function CancellationModal({ isOpen, onClose, onConfirm, orderId }) {
  const [selectedReason, setSelectedReason] = useState("");
  const [comment, setComment] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!selectedReason) {
      alert("Please select a cancellation reason");
      return;
    }

    onConfirm(orderId, {
      reason: selectedReason,
      comment: comment.trim()
    });
    
    // Reset form
    setSelectedReason("");
    setComment("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold mb-4">Cancel Order</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Reason for cancellation *</label>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="w-full p-3 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
              required
            >
              <option value="">Select a reason</option>
              {CANCELLATION_REASONS.map((reason) => (
                <option key={reason} value={reason}>{reason}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Additional comments (optional)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Please provide any additional details..."
              rows={3}
              className="w-full p-3 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700"
            >
              Confirm Cancellation
            </button>
            <button
              onClick={onClose}
              className="flex-1 border dark:border-gray-700 py-2 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}