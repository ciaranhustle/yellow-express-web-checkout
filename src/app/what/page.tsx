"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { Container } from "@/components/Container/Container";
import { StepHeader } from "@/components/StepHeader/StepHeader";
import { StepNavButtons } from "@/components/StepNavButtons/StepNavButtons";
import { cn } from "@/lib/utils";
import { useCartContext } from "@/context/CartContext";

interface FormValues {
  description: string;
}

const MIN_CHARACTERS = 30;

const WhatPage = () => {
  const router = useRouter();
  const { state, dispatch } = useCartContext();

  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      description: state.what ?? "",
    },
  });

  const nextDisabled = !!errors.description;

  const handleNextPress = (formData: FormValues) => {
    dispatch({ type: "SET_WHAT", payload: formData.description });
    router.push("/details");
  };

  const description = watch("description");

  return (
    <Container>
      <StepHeader title="What are we moving?" />
      <div className="w-full flex flex-col items-end gap-2.5">
        <div className="w-full">
          <Controller
            name="description"
            control={control}
            rules={{
              required: `Minimum ${MIN_CHARACTERS} characters are required`,
              minLength: {
                value: MIN_CHARACTERS,
                message: `Minimum ${MIN_CHARACTERS} characters are required`,
              },
            }}
            render={({ field }) => (
              <textarea
                id="description"
                placeholder="List out all the items you need help moving and as many details about the job as possible"
                {...field}
                className="border border-lightgrey rounded px-5 py-4 w-full bg-transparent text-lg"
                rows={8}
              />
            )}
          />
        </div>
        <p
          className={cn(
            "opacity-60 text-xs",
            errors.description && "text-red-500 opacity-100"
          )}
        >
          {errors.description?.message ??
            `Minimum ${MIN_CHARACTERS} characters`}
          {description && `: ${description.length}`}
        </p>
      </div>
      <StepNavButtons
        onNext={handleSubmit(handleNextPress)}
        nextDisabled={nextDisabled}
      />
    </Container>
  );
};

export default WhatPage;
