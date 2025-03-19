"use client";

import React from "react";

interface Props {
  percentage: number;
}

export const ProgressBar: React.FC<Props> = ({ percentage }) => (
  <div className="bg-white">
    <div className="w-full bg-primary/30">
      <div className="bg-primary h-2" style={{ width: `${percentage}%` }}></div>
    </div>
  </div>
);
