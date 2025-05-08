"use client";

import { Loader } from "@/components/Loader/Loader";
import { SuccessPage } from "@/components/SuccessPage/SuccessPage";
import { useGuestJob } from "@/hooks/queries/useGuestJob";
import { format } from "date-fns";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const SuccessPageContent = () => {
  const searchParams = useSearchParams();
  const jobId = searchParams.get("bookingId");
  const { data: jobData, isLoading } = useGuestJob({ jobId: jobId });
  const job = jobData?.job;

  if (isLoading) {
    return <Loader />;
  }

  return (
    <SuccessPage
      title="Booking Confirmed!"
      message="A member of our team will be in touch shortly to confirm your booking."
      subMessage={
        job?.JSData?.bookingNo
          ? `Booking Reference #${job.JSData.bookingNo} - ${format(
              new Date(job.pickupDateUTC),
              "dd/MM/yyyy"
            )}`
          : undefined
      }
      showAppStore
    />
  );
};

const SuccessPageWrapper = () => {
  return (
    <Suspense fallback={<Loader />}>
      <SuccessPageContent />
    </Suspense>
  );
};

export default SuccessPageWrapper;
