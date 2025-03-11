"use client";

import { SuccessPage } from "@/components/SuccessPage/SuccessPage";

const SuccessPageWrapper = () => {
  return (
    <SuccessPage
      title="Booking Confirmed!"
      message="A member of our team will be in touch shortly to confirm your booking."
      showAppStore
    />
  );
};

export default SuccessPageWrapper;
