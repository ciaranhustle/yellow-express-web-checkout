import Image from "next/image";
import { Container } from "@/components/Container/Container";
import { StepNavButtons } from "@/components/StepNavButtons/StepNavButtons";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import confetti from "canvas-confetti";

interface SuccessPageProps {
  title: string;
  message: string;
  subMessage?: string;
  showAppStore?: boolean;
  bookingId?: string;
}

export const SuccessPage = ({
  title,
  subMessage,
  message,
  showAppStore = false,
  bookingId,
}: SuccessPageProps) => {
  const router = useRouter();

  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  const handleClaimClick = () => {
    if (bookingId) {
      router.push(`/claim?reference=${bookingId}`);
    }
  };

  return (
    <Container className="px-0 pb-0">
      <div className="flex flex-col justify-between min-h-[calc(100vh-116px)] gap-24">
        <div className="px-24 pt-24 w-full flex flex-col items-center gap-4 text-center">
          <Image src="/greenTick.svg" width={60} height={60} alt="Success" />
          <p className="text-4xl font-bold">{title}</p>

          <p className="text-lg">{message}</p>
          {subMessage && <p className="text-lg opacity-50">{subMessage}</p>}
        </div>
        <div className="w-full flex flex-col items-center bg-accent rounded-t-[50px] py-10 px-5">
          {bookingId && (
            <div className="flex flex-col items-center gap-12 py-6">
              <p className="text-white text-4xl font-bold text-center">
                Claim your booking to track it live!
              </p>
              <button
                onClick={handleClaimClick}
                className="w-full text-center font-bold text-2xl py-3 bg-primary border-2 border-black rounded md:flex-1 capitalize"
              >
                CLAIM BOOKING
              </button>
            </div>
          )}
          {showAppStore && !bookingId && (
            <div className="flex flex-col items-center gap-12 py-6">
              <p className="text-white text-4xl font-bold text-center">
                Track your booking live with our app!
              </p>
              <div className="flex flex-col gap-2">
                <a
                  href="https://apps.apple.com/au/app/yellow-express/id1519252013"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/appStore2.jpg"
                    alt="App Store"
                    className="rounded-lg cursor-pointer"
                    width={220}
                    height={65}
                  />
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=com.yellowexpress.app&pli=1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/playStore.jpg"
                    alt="Google Play"
                    className="rounded-lg cursor-pointer"
                    width={220}
                    height={65}
                  />
                </a>
              </div>
            </div>
          )}
          <StepNavButtons
            hideNext
            previousWhite
            previousText="GO HOME"
            onPrevious={() => router.push("/")}
          />
        </div>
      </div>
    </Container>
  );
};
