"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Loader } from "../Loader/Loader";

interface Props {
  onNext?: () => void;
  nextText?: string;
  nextDisabled?: boolean;
  nextLoading?: boolean;
  hideNext?: boolean;
  onPrevious?: () => void;
  previousText?: string;
  previousWhite?: boolean;
}

export const StepNavButtons: React.FC<Props> = ({
  onNext,
  nextText = "NEXT",
  nextDisabled,
  nextLoading,
  hideNext = false,
  onPrevious,
  previousText = "PREVIOUS",
  previousWhite = false,
}) => {
  const router = useRouter();

  return (
    <div className="flex-1 w-full flex flex-col justify-end mt-10">
      <div className="mt-2.5 mb-10 w-full flex flex-col md:flex-row-reverse gap-2.5 md:gap-10">
        {!hideNext && (
          <button
            className={cn(
              "text-center font-bold text-2xl py-3 bg-primary border-2 border-black rounded md:flex-1 capitalize",
              nextDisabled && "opacity-50"
            )}
            disabled={nextDisabled || nextLoading}
            onClick={onNext}
          >
            {nextLoading ? <Loader className="sm-loader" /> : nextText}
          </button>
        )}
        <button
          className={cn(
            "text-center font-bold text-lg py-3 border-2 border-black rounded md:flex-1 capitalize bg-white",
            previousWhite && "border-white text-white bg-transparent"
          )}
          onClick={() => (onPrevious ? onPrevious() : router.back())}
        >
          {previousText}
        </button>
      </div>
    </div>
  );
};
