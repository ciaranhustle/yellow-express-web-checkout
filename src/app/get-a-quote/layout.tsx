import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get A Quote | Yellow Express",
  description:
    "Get a personalized quote for your transportation needs. Choose from our range of services and get competitive pricing for your journey.",
};

export default function GetAQuoteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
