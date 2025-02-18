import React from "react";
import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export const Container: React.FC<Props> = ({ children, className = "" }) => (
  <div
    className={cn(
      "p-5 bg-white flex-1 w-full max-w-screen-md flex flex-col items-center overflow-hidden",
      className
    )}
  >
    {children}
  </div>
);
