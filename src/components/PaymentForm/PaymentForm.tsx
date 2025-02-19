"use client";

import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { PaymentElement } from "@stripe/react-stripe-js";
import { STRIPE_PUBLIC_KEY } from "@/lib/secrets";

interface Props {
  onSuccess: () => void;
  onError: () => void;
}

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY!);

const CardForm: React.FC<Props> = ({ onSuccess, onError }) => {
  const handleSubmit = async () => {
    console.log("submit");
  };
  return (
    <form onSubmit={handleSubmit} className="py-7 px-5">
      <PaymentElement />
      <button
        type="submit"
        className="font-bold w-full text-2xl text-center bg-primary py-4 border-2 rounded mt-5"
      >
        PAY NOW
      </button>
    </form>
  );
};

export const PaymentForm: React.FC<Props> = ({ onSuccess, onError }) => {
  return (
    <Elements stripe={stripePromise}>
      <CardForm onSuccess={onSuccess} onError={onError} />
    </Elements>
  );
};
