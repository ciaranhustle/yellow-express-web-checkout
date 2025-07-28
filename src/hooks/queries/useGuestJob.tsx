"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useGuestJob = ({ jobId }: { jobId: string | null }) => {
  return useQuery({
    queryKey: ["job", "guest", jobId],
    queryFn: async () => {
      const response = await api(`/api/job/${jobId}/guest`);
      return response?.data?.job ?? null;
    },
    enabled: !!jobId,
    retry: false,
  });
};
