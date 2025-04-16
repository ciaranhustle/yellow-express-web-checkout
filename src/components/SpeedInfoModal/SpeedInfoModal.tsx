import React from "react";
import { X } from "lucide-react";

interface SpeedInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpeedInfoModal: React.FC<SpeedInfoModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Speed Availability</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <div className="text-sm">
          <p>
            Fragile & Sensitive, Weekend & Weekday Afternoon jobs are all priced
            at RED HOT rate.
            <br />
            <br />
            Weekday Midday jobs can be scheduled at VIP or RED HOT.
            <br />
            <br />
            All other jobs can be scheduled at STANDARD, VIP or RED HOT.
          </p>
        </div>
      </div>
    </div>
  );
};
