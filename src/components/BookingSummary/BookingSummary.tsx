import { format } from "date-fns";
import Image from "next/image";
import React, { useState } from "react";
import { bookingTimeOptions } from "@/lib/constants";
import { QuoteSummaryModal } from "@/components/QuoteDescriptionModal/QuoteDescriptionModal";

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
  const isToday = quote.bookingDetails.isToday;
  const isWeekend = quote.bookingDetails.date ? 
    new Date(quote.bookingDetails.date).getDay() === 0 || 
    new Date(quote.bookingDetails.date).getDay() === 6 : false;

  if (!quote) return null;

  const getTimeDisplay = (time: BookingTime) => {
    const timeOption = bookingTimeOptions.find(opt => opt.time === time);
    if (!timeOption) return time;
    
    const range = isWeekend && timeOption.weekendRange ? timeOption.weekendRange : timeOption.range;
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
          values={[isToday ? "ASAP" : getTimeDisplay(quote.bookingDetails.time)]}
        />
        <div className="text-sm w-full flex flex-row justify-between items-center my-4">
          <p className="opacity-50">Job summary</p>
          <button
            onClick={() => setIsDescriptionModalOpen(true)}
            className="bg-primary text-black px-4 py-1 rounded-full font-bold hover:bg-primary/90 transition-colors"
          >
            See Description
          </button>
        </div>
      </div>
      <QuoteSummaryModal
        isOpen={isDescriptionModalOpen}
        onClose={() => setIsDescriptionModalOpen(false)}
        summary={quote.summary}
      />
    </div>
  );
};
