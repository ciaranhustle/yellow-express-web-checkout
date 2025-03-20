"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Container } from "@/components/Container/Container";
import { useCartContext } from "@/context/CartContext";
import { bookingTypeOptions } from "@/lib/constants";

const HomePage = () => {
  const router = useRouter();
  const { dispatch } = useCartContext();

  const handleOptionPress = (type: BookingType) => {
    dispatch({ type: "SET_TYPE", payload: type });
    if (type === "Something Obscure") {
      router.push("/where");
    } else {
      router.push("/when");
    }
  };

  return (
    <Container>
      <h1 className="text-black font-bold text-4xl">Instant Booking</h1>
      <p className="text-base mb-5">Choose an option to get started!</p>
      <div className="flex flex-col md:grid md:grid-cols-2 gap-2.5 md:gap-10 w-full">
        {bookingTypeOptions.map((option) => (
          <div
            key={option.type}
            className="bg-white border-b-8 border-primary rounded shadow-lg h-44 flex flex-row items-center pl-7 w-full overflow-hidden relative cursor-pointer hover:bg-accent hover:text-white"
            onClick={() => handleOptionPress(option.type)}
          >
            <div className="text-left flex flex-col gap-1.5 flex-1">
              <h3 className="font-bold text-[26px] leading-tight min-w-44">
                {option.type}
              </h3>
              <p className="text-sm leading-snug max-w-[170px] lg:max-w-60">
                {option.description}
              </p>
            </div>
            <div className="flex-1 flex flex-row justify-center">
              <Image
                src={option.imageSrc}
                alt={option.type}
                width={120}
                height={120}
                className="w-32"
              />
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default HomePage;
