"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Container } from "@/components/Container/Container";
import { BookingSummary } from "@/components/BookingSummary/BookingSummary";
import { useQuote } from "@/hooks/queries/useQuote";
import { useCartContext } from "@/context/CartContext";
import { BookingAssistOption } from "@/components/BookingAssistOption/BookingAssistOption";
import { Acknowledgement } from "@/components/Acknowledgement/Acknowledgement";
import { PaymentForm } from "@/components/PaymentForm/PaymentForm";
import { cn } from "@/lib/utils";
import { CountdownTimer } from "@/components/CountdownTimer/CountdownTimer";
import { useCheckout } from "@/hooks/mutations/useCheckout";
import { toast } from "react-toastify";
import { LoadingPage } from "@/components/LoadingPage";
import { useRouter } from "next/navigation";
import { DiscountCodeModal } from "@/components/DiscountCodeModal/DiscountCodeModal";
import { formatPrice } from "@/lib/format";
import { StepNavButtons } from "@/components/StepNavButtons/StepNavButtons";

const SummaryPage = () => {
  const router = useRouter();
  const { state, dispatch, isLoading: isCartLoading } = useCartContext();
  const { data: quote, isLoading: isQuoteLoading } = useQuote({
    quoteId: state.quoteId,
  });
  const {
    mutate: checkout,
    isPending: isCheckoutPending,
    isSuccess: isCheckoutSuccess,
  } = useCheckout();
  const [selectedAssistOption, setSelectedAssistOption] =
    useState<BookingAssistOption | null>(null);
  const [isServiceAcknowledge, setIsServiceAcknowledge] = useState(false);
  const [isChangeAcknowledge, setIsChangeAcknowledge] = useState(false);
  const [isTermsAcknowledge, setIsTermsAcknowledge] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);

  // Memoize the currently active prices based on selected upsell option
  const currentPrices = useMemo(() => {
    if (!quote) {
      // Return default/zero values if quote is not loaded
      return { price: 0, fullPrice: 0, tlcPrice: 0, tlcFullPrice: 0 };
    }
    const upsell = state.selectedUpsellOption;
    return {
      price: upsell?.price ?? quote.price,
      fullPrice: upsell?.fullPrice ?? quote.fullPrice,
      tlcPrice: upsell?.tlcPrice ?? quote.tlcPrice,
      tlcFullPrice: upsell?.tlcFullPrice ?? quote.tlcFullPrice,
    };
  }, [quote, state.selectedUpsellOption]);

  const handleSetBookingAssistOption = useCallback(
    (option: BookingAssistOption) => {
      setSelectedAssistOption(option);
      dispatch({ type: "SET_BOOKING_ASSIST_OPTION", payload: option });
    },
    [dispatch]
  );

  // Set DIY by default for small items & fragile & sensitive
  useEffect(() => {
    if (
      quote &&
      (quote.bookingDetails.bookingType === "Small Items" ||
        quote.bookingDetails.bookingType === "Fragile & Sensitive") &&
      !selectedAssistOption
    ) {
      handleSetBookingAssistOption("DIY");
    }
  }, [quote, handleSetBookingAssistOption, selectedAssistOption]);

  const handlePaymentSuccess = async (paymentMethodId: string) => {
    if (!quote || !selectedAssistOption) return;
    // Use memoized prices for checkout
    const checkoutQuote = {
      ...quote,
      price: currentPrices.price,
      fullPrice: currentPrices.fullPrice,
      tlcPrice: currentPrices.tlcPrice,
      tlcFullPrice: currentPrices.tlcFullPrice,
    };
    checkout({
      paymentMethodId,
      quote: checkoutQuote,
      bookingAssistOption: selectedAssistOption,
      couponCode: state.coupon?.code,
      upsellApplied: state.selectedUpsellOption?.speed,
    });
  };

  const handlePaymentError = () => {
    toast.error("Payment failed. Please try again.");
  };

  useEffect(() => {
    // Only redirect to home if we're not processing a payment,
    // there's no quote, and loading is complete
    if (
      !isCartLoading &&
      !quote &&
      !isQuoteLoading &&
      !isCheckoutPending &&
      !isCheckoutSuccess &&
      (!state.type ||
        !state.when?.date ||
        !state.customerDetails ||
        !state.where ||
        !state.what)
    ) {
      router.push("/");
    }
  }, [
    state,
    router,
    isCartLoading,
    quote,
    isQuoteLoading,
    isCheckoutPending,
    isCheckoutSuccess,
  ]);

  if (isCheckoutPending) {
    return <LoadingPage message="Processing payment..." />;
  }

  return (
    <>
      <CountdownTimer expiryTime={quote?.expiresOn} />
      <DiscountCodeModal
        isOpen={isDiscountModalOpen}
        onClose={() => setIsDiscountModalOpen(false)}
      />
      <Container className="border-none px-0 py-0 lg:px-0 lg:py-0 pb-10">
        {quote && (
          <>
            <div className="px-5 pt-8">
              <p className="text-base font-bold mb-3">
                {quote.bookingDetails.bookingType} Instant Booking
              </p>
              <BookingSummary quote={quote} />

              {quote.bookingDetails.bookingType === "Big & Bulky" && (
                <>
                  <p className="text-2xl font-bold my-8">Select an option</p>
                  <div className="flex flex-row gap-5">
                    <BookingAssistOption
                      option="DIY"
                      description="We'll park curbside and help you load & unload our van"
                      selectedOption={selectedAssistOption}
                      setSelectedOption={handleSetBookingAssistOption}
                      fullPrice={currentPrices.fullPrice}
                      price={currentPrices.price}
                      hint="Best value"
                    />
                    <BookingAssistOption
                      option="TLC"
                      description="Sit back and relax, we'll do all the work."
                      selectedOption={selectedAssistOption}
                      setSelectedOption={handleSetBookingAssistOption}
                      fullPrice={currentPrices.tlcFullPrice}
                      price={currentPrices.tlcPrice}
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
                      </div>
                    </div>
                  )}
                </>
              )}

              {selectedAssistOption && (
                <div className="px-2 my-6">
                  <div className="w-full flex flex-col gap-5">
                    <Acknowledgement
                      text="I understand that any changes to the job details (such as item quantity, size, location, delays, or time) may result in a change to the final price."
                      isChecked={isChangeAcknowledge}
                      onChange={() => setIsChangeAcknowledge((prev) => !prev)}
                    />
                    <Acknowledgement
                      text={
                        <>
                          I agree to the{" "}
                          <a
                            href="https://yellowexpress.com.au/terms-conditions/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                          >
                            terms and conditions
                          </a>{" "}
                          and the{" "}
                          <a
                            href="https://yellowexpress.com.au/cancellation-policy/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                          >
                            cancellation policy
                          </a>
                          .
                        </>
                      }
                      isChecked={isTermsAcknowledge}
                      onChange={() => setIsTermsAcknowledge((prev) => !prev)}
                    />
                  </div>
                </div>
              )}

              <div
                className={cn(
                  "w-full flex flex-col",
                  ((quote.bookingDetails.bookingType === "Big & Bulky" &&
                    (!selectedAssistOption || !isServiceAcknowledge)) ||
                    !isChangeAcknowledge ||
                    !isTermsAcknowledge) &&
                    "blur-sm pointer-events-none"
                )}
              >
                <div className="w-full bg-white border-b-8 border-b-primary rounded shadow-lg pl-6 pr-2 pt-4 pb-2 text-black my-7 flex flex-row justify-between items-center">
                  <div className="flex flex-row items-center gap-2">
                    <p className="text-lg font-bold">Got a discount code?</p>
                    <span className="text-sm opacity-50">
                      * Minimum spend $99.00
                    </span>
                  </div>
                  <button
                    className={cn(
                      "py-1 px-5 rounded-md border border-black hover:bg-gray-50",
                      currentPrices.price < 99 && "opacity-50"
                    )}
                    onClick={() => setIsDiscountModalOpen(true)}
                    disabled={currentPrices.price < 99}
                  >
                    + Add
                  </button>
                </div>
                <p className="text-lg font-bold mb-3 text-start">
                  Payment summary
                </p>
                <div className="flex flex-col bg-white rounded shadow-lg border-b-8 border-b-primary">
                  <div className="w-full flex flex-row justify-between pt-7 pb-5 px-6 border-b border-opacity-10">
                    <p className="text-lg font-bold">Your Booking</p>
                    <p className="text-lg font-bold mr-8">
                      {formatPrice(
                        state.bookingAssistOption === "TLC"
                          ? currentPrices.tlcFullPrice
                          : currentPrices.fullPrice
                      )}
                    </p>
                  </div>
                  <div className="w-full flex flex-row justify-between pt-7 pb-5 px-6 border-b border-opacity-10">
                    <div className="flex flex-col">
                      <p className="text-lg font-bold">Quote Discount</p>
                      <p className="text-sm">{state.coupon?.code}</p>
                    </div>
                    <div
                      className={`flex flex-col items-center ${
                        state.coupon ? "mr-6" : "mr-8"
                      }`}
                    >
                      <p className="text-lg font-bold">
                        -{" "}
                        {formatPrice(
                          (state.bookingAssistOption === "TLC"
                            ? currentPrices.tlcFullPrice -
                              currentPrices.tlcPrice
                            : currentPrices.fullPrice - currentPrices.price) +
                            (state.coupon?.value || 0)
                        )}
                      </p>
                      {state.coupon && (
                        <button
                          onClick={() => dispatch({ type: "CLEAR_COUPON" })}
                          className="text-sm border border-black rounded-md px-2 hover:bg-gray-100"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="w-full flex flex-row justify-between pt-7 pb-5 px-6 border-b border-opacity-10">
                    <p className="text-2xl font-bold">Total</p>
                    <p className="text-2xl font-bold mr-8">
                      {formatPrice(
                        (state.bookingAssistOption === "TLC"
                          ? currentPrices.tlcPrice
                          : currentPrices.price) - (state.coupon?.value || 0)
                      )}
                    </p>
                  </div>
                  {selectedAssistOption && (
                    <div className="w-full pt-7 pb-5 px-6 border-b border-opacity-10">
                      <PaymentForm
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-24">
                <StepNavButtons hideNext />
              </div>
            </div>
          </>
        )}
      </Container>
    </>
  );
};

export default SummaryPage;
