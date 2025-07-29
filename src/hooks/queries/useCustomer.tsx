"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { FETCH_CUSTOMER } from "@/lib/constants";
import { AxiosError } from "axios";

export const useCustomer = () => {
  return useQuery<Customer, Error>({
    queryKey: [FETCH_CUSTOMER],
    queryFn: async () => {
      try {
        const response = await api("/api/customer");
        return response?.data?.customer ?? null;
      } catch (error) {
        // Handle 401 authentication errors gracefully
        if (error instanceof AxiosError && error.response?.status === 401) {
          return null;
        }
        // Re-throw other errors
        throw error;
      }
    },
    retry: false,
  });
};
