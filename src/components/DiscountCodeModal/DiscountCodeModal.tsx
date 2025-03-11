import React, { useState } from 'react';
import { useApplyDiscountCode } from '@/hooks/mutations/useApplyDiscountCode';

interface DiscountCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DiscountCodeModal: React.FC<DiscountCodeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [code, setCode] = useState('');
  const { mutate: applyDiscountCode, isPending } = useApplyDiscountCode();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyDiscountCode({ code }, {
      onSuccess: () => {
        setCode('');
        onClose();
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Enter Discount Code</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter your discount code"
            className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4"
            disabled={isPending}
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
              disabled={isPending}
            >
              {isPending ? 'Applying...' : 'Apply'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 