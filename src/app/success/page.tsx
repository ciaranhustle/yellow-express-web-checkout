"use client";

import Image from "next/image";
import { Container } from "@/components/Container/Container";
import { StepNavButtons } from "@/components/StepNavButtons/StepNavButtons";
import { useRouter } from "next/navigation";

const SuccessPage = () => {
  const router = useRouter();

  return (
    <Container className="px-0 pb-0">
      <div className="px-5 mt-7 w-full flex flex-col items-center gap-4">
        <Image src="/greenTick.svg" width={60} height={60} alt="Success" />
        <p className="text-4xl font-bold">Booking Confirmed!</p>
        <p className="text-lg">A member of our team will be in touch shortly to confirm your booking.</p>
      </div>
      <div className="mt-14 flex-1 w-full flex flex-col items-center bg-accent relative rounded-t-[50px] py-10 px-5">
        <div className="flex flex-col items-center gap-12 py-6">
          <p className="text-white text-4xl font-bold">
            Track your booking live with our app!
          </p>
          <div className="flex flex-col gap-2">
            <Image src="/appStore.jpg" alt="App Store" className="rounded-lg" width={220} height={65} />
            <Image src="/googlePlay.jpg" alt="Google Play" className="rounded-lg" width={220} height={65} />
          </div>
        </div>
        <StepNavButtons
          hideNext
          previousWhite
          previousText="GO HOME"
          onPrevious={() => router.push("/")}
        />
      </div>
    </Container>
  );
};

export default SuccessPage;
