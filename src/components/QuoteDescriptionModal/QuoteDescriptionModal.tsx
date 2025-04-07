import React from 'react';
import { X } from 'lucide-react';

interface QuoteSummaryModalProps {
	isOpen: boolean;
	onClose: () => void;
	summary: string;
}

export const QuoteSummaryModal: React.FC<QuoteSummaryModalProps> = ({
	isOpen,
	onClose,
	summary,
}) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg p-8 w-full max-w-md mx-4">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-2xl font-bold">Quote Summary</h2>
					<button onClick={onClose} className="text-gray-500 hover:text-gray-700">
						<X size={24} />
					</button>
				</div>
				<p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap text-left">
					{summary}
				</p>
			</div>
		</div>
	);
};
