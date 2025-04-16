import { format } from "date-fns";
import Image from "next/image";
import React, { useState } from "react";
import { bookingTimeOptions } from "@/lib/constants";
import { QuoteSummaryModal } from "@/components/QuoteDescriptionModal/QuoteDescriptionModal";
import { formatPrice } from "@/lib/format";
import { useCartContext } from "@/context/CartContext";
import { cn } from "@/lib/utils";
import { SpeedInfoModal } from "../SpeedInfoModal/SpeedInfoModal";
import { Info } from "lucide-react";

interface BookingSummaryItemProps {
  title: string;
  values: string[];
}

const BookingSummaryItem: React.FC<BookingSummaryItemProps> = ({
  title,
  values = [],
}) => (
  <div className="text-sm w-full flex flex-col items-start gap-1">
    <p className="opacity-50">{title}</p>
    {values.map((value, index) => (
      <div
        key={index}
        className="w-full flex flex-row justify-between items-center"
      >
        <p className="w-2/3 text-start">{value}</p>
        <Image src="/tickCircle.svg" width={20} height={20} alt="Tick" />
      </div>
    ))}
  </div>
);

interface Props {
  quote: Quote;
}

export const BookingSummary: React.FC<Props> = ({ quote }) => {
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [isSpeedInfoModalOpen, setIsSpeedInfoModalOpen] = useState(false);
  const { state: cartState, dispatch } = useCartContext();
  const selectedUpsell = cartState.selectedUpsellOption;
  const isToday = quote.bookingDetails.isToday;
  const isWeekend = quote.bookingDetails.date
    ? new Date(quote.bookingDetails.date).getDay() === 0 ||
      new Date(quote.bookingDetails.date).getDay() === 6
    : false;

  if (!quote) return null;

  const getTimeDisplay = (time: BookingTime) => {
    const timeOption = bookingTimeOptions.find((opt) => opt.time === time);
    if (!timeOption) return time;

    const range =
      isWeekend && timeOption.weekendRange
        ? timeOption.weekendRange
        : timeOption.range;
    return `${time} (${range})`;
  };

  return (
    <div className="w-full bg-white border-b-8 border-b-primary rounded shadow-lg px-6 py-5 text-black">
      <h3 className="text-2xl font-bold text-start mb-3">Booking Summary</h3>
      <div className="w-full flex flex-col gap-2.5">
        <BookingSummaryItem
          title="Pick up"
          values={[quote.bookingDetails.pickUpAddress.address]}
        />
        <BookingSummaryItem
          title="Drop off"
          values={[quote.bookingDetails.dropOffAddress.address]}
        />
        <BookingSummaryItem
          title="Date"
          values={[
            format(
              isToday ? new Date() : new Date(quote.bookingDetails.date),
              "EEEE, d MMMM yyyy"
            ),
          ]}
        />
        <BookingSummaryItem
          title="Pickup time"
          values={[
            isToday ? "ASAP" : getTimeDisplay(quote.bookingDetails.time),
          ]}
        />
        <div className="text-sm w-full flex flex-row justify-between items-center my-2 pt-4 border-t border-gray-200">
          <p className="opacity-50">Job summary</p>
          <button
            onClick={() => setIsDescriptionModalOpen(true)}
            className="bg-primary text-black px-4 py-2 rounded-full font-bold hover:bg-primary/90 transition-colors"
          >
            See Description
          </button>
        </div>
        {quote.upsellOptions && quote.upsellOptions.length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <div className="flex flex-row justify-between items-center mb-2">
              <p className="text-sm opacity-50">Upgrade Delivery Speed:</p>
              <button
                onClick={() => setIsSpeedInfoModalOpen(true)}
                className="text-sm opacity-50"
              >
                <Info size={16} />
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {quote.upsellOptions.map((option) => (
                <button
                  key={option.speed}
                  onClick={() =>
                    dispatch({ type: "SET_UPSELL_OPTION", payload: option })
                  }
                  className={cn(
                    "p-3 rounded border text-left transition-colors",
                    selectedUpsell?.speed === option.speed
                      ? "border-primary bg-primary/10"
                      : "border-gray-300 hover:bg-gray-50",
                    !option.available && "opacity-50"
                  )}
                  disabled={!option.available}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">
                      {option.speed} {!!option.label && `(${option.label})`}
                      <span className="text-sm opacity-50">
                        {!option.available && " - Unavailable"}
                      </span>
                    </span>
                    <span className="font-bold">
                      {formatPrice(
                        cartState.bookingAssistOption === "TLC"
                          ? option.tlcPrice
                          : option.price
                      )}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <QuoteSummaryModal
        isOpen={isDescriptionModalOpen}
        onClose={() => setIsDescriptionModalOpen(false)}
        quote={quote}
      />
      <SpeedInfoModal
        isOpen={isSpeedInfoModalOpen}
        onClose={() => setIsSpeedInfoModalOpen(false)}
      />
    </div>
  );
};
