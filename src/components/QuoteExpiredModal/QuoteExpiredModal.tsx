import { useCreateQuote } from '@/hooks/mutations/useCreateQuote';
import { useCartContext } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { Loader } from '../Loader/Loader';

interface QuoteExpiredModalProps {
	isOpen: boolean;
}

export const QuoteExpiredModal: React.FC<QuoteExpiredModalProps> = ({ isOpen }) => {
	const router = useRouter();
	const { dispatch } = useCartContext();
	const { mutate: createQuote, isPending } = useCreateQuote();

	const handleCreateNewQuote = () => {
		createQuote(undefined, {
			onSuccess: (quote) => {
				dispatch({ type: 'SET_QUOTE_ID', payload: quote._id });
				router.push('/quote');
			},
		});
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg p-6 w-full max-w-md">
				<div className="flex flex-col items-center gap-8">
					<h2 className="text-3xl font-bold text-center">Your quote has expired</h2>
					<p className="text-center">
						Don&apos;t worry! We&apos;ve saved all your booking information and can get you a new
						quote right away.
					</p>
					<button
						disabled={isPending}
						className="w-full text-center font-bold text-2xl py-3 bg-primary border-2 border-black rounded md:flex-1 capitalize"
						onClick={handleCreateNewQuote}
					>
						{isPending ? <Loader className="sm-loader" /> : 'Create New Quote'}
					</button>
				</div>
			</div>
		</div>
	);
};
