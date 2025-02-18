import React, { forwardRef } from "react";
import { FieldValues, type FieldErrors } from "react-hook-form";
import { cn } from "@/lib/utils";

interface Props {
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
  labelClassName?: string;
  type?: string;
  optional?: boolean;
  errors?: FieldErrors<FieldValues>;
}

const Input: React.FC<Props> = forwardRef<HTMLInputElement, Props>(
  (
    {
      name,
      label = "",
      placeholder = "",
      type = "text",
      className = "",
      labelClassName = "",
      errors,
      ...props
    },
    ref
  ) => {
    const errorMessage = errors?.[name]?.message as string | undefined;

    return (
      <div className="flex w-full flex-col text-start">
        {label && (
          <label
            htmlFor={name}
            className={cn("mb-1 font-bold", labelClassName)}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={name}
          name={name}
          placeholder={placeholder}
          type={type}
          {...props}
          className={cn(
            "border border-lightgrey rounded px-5 py-3 w-full bg-transparent",
            className
          )}
        />
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
