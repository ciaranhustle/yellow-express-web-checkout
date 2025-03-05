import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useCartContext } from "@/context/CartContext";

export const useCreateEnquiry = () => {
  const { state } = useCartContext();

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
  });
}; 