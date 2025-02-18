"use client";

import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { FETCH_CUSTOMER } from "@/lib/constants";

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api("/api/customer/logout", {
        method: "POST",
      });
      return response?.data?.loggedOut;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FETCH_CUSTOMER] });
      toast.success("Logged out successfully!");
    },
    onError: () => {
      toast.error("Logout failed. Please try again.");
    },
  });
};
