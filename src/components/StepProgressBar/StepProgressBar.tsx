"use client";

import React from "react";
import { ProgressBar } from "../ProgressBar/ProgressBar";
import Image from "next/image";

interface Props {
  step: number;
  totalSteps?: number;
}

export const StepProgressBar: React.FC<Props> = ({ step, totalSteps = 5 }) => {
  const inProgressStep = step < totalSteps;
  const isFinalStep = step === totalSteps;
  const progressPercentage = Math.round((step / (totalSteps + 1)) * 100);
  return (
    <div className="w-full overflow-hidden">
      <div
        className="flex flex-row justify-start items-center gap-1.5"
        style={{
          transform: `translateX(calc(${progressPercentage}% - ${
            isFinalStep ? "116" : "42"
          }px))`,
        }}
      >
        {isFinalStep && <p className="text-white">Last step!</p>}
        <Image
          height={20}
          width={44}
          src="/yellowVan.png"
          alt="van"
          className="h-5 w-11"
        />
        {inProgressStep && <p className="text-black">Almost there!</p>}
      </div>
      <ProgressBar percentage={progressPercentage} />
    </div>
  );
};
