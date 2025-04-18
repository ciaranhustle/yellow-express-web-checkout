import { cn } from "@/lib/utils";

interface QuoteSummaryProps {
  className?: string;
  quote: Quote;
}

export const QuoteSummary = ({ className, quote }: QuoteSummaryProps) => {
  console.log(quote.bookingDetails.description);
  return (
    <p className={cn("text-center", className)}>
      Your{" "}
      <span className="font-medium">{quote.bookingDetails.bookingType}</span>{" "}
      quote includes moving{" "}
      <span className="font-medium">
        {quote.bookingDetails.description.length}
      </span>{" "}
      items from{" "}
      <span className="font-medium">
        {quote.bookingDetails.pickUpAddress.address}
      </span>{" "}
      to{" "}
      <span className="font-medium">
        {quote.bookingDetails.dropOffAddress.address}
      </span>{" "}
      using our <span className="font-medium">{quote.speedLabel}</span> service
    </p>
  );
};
