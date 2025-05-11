"use client";

import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { useCartContext } from "@/context/CartContext";

interface DiscountResponse {
  coupon: Coupon;
  message?: string;
}

interface ErrorResponse {
  error: string;
}

export const useApplyDiscountCode = () => {
  const { dispatch } = useCartContext();

  return useMutation({
    mutationFn: async (data: { code: string; email?: string }) => {
      const response = await api("/api/discount/code", {
        method: "POST",
        data: data,
      });
      return response?.data as DiscountResponse;
    },
    onSuccess: (data) => {
      if (!data?.coupon) {
        toast.error(
          data?.message ?? "Error applying coupon. Please try again."
        );
      } else {
        dispatch({ type: "SET_COUPON", payload: data.coupon });
        toast.success("Discount applied successfully");
      }
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error("Error applying coupon:", error);
      toast.error(
        error.response?.data?.error ||
          "Error applying coupon. Please try again."
      );
    },
  });
};
