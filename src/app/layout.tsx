import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";
import { AuthContextProvider } from "@/context/AuthContext";
import { CartContextProvider } from "@/context/CartContext";
import { ToastContainer } from "react-toastify";
import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import Script from "next/script";
import { GMAPS_API_KEY } from "@/lib/secrets";

const gtWalsheimPro = localFont({
  src: [
    {
      path: "./fonts/GTWalsheimPro-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/GTWalsheimPro-LightOblique.woff2",
      weight: "300",
      style: "oblique",
    },
    {
      path: "./fonts/GTWalsheimPro-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/GTWalsheimPro-RegularOblique.woff2",
      weight: "400",
      style: "oblique",
    },
    {
      path: "./fonts/GTWalsheimPro-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/GTWalsheimPro-MediumOblique.woff2",
      weight: "500",
      style: "oblique",
    },
    {
      path: "./fonts/GTWalsheimPro-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/GTWalsheimPro-BoldOblique.woff2",
      weight: "700",
      style: "oblique",
    },
    {
      path: "./fonts/GTWalsheimPro-UltraBold.woff2",
      weight: "900",
      style: "normal",
    },
    {
      path: "./fonts/GTWalsheimPro-UltraBoldOblique.woff2",
      weight: "900",
      style: "oblique",
    },
  ],
  variable: "--font-gt-walsheim-pro",
});

export const metadata: Metadata = {
  title: "Yellow Express",
  description:
    "Get large items or a whole apartment from A2B and get it done FAST! Book your man & a big van on demand now.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${GMAPS_API_KEY}&libraries=places`}
          strategy="lazyOnload"
        />
      </head>
      <body
        className={`${gtWalsheimPro.variable} min-h-screen flex flex-col items-center antialiased`}
      >
        <QueryProvider>
          <AuthContextProvider>
            <CartContextProvider>
              <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar
                closeOnClick
                toastClassName="customToast"
                pauseOnHover={false}
                limit={1}
              />
              <Header />
              <main className="flex-1 flex flex-col w-screen bg-white items-center overflow-hidden">
                {children}
              </main>
              <Footer />
            </CartContextProvider>
          </AuthContextProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
