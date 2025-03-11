"use client";

import { SuccessPage } from "@/components/SuccessPage/SuccessPage";

const EnquiryReceivedPage = () => {
  return (
    <SuccessPage
      title="Enquiry Received!"
      message="A member of our team will be in touch shortly to confirm your booking."
      showAppStore={false}
    />
  );
};

export default EnquiryReceivedPage;
