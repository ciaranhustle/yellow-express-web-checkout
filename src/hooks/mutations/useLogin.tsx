"use client";

import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { FETCH_CUSTOMER } from "@/lib/constants";

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await api("/api/customer/login", {
        method: "POST",
        data: credentials,
      });
      return response?.data?.customer;
    },
    onSuccess: (customer) => {
      if (customer) {
        queryClient.invalidateQueries({ queryKey: [FETCH_CUSTOMER] });
        toast.success("Logged in successfully!");
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
    },
    onError: () => {
      toast.error("Login failed. Please try again.");
    },
  });
};
