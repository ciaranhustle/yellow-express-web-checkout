import Image from "next/image";
import { Container } from "@/components/Container/Container";
import { StepNavButtons } from "@/components/StepNavButtons/StepNavButtons";
import { useRouter } from "next/navigation";

interface SuccessPageProps {
  title: string;
  message: string;
  showAppStore?: boolean;
}

export const SuccessPage = ({ title, message, showAppStore = false }: SuccessPageProps) => {
  const router = useRouter();

  return (
    <Container className="px-0 pb-0">
      <div className="flex flex-col justify-between min-h-[calc(100vh-116px)] gap-24">
        <div className="px-5 pt-24 w-full flex flex-col items-center gap-4 text-center">
          <Image src="/greenTick.svg" width={60} height={60} alt="Success" />
          <p className="text-4xl font-bold">{title}</p>
          <p className="text-lg">{message}</p>
        </div>
        <div className="w-full flex flex-col items-center bg-accent rounded-t-[50px] py-10 px-5">
          {showAppStore && (
            <div className="flex flex-col items-center gap-12 py-6">
              <p className="text-white text-4xl font-bold text-center">
                Track your booking live with our app!
              </p>
              <div className="flex flex-col gap-2">
                <Image src="/appStore.jpg" alt="App Store" className="rounded-lg" width={220} height={65} />
                <Image src="/googlePlay.jpg" alt="Google Play" className="rounded-lg" width={220} height={65} />
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