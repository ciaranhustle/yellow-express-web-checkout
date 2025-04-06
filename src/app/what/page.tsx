'use client';

import { useRouter } from 'next/navigation';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { Container } from '@/components/Container/Container';
import { StepHeader } from '@/components/StepHeader/StepHeader';
import { StepNavButtons } from '@/components/StepNavButtons/StepNavButtons';
import { useCartContext } from '@/context/CartContext';
import { useEffect, useState } from 'react';
import { Acknowledgement } from '@/components/Acknowledgement/Acknowledgement';
import { SuggestionBubble } from '@/components/SuggestionBubble/SuggestionBubble';
import { Plus, X } from 'lucide-react';

interface FormValues {
	items: { description: string }[];
}

const MIN_CHARACTERS = 1;

// List of suggested items for Big & Bulky
const SUGGESTED_ITEMS = [
	'Sofa',
	'Armchair',
	'Coffee Table',
	'Dining Table',
	'Dining Chairs',
	'Bed Frame',
	'Mattress',
	'Wardrobe',
	'Dresser',
	'TV',
	'Refrigerator',
	'Washing Machine',
	'Dryer',
	'Dishwasher',
	'Desk',
	'Bookcase',
	'Patio Set',
	'Office Chair',
	'Filing Cabinet',
];

// Function to get icon for common items
const getItemIcon = (item: string): string => {
	if (!item) return '📦';
	const itemLower = item.toLowerCase();
	if (itemLower.includes('sofa') || itemLower.includes('couch')) return '🛋️';
	if (itemLower.includes('tv')) return '📺';
	if (itemLower.includes('table')) return '🪑';
	if (itemLower.includes('bed')) return '🛏️';
	if (itemLower.includes('chair')) return '💺';
	if (itemLower.includes('box')) return '📦';
	if (itemLower.includes('refrigerator') || itemLower.includes('fridge')) return '🧊';
	if (itemLower.includes('washing')) return '🧺';
	if (itemLower.includes('desk')) return '🖥️';
	if (itemLower.includes('book')) return '📚';
	if (itemLower.includes('armchair')) return '🪑';
	if (itemLower.includes('mattress')) return '🛏️';
	if (itemLower.includes('wardrobe')) return '🗄️';
	if (itemLower.includes('dresser')) return '🪞';
	if (itemLower.includes('dryer')) return '👕';
	if (itemLower.includes('dishwasher')) return '🍽️';
	if (itemLower.includes('patio')) return '⛱️';
	if (itemLower.includes('filing')) return '🗃️';
	return '📦'; // Default icon
};

const WhatPage = () => {
	const router = useRouter();
	const { state, dispatch, isLoading: isCartLoading } = useCartContext();
	const [isSmallItemsAcknowledge, setIsSmallItemsAcknowledge] = useState(false);
	const [newItemText, setNewItemText] = useState('');

	const { handleSubmit, control, watch } = useForm<FormValues>({
		defaultValues: {
			items: 
				Array.isArray(state.what) && state.what.length > 0
					? state.what.map((description) => ({ description }))
					: [],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'items',
	});

	const items = watch('items');

	const nextDisabled =
		items.length === 0 ||
		((state.type === 'Small Items' || state.type === 'Fragile & Sensitive') &&
			!isSmallItemsAcknowledge);

	const handleAddItem = () => {
		if (newItemText.trim().length >= MIN_CHARACTERS) {
			append({ description: newItemText.trim() });
			setNewItemText('');
		}
	};

	const handleSuggestionSelect = (suggestion: string) => {
		append({ description: suggestion });
	};

	const handleNextPress = (formData: FormValues) => {
		const validItems = formData.items
			.filter((item) => item.description.length >= MIN_CHARACTERS)
			.map((item) => item.description);
		dispatch({ type: 'SET_WHAT', payload: validItems });
		router.push('/details');
	};

	useEffect(() => {
		// If the user navigates to this page without the previous steps, redirect to the home page
		if (!isCartLoading && !state.type) {
			router.push('/');
		}
	}, [state, router, isCartLoading]);

	return (
		<Container>
			<StepHeader title="What are we moving?" />
			{state.type ? (
				<>
					{state.type === 'Big & Bulky' ? (
						<div className="w-full flex flex-col gap-4">
							<div className="relative w-full">
								<input
									type="text"
									value={newItemText}
									onChange={(e) => setNewItemText(e.target.value)}
									placeholder="Add an item..."
									className="w-full px-5 py-3 border border-lightgrey rounded text-lg bg-transparent"
									onKeyDown={(e) => {
										if (e.key === 'Enter') {
											e.preventDefault();
											handleAddItem();
										}
									}}
								/>
								<button
									type="button"
									onClick={handleAddItem}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
									aria-label="Add item"
								>
									<Plus size={24} />
								</button>
							</div>

							{fields.length > 0 && (
								<div className="flex flex-wrap gap-2 mt-2">
									{fields.map((field, index) => (
										<div
											key={field.id}
											className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md border border-gray-200"
										>
											<span>{getItemIcon(items[index].description)}</span>
											<span>{items[index].description}</span>
											<button
												type="button"
												onClick={() => remove(index)}
												className="text-gray-500 ml-1"
												aria-label={`Remove ${items[index].description}`}
											>
												<X size={18} />
											</button>
										</div>
									))}
								</div>
							)}

							<SuggestionBubble
								suggestions={SUGGESTED_ITEMS}
								onSelect={handleSuggestionSelect}
							/>
						</div>
					) : (
						<div className="w-full flex flex-col items-end gap-4">
							<Controller
								name="items.0.description"
								control={control}
								rules={{
									minLength: {
										value: MIN_CHARACTERS,
										message: `Minimum ${MIN_CHARACTERS} characters are required`,
									},
								}}
								render={({ field }) => (
									<textarea
										{...field}
										placeholder="Describe your items"
										className="w-full p-3 border border-gray-300 rounded-md placeholder:text-gray-600 min-h-[100px] resize-y"
									/>
								)}
							/>
							<Acknowledgement
								text="The items that I am moving are small enough to be placed on the front seat of a standard car."
								isChecked={isSmallItemsAcknowledge}
								onChange={() => setIsSmallItemsAcknowledge((prev) => !prev)}
							/>
						</div>
					)}
				</>
			) : null}

			<StepNavButtons
				onNext={handleSubmit(handleNextPress)}
				nextDisabled={nextDisabled}
			/>
		</Container>
	);
};

export default WhatPage;
