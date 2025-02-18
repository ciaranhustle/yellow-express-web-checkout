"use client";

import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { FETCH_CUSTOMER } from "@/lib/constants";

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (details: {
      email: string;
      firstName: string;
      lastName: string;
      mobile: string;
      password: string;
    }) => {
      const response = await api("/api/customer/register", {
        method: "POST",
        data: details,
      });
      return response?.data?.customer;
    },
    onSuccess: (customer) => {
      if (customer) {
        queryClient.invalidateQueries({ queryKey: [FETCH_CUSTOMER] });
        toast.success("Account created successfully!");
      } else {
        toast.error("Registration failed. Please try again.");
      }
    },
    onError: () => {
      toast.error("Registration failed. Please try again.");
    },
  });
};
