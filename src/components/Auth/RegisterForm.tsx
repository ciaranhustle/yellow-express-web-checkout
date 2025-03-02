'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Input from '@/components/Input/Input';
import { cn } from '@/lib/utils';
import { useRegister } from '@/hooks/mutations/useRegister';
import { isEmail, isMobile } from '@/lib/validation';

interface RegisterFormValues {
	email: string;
	firstName: string;
	lastName: string;
	mobile: string;
	password: string;
	jobId: string;
}

interface RegisterFormProps {
	jobId: string;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ jobId }) => {
	const { mutateAsync: register, isPending } = useRegister();

	const {
		handleSubmit,
		formState: { errors },
		register: registerField,
	} = useForm<RegisterFormValues>({
		defaultValues: {
			email: '',
			firstName: '',
			lastName: '',
			mobile: '',
			password: '',
			jobId,
		},
	});

	const onSubmit = async (data: RegisterFormValues) => {
		try {
			await register(data);
		} catch (error) {
			console.error('Registration error:', error);
			toast.error('Registration failed. Please try again.');
		}
	};

	return (
		<div className="w-full max-w-md mx-auto">
			<form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
				<Input
					label="First name*"
					placeholder="Enter your first name"
					{...registerField('firstName', { required: 'First name is required' })}
					errors={errors}
				/>
				<Input
					label="Last name*"
					placeholder="Enter your last name"
					{...registerField('lastName', { required: 'Last name is required' })}
					errors={errors}
				/>
				<Input
					label="Phone number*"
					placeholder="Enter your phone number"
					{...registerField('mobile', {
						required: 'Phone number is required',
						validate: (value) => isMobile(value) || 'Phone number is invalid',
					})}
					errors={errors}
				/>
				<Input
					label="Email address*"
					placeholder="Enter your email address"
					type="email"
					{...registerField('email', {
						required: 'Email address is required',
						validate: (value) => isEmail(value) || 'Email address is invalid',
					})}
					errors={errors}
				/>
				<Input
					label="Password*"
					placeholder="Enter your password"
					type="password"
					{...registerField('password', {
						required: 'Password is required',
						minLength: {
							value: 6,
							message: 'Password must be at least 6 characters',
						},
					})}
					errors={errors}
				/>
				<div className="mt-6">
					<button
						type="submit"
						disabled={isPending}
						className={cn(
							'w-full text-center font-bold text-xl py-3 bg-primary border-2 border-black rounded capitalize',
							(isPending || Object.keys(errors).length > 0) && 'opacity-50'
						)}
					>
						{isPending ? 'Creating Account...' : 'Register'}
					</button>
				</div>
			</form>
		</div>
	);
};

export default RegisterForm;
