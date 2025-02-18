import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface UpdateQuoteProps {
  quoteId: string;
}

export const useClaimQuote = () => {
  const claimQuoteFn = async ({ quoteId }: UpdateQuoteProps) => {
    const response = await api(`/api/quote/${quoteId}/claim`);
    return response?.data ?? null;
  };

  return useMutation({
    mutationFn: claimQuoteFn,
  });
};
