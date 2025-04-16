"use client";

import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

interface UpdateQuoteProps {
  quoteId: string;
}

export const useClaimQuote = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ quoteId }: UpdateQuoteProps) => {
      const response = await api(`/api/quote/${quoteId}/claim`);
      return response?.data ?? null;
    },
    onSuccess: () => {
      router.push("/summary");
    },
    onError: (error: AxiosError<{ success: boolean; error: string }>) => {
      const errorMessage =
        error.response?.data?.error ??
        "Failed to claim quote. Please try again or contact us for help.";
      toast.error(errorMessage);
      if (!error.response?.data?.success) {
        router.back();
      }
    },
  });
};
