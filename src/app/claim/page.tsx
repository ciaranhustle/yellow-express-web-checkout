'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/Auth/LoginForm';
import RegisterForm from '@/components/Auth/RegisterForm';
import { Container } from '@/components/Container/Container';
import { useGuestJob } from '@/hooks/queries/useGuestJob';
import { useClaimJob } from '@/hooks/mutations/useClaimJob';
import { toast } from 'react-toastify';
import { LoadingPage } from '@/components/LoadingPage';
import { useAuthContext } from '@/context/AuthContext';
type SearchParams = {
	jobid: string;
};

type ConfirmationPageProps = {
	searchParams: Promise<SearchParams>;
};

const ConfirmationPage = ({ searchParams }: ConfirmationPageProps) => {
	const router = useRouter();
	const { jobid } = use(searchParams);
	const [showLogin, setShowLogin] = useState(true);

	const { data: job, isLoading } = useGuestJob({ jobId: jobid });
	const { mutate: claimJob, isPending } = useClaimJob();
	const { customer, isAuthenticated } = useAuthContext();

	useEffect(() => {
		if (isAuthenticated && customer) {
			handleClaimJob();
		}
	}, [isAuthenticated, customer]);

	const handleClaimJob = async () => {
		claimJob({ jobId: jobid }, {
			onSuccess: () => {
				router.push('/claim-success');
			},
			onError: () => {
				toast.error('Failed to claim booking');
			}
		});
	};

	if (!jobid || !job?.job && !isLoading) {
		router.push('/');
	}

	console.log(isLoading)

	if (isLoading || !jobid) {
		return <></>;
	}

	if (isPending) {
		return <LoadingPage message="Claiming your booking..." />
	}

	return (
		<Container>
			<div className="w-full flex flex-col py-8 gap-6 items-center text-center">
				<h1 className="text-4xl font-bold mb-2 text-center">Claim Your Booking</h1>
				<p className="text-lg text-gray-600 mb-6">Booking ID: {jobid}</p>
				{customer && <p className="text-lg text-gray-600 mb-6">Welcome back, {customer.firstName}!</p>}
				{showLogin ? (
					<>
						<LoginForm onSuccess={handleClaimJob} />
						<p className="mt-4 text-gray-600">
							Don&apos;t have an account?{' '}
							<button 
								onClick={() => setShowLogin(false)}
								className="text-accent font-bold hover:underline"
							>
								Register here
							</button>
						</p>
					</>
				) : (
					<>
						<RegisterForm onSuccess={handleClaimJob} />
						<p className="mt-4 text-gray-600">
							Already have an account?{' '}
							<button 
								onClick={() => setShowLogin(true)}
								className="text-accent font-bold hover:underline"
							>
								Login here
							</button>
						</p>
					</>
				)}
			</div>
		</Container>
	);
};

export default ConfirmationPage;
