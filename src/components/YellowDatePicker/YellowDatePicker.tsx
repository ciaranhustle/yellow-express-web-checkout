"use client";

import React, { forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Image from "next/image";

interface Props {
  date: Date | null;
  setDate: (date: Date | null) => void;
  minDate?: Date;
}

interface CustomInputProps {
  value?: string;
  onClick?: () => void;
  className?: string;
}

const CustomInput = forwardRef<HTMLButtonElement, CustomInputProps>(
  ({ value, onClick, className }, ref) => (
    <button
      className={cn(
        "w-full p-4 flex flex-row justify-between items-center rounded border border-black text-base font-bold",
        className
      )}
      onClick={onClick}
      ref={ref}
    >
      <span>
        {value ? format(value, "EEEE, d MMMM yyyy") : "Select a date"}
      </span>
      <Image
        src="/calendar.svg"
        alt="calendar"
        width={20}
        height={20}
        className="h-5 w-5"
      />
    </button>
  )
);

CustomInput.displayName = "CustomInput"; // Add a display name for debugging

export const YellowDatePicker: React.FC<Props> = ({
  date,
  setDate,
  minDate,
}) => {
  return (
    <DatePicker
      selected={date}
      onChange={(date: Date | null) => setDate(date)}
      dateFormat="yyyy-MM-dd"
      placeholderText="Select a date"
      minDate={minDate}
      customInput={<CustomInput />}
      wrapperClassName="w-full"
    />
  );
};
