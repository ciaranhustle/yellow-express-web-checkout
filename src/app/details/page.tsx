"use client";

import { Container } from "@/components/Container/Container";
import { StepHeader } from "@/components/StepHeader/StepHeader";
import { StepNavButtons } from "@/components/StepNavButtons/StepNavButtons";
import { useForm } from "react-hook-form";
import Input from "@/components/Input/Input";
import { useRouter } from "next/navigation";
import { useCartContext } from "@/context/CartContext";
import { isMobile, isEmail } from "@/lib/validation";
import { useCreateQuote } from "@/hooks/mutations/useCreateQuote";
import { useCreateEnquiry } from "@/hooks/mutations/useCreateEnquiry";
import { toast } from "react-toastify";
import { useEffect } from "react";

const WhatPage = () => {
  const router = useRouter();
  const { state, dispatch } = useCartContext();
  const customerDetails = state.customerDetails;
  const { mutate: createQuote, isPending: isCreatingQuote } = useCreateQuote();
  const { mutate: createEnquiry, isPending: isCreatingEnquiry, isSuccess: isEnquirySuccess } = useCreateEnquiry();

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<CustomerDetails>({
    defaultValues: {
      firstName: customerDetails?.firstName ?? "",
      lastName: customerDetails?.lastName ?? "",
      mobile: customerDetails?.mobile ?? "",
      email: customerDetails?.email ?? "",
    },
  });

  const nextDisabled = errors && Object.keys(errors).length > 0;

  const handleNextPress = async (formData: CustomerDetails) => {
    dispatch({ type: "SET_CUSTOMER_DETAILS", payload: formData });

    if (state.type === "Fragile & Sensitive" || state.type === "Something Obscure") {
      createEnquiry();
    } else {
      createQuote(undefined, {
        onSuccess: (quote) => {
          dispatch({ type: "SET_QUOTE_ID", payload: quote._id });
          router.push("/quote");
        },
        onError: () => {
          toast.error(
            "Failed to create quote. Please try again or contact us for help."
          );
        },
      });
    }
  };

  useEffect(() => {
    // If the user navigates to this page without selecting a type, redirect to the home page
    if (!state.type && !isCreatingEnquiry && !isCreatingQuote && !isEnquirySuccess) {
      router.push("/");
    }
  }, [state.type, router, isCreatingEnquiry, isCreatingQuote, isEnquirySuccess]);

  return (
    <Container>
      <StepHeader title="Enter your details to proceed" />
      <div className="w-full flex flex-col gap-2.5">
        <Input
          label="First name*"
          placeholder="Enter your first name"
          {...register("firstName", { required: "First name is required" })}
          errors={errors}
        />
        <Input
          label="Last name*"
          placeholder="Enter your last name"
          {...register("lastName", { required: "Last name is required" })}
          errors={errors}
        />
        <Input
          label="Phone number*"
          placeholder="Enter your phone number"
          {...register("mobile", {
            required: "Phone number is required",
            validate: (value) => isMobile(value) || "Phone number is invalid",
          })}
          errors={errors}
        />
        <Input
          label="Email address*"
          placeholder="Enter your email address"
          {...register("email", {
            required: "Email address is required",
            validate: (value) => isEmail(value) || "Email address is invalid",
          })}
          errors={errors}
        />
      </div>
      <StepNavButtons
        onNext={handleSubmit(handleNextPress)}
        nextDisabled={nextDisabled}
        nextLoading={isCreatingQuote || isCreatingEnquiry}
      />
    </Container>
  );
};
export default WhatPage;
