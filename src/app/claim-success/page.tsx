"use client";

import { SuccessPage } from "@/components/SuccessPage/SuccessPage";

const ClaimSuccessPageWrapper = () => {
  return (
    <SuccessPage
      title="Booking Claimed Successfully!"
      message="Your booking is now associated with your Yellow Express account."
      showAppStore={true}
    />
  );
};

export default ClaimSuccessPageWrapper;
