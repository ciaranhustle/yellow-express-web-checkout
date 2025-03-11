"use client";

import { SuccessPage } from "@/components/SuccessPage/SuccessPage";

const ClaimSuccessPageWrapper = () => {
  return (
    <SuccessPage
      title="Booking Claimed Successfully!"
      message="Your booking has been claimed and is now associated with your account. You can view your booking details in your account dashboard."
    />
  );
};

export default ClaimSuccessPageWrapper; 