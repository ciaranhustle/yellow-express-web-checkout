"use client";

import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

interface ClaimJobProps {
  jobId: string;
}

export const useClaimJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ jobId }: ClaimJobProps) => {
      await api(`/api/job/${jobId}/claim`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job", "guest"] });
    },
    onError: () => {
      toast.error("Failed to claim job. Please try again.");
    },
  });
};
