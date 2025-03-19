"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";
import { Container } from "@/components/Container/Container";
import { Loader } from "@/components/Loader/Loader";
import { StepNavButtons } from "@/components/StepNavButtons/StepNavButtons";
import { useClaimQuote } from "@/hooks/mutations/useClaimQuote";
import { useQuote } from "@/hooks/queries/useQuote";
import { useCartContext } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";

const QuotePage = () => {
  const router = useRouter();
  const { state } = useCartContext();
  const { data: quote, isLoading } = useQuote({ quoteId: state.quoteId });
  const { mutate: claimQuote, isPending: isClaiming } = useClaimQuote();

  const handleNextPress = () => {
    if (quote?._id) {
      claimQuote(
        {
          quoteId: quote._id,
        },
        {
          onSuccess: () => router.push("/summary"),
          onError: () =>
            toast.error(
              "Failed to claim quote. Please try again or contact us for help."
            ),
        }
      );
    }
  };

  return (
    <Container className="px-0 pb-0">
      {isLoading || isClaiming ? (
        <Loader
          label={isLoading ? "Getting your quote..." : "Claiming your quote..."}
        />
      ) : !quote ? (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-xl font-bold">Quote not found</p>
          <p className="mt-2">Please try again or contact support for help</p>
        </div>
      ) : (
        <>
          <div className="px-5 mt-7 w-full flex flex-col items-center">
            <div className="relative w-full max-w-lg bg-primary/30 rounded-lg pt-14 pb-10 flex flex-row justify-center items-center gap-8 lg:gap-14">
              <div className="absolute -top-6 text-center py-2 px-20 rounded-[40px] border border-primary font-black text-xl z-10 bg-white">
                Your quote
              </div>
              <div className="flex flex-col items-center gap-1">
                <h3 className="font-bold text-6xl">{formatPrice(quote.fullPrice)}</h3>
                <p className="font-bold">Job quote</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="flex flex-row items-center gap-2 w-full">
                  <Image src="/tickCircle.svg" alt="" width={24} height={24} />
                  <span className="flex-1 text-start">
                    {quote.inclusions.minutes} minutes
                  </span>
                </div>
                <div className="flex flex-row items-center gap-2 w-full">
                  <Image src="/tickCircle.svg" alt="" width={24} height={24} />
                  <span className="flex-1 text-start">
                    {`${quote.inclusions.loads} load${
                      quote.inclusions?.loads > 1 ? "s" : ""
                    }`}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-14 flex-1 w-full flex flex-col items-center bg-accent relative rounded-t-[50px] py-10 px-5">
            <div className="absolute -top-6 text-center py-2 px-20 rounded-[40px] font-black text-xl z-10 bg-primary">
              Special offer
            </div>
            <p className="text-white text-3xl font-bold relative red-strikethrough">
              {formatPrice(quote.fullPrice)}
            </p>
            <p className="text-white font-black text-8xl mt-2 white-underline">
              {formatPrice(quote.price)}
            </p>
            <p className="text-white text-center text-2xl px-5 mt-7">
              Book now to claim your discounted special offer!
            </p>
            <StepNavButtons
              onNext={handleNextPress}
              nextText="CLAIM OFFER"
              previousWhite
            />
          </div>
        </>
      )}
    </Container>
  );
};

export default QuotePage;
