"use client";

import React from "react";
import { useCartContext } from "@/context/CartContext";

interface Props {
  title: string;
}

export const StepHeader: React.FC<Props> = ({ title }) => {
  const { state } = useCartContext();

  return (
    <div className="flex flex-col items-center mb-6 w-full relative px-4">
      <div className="absolute top-3 left-3"></div>
      <div className="flex flex-col gap-2.5 items-center">
        <p className="text-base font-bold text-center capitalize">
          {state.type} Instant Booking
        </p>
        <h1 className="text-black font-bold text-4xl text-center">{title}</h1>
      </div>
    </div>
  );
};
