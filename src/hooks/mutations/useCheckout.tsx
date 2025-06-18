"use client";

import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useCartContext } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { sendGTMEvent } from "@next/third-parties/google";
import CryptoJS from "crypto-js";

const hashData = (data?: string) => {
  if (!data) return undefined;
  const normalizedData = String(data).trim().toLowerCase();
  return CryptoJS.SHA256(normalizedData).toString(CryptoJS.enc.Hex);
};

const normalizePhoneNumber = (phone?: string) => {
  if (!phone) return undefined;
  let cleaned = phone.replace(/\D/g, "");
  if (!cleaned.startsWith("+")) {
    if (cleaned.startsWith("0")) {
      cleaned = "61" + cleaned.substring(1);
    }
    if (!cleaned.startsWith("+")) {
      cleaned = "+" + cleaned;
    }
  }
  return cleaned;
};

interface CheckoutData {
  paymentMethodId: string;
  quote: Quote;
  bookingAssistOption: BookingAssistOption;
  couponCode?: string;
  upsellApplied?: string;
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
    onSuccess: (data: CheckoutResponse, variables: CheckoutData) => {
      if (data.success) {
        sendGTMEvent({
          event: "purchase",
          ecommerce: {
            transaction_id: data.jobId,
            value: variables.quote.price,
            currency: "AUD",
            items: [
              {
                item_id:
                  `${variables.quote.bookingDetails.bookingType}_${variables.upsellApplied}`
                    .toLowerCase()
                    .replace(" ", "_"),
                item_name: `${variables.quote.bookingDetails.bookingType} - ${variables.upsellApplied}`,
                price: variables.quote.price,
                quantity: 1,
              },
            ],
          },
          user_data: {
            ...(variables.quote.customerDetails?.firstName && {
              first_name: hashData(variables.quote.customerDetails?.firstName),
            }),
            ...(variables.quote.customerDetails?.lastName && {
              last_name: hashData(variables.quote.customerDetails?.lastName),
            }),
            ...(variables.quote.customerDetails?.email && {
              email: hashData(variables.quote.customerDetails?.email),
            }),
            ...(variables.quote.customerDetails?.mobile && {
              phone_number: hashData(
                normalizePhoneNumber(variables.quote.customerDetails?.mobile)
              ),
            }),
          },
        });
        dispatch({ type: "CLEAR_CART" });
        dispatch({ type: "CLEAR_COUPON" });
        router.push(`/success?bookingId=${data.jobId}`);
      } else {
        toast.error("Checkout failed. Please try again.");
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error("Checkout error:", error);
      const errorMessage =
        error?.response?.data?.error || "Checkout failed. Please try again.";
      toast.error(errorMessage);
    },
  });
};
