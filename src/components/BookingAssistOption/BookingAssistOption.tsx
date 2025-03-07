import { cn } from "@/lib/utils";
import React from "react";

interface BookingAssistOptionProps {
  option: BookingAssistOption;
  fullPrice: number;
  price: number;
  description: string;
  selectedOption: BookingAssistOption | null;
  setSelectedOption: (value: BookingAssistOption) => void;
  hint?: string;
}

export const BookingAssistOption: React.FC<BookingAssistOptionProps> = ({
  option,
  fullPrice,
  price,
  description,
  selectedOption,
  setSelectedOption,
  hint,
}) => {
  const isSelected = option === selectedOption;
  return (
    <div
      className={cn(
        "flex-1 bg-white rounded shadow-lg px-5 pt-8 pb-5 flex flex-col items-center text-black relative",
        isSelected && "bg-accent text-white"
      )}
      onClick={() => setSelectedOption(option)}
    >
      {hint && (
        <div
          className={cn(
            "absolute -top-[18px] bg-accent text-white px-3 py-2 rounded-[40px] font-bold text-sm",
            isSelected && "bg-primary text-black"
          )}
        >
          {hint}
        </div>
      )}
      <p className="font-bold text-3xl mb-2">{option}</p>
      <p className="font-bold red-strikethrough opacity-50">${fullPrice}</p>
      <p className="font-black text-3xl">${price}</p>
      <p className="text-sm mt-3 mb-9">{description}</p>
      <div className="flex-1 flex flex-col justify-end w-full">
        <button
          className={cn(
            "bg-primary font-bold py-3 rounded-[40px] w-full",
            isSelected && "bg-white text-black"
          )}
        >
          {isSelected ? "Selected" : "Select"}
        </button>
      </div>
    </div>
  );
};
