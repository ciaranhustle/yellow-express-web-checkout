'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Input from '@/components/Input/Input';
import { cn } from '@/lib/utils';
import { useLogin } from '@/hooks/mutations/useLogin';
import { isEmail } from '@/lib/validation';

interface LoginFormValues {
	email: string;
	password: string;
}

export const LoginForm: React.FC = () => {
	const { mutateAsync: login, isPending } = useLogin();

	const {
		handleSubmit,
		formState: { errors },
		register,
	} = useForm<LoginFormValues>({
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const onSubmit = async (data: LoginFormValues) => {
		try {
			await login(data);
		} catch (error) {
			console.error('Login error:', error);
			toast.error('Login failed. Please check your credentials and try again.');
		}
	};

	return (
		<div className="w-full max-w-md mx-auto">
			<form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
				<Input
					label="Email address*"
					placeholder="Enter your email address"
					type="email"
					{...register('email', {
						required: 'Email address is required',
						validate: (value) => isEmail(value) || 'Email address is invalid',
					})}
					errors={errors}
				/>
				<Input
					label="Password*"
					placeholder="Enter your password"
					type="password"
					{...register('password', {
						required: 'Password is required',
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
						{isPending ? 'Logging in...' : 'Login'}
					</button>
				</div>
			</form>
		</div>
	);
};

export default LoginForm;
