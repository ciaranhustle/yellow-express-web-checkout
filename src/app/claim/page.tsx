"use client";

import { use, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/Auth/LoginForm";
import RegisterForm from "@/components/Auth/RegisterForm";
import { Container } from "@/components/Container/Container";
import { useGuestJob } from "@/hooks/queries/useGuestJob";
import { useClaimJob } from "@/hooks/mutations/useClaimJob";
import { toast } from "react-toastify";
import { LoadingPage } from "@/components/LoadingPage";
import { useAuthContext } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

type SearchParams = {
  reference: string;
};

type ConfirmationPageProps = {
  searchParams: Promise<SearchParams>;
};

const ConfirmationPage = ({ searchParams }: ConfirmationPageProps) => {
  const router = useRouter();
  const { reference } = use(searchParams);
  const [showLogin, setShowLogin] = useState(true);

  const { data: job, isLoading } = useGuestJob({ jobId: reference });
  const { mutate: claimJob, isPending } = useClaimJob();
  const { customer, isAuthenticated } = useAuthContext();

  const handleClaimJob = useCallback(async () => {
    claimJob(
      { jobId: job._id },
      {
        onSuccess: () => {
          router.push("/claim-success");
        },
        onError: () => {
          toast.error("Failed to claim booking");
        },
      }
    );
  }, [job?._id, router, claimJob]);

  if (isLoading) {
    return <LoadingPage message="Loading your booking..." />;
  }

  if (!reference || !job) {
    return <div>Booking not found</div>;
  }

  if (isPending) {
    return <LoadingPage message="Claiming your booking..." />;
  }

  return (
    <Container>
      <div className="w-full flex flex-col py-8 gap-6 items-center text-center">
        <h1 className="text-4xl font-bold mb-2 text-center">
          Claim Your Booking
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Booking Reference #{job?.JSData?.bookingNo}
        </p>

        {isAuthenticated && customer ? (
          <div className="flex flex-col items-center gap-4 w-full">
            <div className="text-center space-y-2 mb-4">
              <p className="text-lg font-semibold">
                Ready to claim your booking, {customer.firstName}?
              </p>
              <p className="text-sm text-gray-600">
                This will link this booking to your account and allow you to
                track the jobs progress through the Yellow Express app.
              </p>
            </div>
            <button
              onClick={handleClaimJob}
              disabled={isPending}
              className={cn(
                "w-full text-center font-bold text-xl py-3 bg-primary border-2 border-black rounded capitalize",
                isPending && "opacity-50"
              )}
            >
              {isPending ? "Claiming..." : "Claim"}
            </button>
          </div>
        ) : (
          <>
            {showLogin ? (
              <>
                <LoginForm onSuccess={handleClaimJob} />
                <p className="mt-4 text-gray-600">
                  Don&apos;t have an account?{" "}
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
                  Already have an account?{" "}
                  <button
                    onClick={() => setShowLogin(true)}
                    className="text-accent font-bold hover:underline"
                  >
                    Login here
                  </button>
                </p>
              </>
            )}
          </>
        )}
      </div>
    </Container>
  );
};

export default ConfirmationPage;
