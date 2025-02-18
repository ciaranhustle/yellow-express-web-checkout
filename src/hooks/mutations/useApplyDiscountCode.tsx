"use client";

import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { useCartContext } from "@/context/CartContext";

export const useApplyDiscountCode = () => {
  const { dispatch } = useCartContext();

  return useMutation({
    mutationFn: async (data: { code: string }) => {
      const response = await api("/api/discount/code", {
        method: "POST",
        data: data,
      });
      return response?.data ?? null;
    },
    onSuccess: (data) => {
      if (!data?.discount) {
        toast.error(
          data?.message ?? "Error applying coupon. Please try again."
        );
      } else {
        dispatch({ type: "SET_COUPON_CODE", payload: data.discount.code });
        toast.success("Discount applied");
      }
    },
    onError: (error: AxiosError) => {
      console.error("Error applying coupon:", error);
      toast.error("Error applying coupon. Please try again.");
    },
  });
};
