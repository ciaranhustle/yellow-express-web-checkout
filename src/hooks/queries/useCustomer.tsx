"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { FETCH_CUSTOMER } from "@/lib/constants";

export const useCustomer = () => {
  return useQuery<Customer, Error>({
    queryKey: [FETCH_CUSTOMER],
    queryFn: async () => {
      const response = await api("/api/customer");
      return response?.data?.customer ?? null;
    },
    // refetchInterval: 10 * 60 * 1000,
    retry: false,
    // enabled: false,
  });
};
