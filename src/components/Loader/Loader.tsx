import React from "react";

interface Props {
  label?: string;
  className?: "loader" | "sm-loader";
}

export const Loader: React.FC<Props> = ({ label, className = "loader" }) => (
  <div className="flex-1 h-full w-full flex flex-col gap-2 justify-center items-center">
    <div className={className}></div>
    {label && <p className="text-black">{label}</p>}
  </div>
);
