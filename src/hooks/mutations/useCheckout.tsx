"use client";

import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useCartContext } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface CheckoutData {
  paymentMethodId: string;
  quote: Quote;
  bookingAssistOption: BookingAssistOption;
}

interface CheckoutResponse {
  jobId: string;
  success: boolean;
}

export const useCheckout = () => {
  const router = useRouter();
  const { dispatch } = useCartContext();

  return useMutation({
    mutationFn: async (data: CheckoutData) => {
      const response = await api("/api/checkout", {
        method: "POST",
        data: data,
      });
      return response?.data as CheckoutResponse;
    },
    onSuccess: (data: CheckoutResponse) => {
      if (data.success) {
        dispatch({ type: "CLEAR_CART" });
        console.log({ data });
        console.log(`/success?bookingId=${data.jobId}`)
        router.push(`/success?bookingId=${data.jobId}`);
      } else {
        toast.error("Checkout failed. Please try again.");
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error("Checkout error:", error);
      const errorMessage = error?.response?.data?.error || "Checkout failed. Please try again.";
      toast.error(errorMessage);
    },
  });
};
