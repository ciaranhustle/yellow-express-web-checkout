"use client";

import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useCartContext } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export const useCreateEnquiry = () => {
  const { state, dispatch } = useCartContext();
  const router = useRouter();
  const bookingType = state.type;
  const whereDetails = state.where;
  const whatDetails = state.what;
  const bookingDetails = {
    bookingType,
    ...whereDetails,
    description: whatDetails,
  };
  const customerDetails = state.customerDetails;

  return useMutation({
    mutationFn: async () => {
      const response = await api(`/api/enquiry`, {
        method: "POST",
        data: {
          bookingDetails,
          customerDetails,
        },
      });
      return response?.data?.enquiry ?? null;
    },
    onSuccess: () => {
      dispatch({ type: "CLEAR_CART" });
      router.push("/enquiry-received");
    },
    onError: () => {
      toast.error(
        "Failed to create enquiry. Please try again or contact us for help."
      );
    },
  });
}; 