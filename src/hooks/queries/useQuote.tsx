"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useQuote = ({ quoteId }: { quoteId: string | null }) => {
  return useQuery({
    queryKey: ["quote", quoteId],
    queryFn: async () => {
      const response = await api(`/api/quote/${quoteId}`);
      const quote: Quote = response?.data?.quote ?? null;
      return quote;
    },
    enabled: !!quoteId,
  });
};
