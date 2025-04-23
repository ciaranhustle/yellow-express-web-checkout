"use client";

import { usePathname } from "next/navigation";
import { StepProgressBar } from "../StepProgressBar/StepProgressBar";

const STEP_PATHS = [
  "/when",
  "/where",
  "/what",
  "/details",
  "/quote",
  "/summary",
];

export const Footer = () => {
  const pathname = usePathname();

  const step = STEP_PATHS.indexOf(pathname) + 1;

  return (
    <div className="overflow-hidden w-screen">
      {pathname === "/" && (
        <footer className="text-black pt-3 pb-6 text-center bg-primary border-t-4 border-black">
          <a
            className="underline text-2xl font-bold leading-normal"
            href="https://yellowexpress.com.au/get-a-quote/"
            target="_blank"
          >
            Want a quote first?
          </a>
        </footer>
      )}
      {step >= 1 && (
        <div className="fixed bottom-0 left-0 right-0 overflow-hidden">
          <StepProgressBar totalSteps={STEP_PATHS.length} step={step} />
        </div>
      )}
    </div>
  );
};
