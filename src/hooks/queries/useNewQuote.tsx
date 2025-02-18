import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useCartContext } from "@/context/CartContext";

export const useNewQuote = () => {
  const { state, dispatch } = useCartContext();
  const quoteId = state.quoteId;
  const bookingType = state.type;
  const whenDetails = state.when;
  const whereDetails = state.where;
  const whatDetails = state.what;
  const bookingDetails = {
    bookingType,
    ...whenDetails,
    ...whereDetails,
    whatDetails,
  };
  const customerDetails = state.customerDetails;

  return useQuery({
    queryKey: ["newquote"],
    queryFn: async () => {
      const response = await api(`/api/quote`, {
        method: "POST",
        data: {
          quoteId,
          bookingDetails,
          customerDetails,
        },
      });

      const quote = response?.data?.quote;
      if (quote) {
        dispatch({ type: "SET_QUOTE_ID", payload: quote.id });
      }
      return response?.data?.quote ?? null;
    },
    enabled:
      bookingType &&
      whenDetails &&
      whereDetails &&
      whatDetails &&
      customerDetails
        ? true
        : false,
  });
};
