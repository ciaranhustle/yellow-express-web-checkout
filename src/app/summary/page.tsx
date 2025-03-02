"use client";

import { useState } from "react";
import { Container } from "@/components/Container/Container";
import { Loader } from "@/components/Loader/Loader";
import { BookingSummary } from "@/components/BookingSummary/BookingSummary";
import { useQuote } from "@/hooks/queries/useQuote";
import { useCartContext } from "@/context/CartContext";
import { BookingAssistOption } from "@/components/BookingAssistOption/BookingAssistOption";
import { Acknowledgement } from "@/components/Acknowledgement/Acknowledgement";
// import { PaymentForm } from "@/components/PaymentForm/PaymentForm";
import { cn } from "@/lib/utils";
import { CountdownTimer } from "@/components/CountdownTimer/CountdownTimer";

type BookingAssistOption = "DIY" | "TLC";

const SummaryPage = () => {
  const { state } = useCartContext();
  const { data: quote, isLoading } = useQuote({ quoteId: state.quoteId });
  console.log({ quote });
  const [selectedAssistOption, setSelectedAssistOption] =
    useState<BookingAssistOption | null>(null);
  const [isServiceAcknowledge, setIsServiceAcknowledge] = useState(false);
  const [isChangeAcknowledge, setIsChangeAcknowledge] = useState(false);

  return (
    <>
      <CountdownTimer expiryTime={quote?.expiresOn} />
      <Container className="border-none px-0 py-0 lg:px-0 lg:py-0 pb-10">
        {isLoading ? (
          <Loader />
        ) : (
          quote && (
            <>
              <div className="px-5 pt-8">
                <p className="text-base font-bold mb-3">
                  {quote.bookingDetails.bookingType} Instant Booking
                </p>
                <BookingSummary quote={quote} />

                <p className="text-2xl font-bold my-8">Select an option</p>
                <div className="flex flex-row gap-5">
                  <BookingAssistOption
                    option="DIY"
                    description="We'll park curbside and help you load & unload our van"
                    selectedOption={selectedAssistOption}
                    setSelectedOption={setSelectedAssistOption}
                    fullPrice={quote.fullPrice}
                    price={quote.price}
                    hint="Best value"
                  />
                  <BookingAssistOption
                    option="TLC"
                    description="Sit back and relax, we'll do all the work."
                    selectedOption={selectedAssistOption}
                    setSelectedOption={setSelectedAssistOption}
                    fullPrice={quote.fullPrice + 300}
                    price={quote.price + 300}
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
                        onChange={() =>
                          setIsServiceAcknowledge((prev) => !prev)
                        }
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
                  <div className="w-full bg-white border-b-8 border-b-primary rounded shadow-lg pl-6 pr-2 pt-4 pb-2 text-black my-7 flex flex-row justify-between items-center">
                    <p className="text-lg font-bold">Got a discount code?</p>
                    <button className="py-1 px-5 rounded-md border border-black">
                      + Add
                    </button>
                  </div>
                  <p className="text-lg font-bold mb-3 text-start">
                    Payment summary
                  </p>
                  <div className="flex flex-col bg-white rounded shadow-lg border-b-8 border-b-primary">
                    <div className="w-full flex flex-row justify-between pt-7 pb-5 px-6 border-b border-opacity-10">
                      <p className="text-lg font-bold">Your Booking</p>
                      <p className="text-lg font-bold w-20">${quote.price}</p>
                    </div>
                  </div>
                  {/* <PaymentForm onSuccess={() => {}} onError={() => {}} /> */}
                </div>
              </div>
            </>
          )
        )}
      </Container>
    </>
  );
};

export default SummaryPage;
