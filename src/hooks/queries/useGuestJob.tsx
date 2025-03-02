import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useGuestJob = ({ jobId }: { jobId: string | null }) => {
  return useQuery({
    queryKey: ["job", "guest", jobId],
    queryFn: async () => {
      const response = await api(`/api/job/${jobId}/guest`);
      const job = response?.data ?? null;
      return job;
    },
    enabled: !!jobId,
  });
};