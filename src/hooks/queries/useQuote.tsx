import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useQuote = ({ quoteId }: { quoteId: string | null }) => {
  return useQuery({
    queryKey: ["quote", quoteId],
    queryFn: async () => {
      const response = await api(`/api/quote/${quoteId}`);
      return response?.data?.quote ?? null;
    },
    enabled: !!quoteId,
  });
};
