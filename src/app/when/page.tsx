"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Container } from "@/components/Container/Container";
import { StepHeader } from "@/components/StepHeader/StepHeader";
import { YellowDatePicker } from "@/components/YellowDatePicker/YellowDatePicker";
import { StepNavButtons } from "@/components/StepNavButtons/StepNavButtons";
import { addDays } from "date-fns";
import { cn } from "@/lib/utils";
import { useCartContext } from "@/context/CartContext";
import { bookingTimeOptions } from "@/lib/constants";
import { useEffect } from "react";

const WhenPage = () => {
  const router = useRouter();
  const { state, dispatch, isLoading: isCartLoading } = useCartContext();

  // Check if current time is after 6:00 PM
  const isAfterCutoff = () => {
    const now = new Date();
    return now.getHours() >= 18;
  };

  useEffect(() => {
    // Redirect if we skipped the 1st step
    if (!isCartLoading && !state.type) {
      router.push("/");
    }
  }, [state.type, router, isCartLoading]);

  // Set schedule as default if after cutoff time
  useEffect(() => {
    if (isAfterCutoff() && (!state.when || state.when.isToday)) {
      dispatch({
        type: "SET_WHEN",
        payload: { isToday: false },
      });
    }
  }, [dispatch, state.when]);

  const handleNextPress = () => {
    router.push("/where");
  };

  const nextDisabled =
    !state.when ||
    (!state.when.isToday && (!state.when.date || !state.when.time));

  return (
    <Container>
      <StepHeader title="When is your booking for?" />
      <div className="w-full flex flex-col items-center">
        <div className="w-full flex flex-col md:flex-row gap-2.5 md:gap-10 mb-4">
          <BookingDateOption
            title="Today"
            // description="Need us ASAP? Choose this option to skip the queue."
            imageSrc={
              state.when?.isToday
                ? "/lightning-white.svg"
                : "/lightning.svg"
            }
            isSelected={!!state.when?.isToday}
            onClick={() =>
              dispatch({
                type: "SET_WHEN",
                payload: { isToday: true, date: null, time: null },
              })
            }
            disabled={isAfterCutoff()}
            disabledMessage="Unavailable after 5:30pm"
          />
          <BookingDateOption
            title="Schedule"
            // description="Not in a huge rush? Choose this option to book in and save $$"
            imageSrc={
              state.when?.isToday ? "/scheduleBlack.svg" : "/scheduleWhite.svg"
            }
            isSelected={!state.when?.isToday}
            onClick={() =>
              dispatch({
                type: "SET_WHEN",
                payload: { isToday: false },
              })
            }
          />
        </div>

        {!state.when?.isToday && (
          <div className="w-full flex flex-col gap-5">
            <div className="w-full flex flex-col items-start">
              <h3 className="text-2xl font-bold mb-1">Choose a date</h3>
              <YellowDatePicker
                date={state.when?.date ? new Date(state.when.date) : null}
                setDate={(value) =>
                  dispatch({
                    type: "SET_WHEN",
                    payload: { date: value?.toISOString() },
                  })
                }
                minDate={addDays(new Date(), 1)}
              />
            </div>
            <div className="w-full flex flex-col items-start">
              <h3 className="text-2xl font-bold mb-1">What pick up time works best for you?</h3>
              <div className="w-full flex flex-col gap-2.5">
                {bookingTimeOptions.map((option) => (
                  <button
                    key={option.time}
                    className={cn(
                      "w-full p-4 flex flex-row justify-between items-center rounded border border-black text-base font-bold",
                      state.when?.time === option.time && "bg-accent text-white"
                    )}
                    onClick={() =>
                      dispatch({
                        type: "SET_WHEN",
                        payload: { time: option.time },
                      })
                    }
                  >
                    <span>{option.time}</span>
                    <span className="font-normal">{option.range}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <StepNavButtons onNext={handleNextPress} nextDisabled={nextDisabled} />
    </Container>
  );
};

export default WhenPage;

interface BookingDateOptionProps {
  title: string;
  // description: string;
  imageSrc: string;
  onClick: () => void;
  isSelected: boolean;
  disabled?: boolean;
  disabledMessage?: string;
}

const BookingDateOption: React.FC<BookingDateOptionProps> = ({
  title,
  // description,
  imageSrc,
  onClick,
  isSelected,
  disabled,
  disabledMessage,
}) => (
  <div
    className={cn(
      "px-5 py-3 bg-white border-b-8 border-primary rounded shadow-lg flex flex-row items-center w-full overflow-hidden relative cursor-pointer",
      isSelected && "bg-accent text-white"
    )}
    onClick={disabled ? undefined : onClick}
  >
    <div className="text-left flex flex-col max-w-52">
      <h3 className="font-bold text-[26px] leading-snug">{title}</h3>
      {/* <p className="text-sm leading-snug">{description}</p> */}
    </div>
    <div className="flex-1 flex flex-row justify-end items-center">
      <Image src={imageSrc} alt="" className="h-12" width={48} height={48} />
    </div>
    {disabled && (
      <>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[3px]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white px-4 py-2 rounded-[4px]">
            <p className="text-black font-bold">{disabledMessage}</p>
          </div>
        </div>
      </>
    )}
  </div>
);
