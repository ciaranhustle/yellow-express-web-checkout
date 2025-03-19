"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Container } from "@/components/Container/Container";
import { StepHeader } from "@/components/StepHeader/StepHeader";
import { StepNavButtons } from "@/components/StepNavButtons/StepNavButtons";
import { AddressAutocomplete } from "@/components/AddressAutocomplete/AddressAutocomplete";
import { DirectionsMap } from "@/components/DirectionsMap/DirectionsMap";
import { useCartContext } from "@/context/CartContext";
import { useEffect, useState } from "react";
import { Loader } from "@/components/Loader/Loader";

const WherePage = () => {
  const router = useRouter();
  const { state, dispatch, isLoading: isCartLoading } = useCartContext();
  const [isGoogleReady, setIsGoogleReady] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.google) {
        setIsGoogleReady(true);
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Redirect if required fields are missing
    if (!isCartLoading && (
      !state.type || 
      ((state.type === "Big & Bulky" || state.type === "Small Items") && !state.when?.date)
    )) {
      router.push("/");
    }
  }, [state, router, isCartLoading]);

  const nextDisabled =
    !state.where?.pickUpAddress || !state.where?.dropOffAddress;

  if (!isGoogleReady) {
    return <Loader />;
  }

  return (
    <Container className="px-0 pb-0">
      <StepHeader title="Where from, where to?" />
      <div className="flex flex-row w-full px-5 gap-2.5 items-center mb-5">
        <div className="flex flex-col gap-1 items-center h-full justify-center">
          <Image src="/startCircle.svg" alt="Start" width={24} height={24} />
          {Array(3)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="w-1 h-1 bg-navy rounded-full"></div>
            ))}
          <Image src="/finishCircle.svg" alt="Finish" width={24} height={24} />
        </div>
        <div className="flex-1 flex flex-col gap-1.5">
          <AddressAutocomplete
            placeholder="Pick up location..."
            value={state.where?.pickUpAddress ?? null}
            onChange={(addr) =>
              dispatch({ type: "SET_WHERE", payload: { pickUpAddress: addr } })
            }
          />
          <AddressAutocomplete
            placeholder="Drop off location..."
            value={state.where?.dropOffAddress ?? null}
            onChange={(addr) =>
              dispatch({ type: "SET_WHERE", payload: { dropOffAddress: addr } })
            }
          />
        </div>
      </div>
      <div className="flex-1 min-h-[400px] w-full relative overflow-hidden border-primary border-t-2 md:border-x-2 md:rounded ">
        <DirectionsMap
          startLocation={state.where?.pickUpAddress?.value?.geometry}
          endLocation={state.where?.dropOffAddress?.value?.geometry}
        />
        <div className="absolute bottom-5 w-full px-5">
          <StepNavButtons
            onNext={() => router.push("/what")}
            nextText="CONFIRM LOCATIONS"
            nextDisabled={nextDisabled}
          />
        </div>
      </div>
    </Container>
  );
};

export default WherePage;
