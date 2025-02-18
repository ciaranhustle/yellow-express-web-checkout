"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { api } from "@/lib/api";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

interface PurchaseData {
  quoteId: string;
  couponCode?: string;
  paymentMethodId: string;
}

interface PurchaseResponse {
  success?: boolean;
}

export const usePurchase = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: PurchaseData) => {
      const response = await api("/api/order/purchase", {
        method: "POST",
        data: data,
      });
      return response?.data;
    },
    onSuccess: (data: PurchaseResponse) => {
      if (data.success) {
        toast.success("Order placed successfully!");
        router.push("/account/orders");
      } else {
        toast.error("Error processing payment. Please try again.");
      }
    },
    onError: (error: AxiosError) => {
      console.error("Error processing payment:", error);
      toast.error("Error processing payment. Please try again.");
    },
  });
};
