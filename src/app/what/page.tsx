'use client';

import { useRouter } from 'next/navigation';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { Container } from '@/components/Container/Container';
import { StepHeader } from '@/components/StepHeader/StepHeader';
import { StepNavButtons } from '@/components/StepNavButtons/StepNavButtons';
import { useCartContext } from '@/context/CartContext';
import { useEffect } from 'react';
import Input from '@/components/Input/Input';
import Image from 'next/image';
interface FormValues {
	items: { description: string }[];
}

const MIN_CHARACTERS = 5;

const WhatPage = () => {
	const router = useRouter();
	const { state, dispatch, isLoading: isCartLoading } = useCartContext();

	const {
		handleSubmit,
		control,
		formState: { errors },
		watch,
	} = useForm<FormValues>({
		defaultValues: {
			items:
				state.what && Array.isArray(state.what)
					? state.what.map((description) => ({ description }))
					: [{ description: '' }],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'items',
	});

	const items = watch('items');

	const nextDisabled = !items?.some((item) => item.description.length >= MIN_CHARACTERS);

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
			<div className="w-full flex flex-col items-end gap-4">
				<div className="w-full space-y-4">
					{fields.map((field, index) => (
						<div key={field.id} className="flex gap-2">
							<Controller
								name={`items.${index}.description`}
								control={control}
								rules={{
									minLength: {
										value: MIN_CHARACTERS,
										message: `Minimum ${MIN_CHARACTERS} characters are required`,
									},
								}}
								render={({ field }) => (
									<Input
										{...field}
										placeholder="Describe an item"
										errors={errors}
										className="placeholder:text-gray-600 border-gray-300"
									/>
								)}
							/>
							{fields.length > 1 && (
								<button
									type="button"
									onClick={() => remove(index)}
									className="text-red-500 hover:text-red-700"
								>
									<Image src="/xCircle.svg" alt="x" width={36} height={36} />
								</button>
							)}
						</div>
					))}
				</div>
				<button
					type="button"
					onClick={() => append({ description: '' })}
					className="text-blue-500 hover:text-blue-700"
				>
					+ Add Another Item
				</button>
			</div>
			<StepNavButtons
				// headerText="Your quote powered by ChatGPT"
				onNext={handleSubmit(handleNextPress)}
				nextDisabled={nextDisabled}
			/>
		</Container>
	);
};

export default WhatPage;
