"use client";

import React, { useState } from "react";
import { Elements, useStripe, useElements } from "@stripe/react-stripe-js";
import {
  loadStripe,
  StripeError,
  StripeElementsOptions,
} from "@stripe/stripe-js";
import { PaymentElement } from "@stripe/react-stripe-js";
import { STRIPE_PUBLIC_KEY } from "@/lib/secrets";
import { useCartContext } from "@/context/CartContext";

interface Props {
  onSuccess: (paymentMethodId: string) => void;
  onError: (error: Error | StripeError) => void;
}

// Define the options outside of the component to avoid re-renders
const stripeOptions: StripeElementsOptions = {
  mode: "setup" as const,
  paymentMethodCreation: "manual" as const,
  currency: "aud",
  appearance: {
    theme: "stripe",
  },
};

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY!);

const CardForm: React.FC<Props> = ({ onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const { state } = useCartContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);
    setErrorMessage(undefined);

    try {
      // Submit the form first as required by Stripe's latest API
      const { error: submitError } = await elements.submit();

      if (submitError) {
        setErrorMessage(submitError.message);
        onError(submitError);
        return;
      }

      // Create a PaymentMethod
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        elements,
        params: {
          type: "card",
          billing_details: {
            email: state.customerDetails?.email || "",
            name: state.customerDetails
              ? `${state.customerDetails.firstName || ""} ${
                  state.customerDetails.lastName || ""
                }`.trim()
              : "",
            phone: state.customerDetails?.mobile || "",
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
        onError(error);
        return;
      }

      if (paymentMethod) {
        // Pass the paymentMethodId to the parent component
        console.log({ paymentMethod });
        onSuccess(paymentMethod.id);
      }
    } catch (err) {
      const error = err as Error;
      setErrorMessage(error.message);
      onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="py-7 px-5">
      <PaymentElement />
      {errorMessage && <div className="text-red-500 mt-2">{errorMessage}</div>}
      <button
        type="submit"
        disabled={!stripe || isLoading}
        className="font-bold w-full text-2xl text-center bg-primary py-4 border-2 rounded mt-5 disabled:opacity-50"
      >
        {isLoading ? "Processing..." : "PAY NOW"}
      </button>
    </form>
  );
};

export const PaymentForm: React.FC<Props> = ({ onSuccess, onError }) => {
  const handleSuccess = (paymentMethodId: string) => {
    onSuccess(paymentMethodId);
  };

  const handleError = (error: Error | StripeError) => {
    onError(error);
  };

  return (
    <Elements stripe={stripePromise} options={stripeOptions}>
      <CardForm onSuccess={handleSuccess} onError={handleError} />
    </Elements>
  );
};
