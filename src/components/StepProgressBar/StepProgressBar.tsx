"use client";

import React from "react";
import { ProgressBar } from "../ProgressBar/ProgressBar";
import Image from "next/image";
import { usePathname } from 'next/navigation';

interface Props {
  step: number;
  totalSteps?: number;
}

export const StepProgressBar: React.FC<Props> = ({ step, totalSteps = 5 }) => {
  const pathname = usePathname();
  const isQuotePage = pathname.includes('/quote');
  const inProgressStep = step < totalSteps;
  const isFinalStep = step === totalSteps;
  const progressPercentage = Math.round((step / (totalSteps + 1)) * 100);

  return (
    <div className="w-full overflow-hidden">
      <div className="relative">
        {!isQuotePage && (
          <div 
            className="absolute inset-0 w-full h-full [backdrop-filter:blur(3px)] bg-white/20" 
          />
        )}
        <div
          className="flex flex-row justify-start items-center gap-1.5 text-black"
          style={{
            transform: `translateX(calc(${progressPercentage}% - ${
              isFinalStep ? "116" : "42"
            }px))`,
          }}
        >
          {isFinalStep && <p>Last step!</p>}
          <Image
            height={20}
            width={44}
            src="/yellowVan.png"
            alt="van"
            className="h-5 w-11"
          />
          {inProgressStep && <p>Almost there!</p>}
        </div>
      </div>
      <ProgressBar percentage={progressPercentage} />
    </div>
  );
};
