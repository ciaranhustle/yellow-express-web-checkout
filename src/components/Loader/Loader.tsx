import React from "react";

interface Props {
  label?: string;
}

export const Loader: React.FC<Props> = ({ label }) => (
  <div className="h-full w-full flex flex-col gap-2 justify-center items-center">
    <div className="loader"></div>
    {label && <p className="text-black">{label}</p>}
  </div>
);
