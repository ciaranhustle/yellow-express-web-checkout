"use client";

import { useState } from "react";
import { Container } from "@/components/Container/Container";
import { Loader } from "@/components/Loader/Loader";
import { PaymentForm } from "@/components/PaymentForm/PaymentForm";
import { ProgressBar } from "@/components/ProgressBar/ProgressBar";
import { BookingSummary } from "@/components/BookingSummary/BookingSummary";
import { useQuote } from "@/hooks/queries/useQuote";
import { useCartContext } from "@/context/CartContext";
import { BookingAssistOption } from "@/components/BookingAssistOption/BookingAssistOption";
import { cn } from "@/lib/utils";
import { PaymentSummary } from "@/components/PaymentSummary/PaymentSummary";
import { Acknowledgement } from "@/components/Acknowledgement/Acknowledgement";

type BookingAssistOption = "DIY" | "TLC";

const SummaryPage = () => {
  const { state } = useCartContext();
  const { data: quote, isLoading } = useQuote({ quoteId: state.quoteId });
  const [selectedAssistOption, setSelectedAssistOption] =
    useState<BookingAssistOption | null>(null);
  const [isServiceAcknowledge, setIsServiceAcknowledge] = useState(false);
  const [isChangeAcknowledge, setIsChangeAcknowledge] = useState(false);

  return (
    <Container className="border-none px-0 py-0 lg:px-0 lg:py-0 pb-10">
      {isLoading ? (
        <Loader />
      ) : (
        quote && (
          <>
            <div className="bg-accent w-full pt-3 pb-4 px-4 flex flex-row justify-between text-white text-sm relative">
              <p>We are holding your special offer</p>
              <p className="font-bold">06:32</p>
              <div className="absolute bottom-0 left-0 right-0">
                <ProgressBar percentage={70} />
              </div>
            </div>

            <div className="px-5 pt-8">
              <p className="text-base font-bold mb-3">
                {quote.bookingDetails.bookingType} Instant Booking
              </p>
              <BookingSummary quote={quote} />

              <p className="text-2xl font-bold my-8">Select an option</p>
              <div className="flex flex-row gap-5">
                <BookingAssistOption
                  option="DIY"
                  description="We’ll park curbside and help you load & unload our van"
                  selectedOption={selectedAssistOption}
                  setSelectedOption={setSelectedAssistOption}
                  fullPrice={149}
                  price={99}
                  hint="Best value"
                />
                <BookingAssistOption
                  option="TLC"
                  description="Sit back and relax, we’ll do all the work."
                  selectedOption={selectedAssistOption}
                  setSelectedOption={setSelectedAssistOption}
                  fullPrice={499}
                  price={399}
                />
              </div>

              {selectedAssistOption && (
                <div className="px-2">
                  <p className="text-xl font-bold mt-7 mb-2 text-start">
                    Acknowledge before proceeding
                  </p>
                  <div className="w-full flex flex-col gap-5">
                    <Acknowledgement
                      text={
                        selectedAssistOption === "DIY"
                          ? "I understand that Yellow Express DIY provides a one-man and van service. I agree to assist the driver with loading and unloading any large or bulky items at both pickup and drop-off locations."
                          : "I understand that Yellow Express TLC provides a two-man and van service. I agree to ensure that the drivers have access in order to load and unload any large or bulky items at both pickup and drop-off locations."
                      }
                      isChecked={isServiceAcknowledge}
                      onChange={() => setIsServiceAcknowledge((prev) => !prev)}
                    />
                    <Acknowledgement
                      text="I understand that any changes to the job details (such as item quantity, size, location, or time) may result in a change to the final price."
                      isChecked={isChangeAcknowledge}
                      onChange={() => setIsChangeAcknowledge((prev) => !prev)}
                    />
                  </div>
                </div>
              )}

              <div
                className={cn(
                  "w-full flex flex-col",
                  !selectedAssistOption && "blur-sm pointer-events-none"
                )}
              >
                <PaymentSummary />
                <PaymentForm onSuccess={() => {}} onError={() => {}} />
              </div>
            </div>
          </>
        )
      )}
    </Container>
  );
};

export default SummaryPage;
