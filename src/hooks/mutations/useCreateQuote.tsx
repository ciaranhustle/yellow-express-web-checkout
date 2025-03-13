"use client";

import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useCartContext } from "@/context/CartContext";

export const useCreateQuote = () => {
  const { state } = useCartContext();

  const quoteId = state.quoteId;
  const bookingType = state.type;
  const whenDetails = state.when;
  const whereDetails = state.where;
  const whatDetails = state.what;
  const bookingAssistOption = state.bookingAssistOption;
  const bookingDetails = {
    bookingType,
    ...whenDetails,
    ...whereDetails,
    description: whatDetails,
    bookingAssistOption,
  };
  const customerDetails = state.customerDetails;

  return useMutation({
    mutationFn: async () => {
      const response = await api(`/api/quote`, {
        method: "POST",
        data: {
          quoteId,
          bookingDetails,
          customerDetails,
        },
      });
      return response?.data?.quote ?? null;
    },
  });
};
