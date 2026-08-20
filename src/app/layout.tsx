import type { Metadata } from "next";
import { Roboto, Playfair_Display } from "next/font/google";
import { Phone } from "lucide-react";
import Loader from "@/components/Loader";
import OnboardingModal from "@/components/OnboardingModal";
import "./globals.css";

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6" fill="currentColor">
      <path d="M20.52 3.48A11.64 11.64 0 0 0 12.02 0C5.48 0 .14 5.31.14 11.85c0 2.09.55 4.13 1.6 5.93L.06 24l6.4-1.66a11.9 11.9 0 0 0 5.56 1.65h.01c6.54 0 11.88-5.31 11.88-11.85 0-3.17-1.24-6.15-3.39-8.37ZM12.02 21.6c-1.79 0-3.55-.48-5.08-1.39l-.36-.22-3.8.99 1.02-3.7-.24-.38A9.75 9.75 0 0 1 2.22 11.85C2.22 6.77 6.38 2.62 12.02 2.62c5.65 0 10.25 4.15 10.25 9.23 0 5.08-4.6 9.23-10.25 9.23Zm5.64-6.9c-.31-.16-1.81-.89-2.1-1-.28-.12-.49-.16-.7.16-.2.31-.78 1-.96 1.2-.18.16-.35.18-.66.06-.3-.16-1.28-.47-2.43-1.5-.9-.81-1.5-1.8-1.68-2.1-.18-.31-.02-.47.14-.62.14-.14.31-.35.46-.53.15-.17.2-.29.3-.48.1-.2.05-.37-.02-.52-.08-.16-.7-1.71-.96-2.34-.26-.62-.52-.53-.7-.54l-.6-.01c-.2 0-.53.08-.81.38-.28.31-1.07 1.05-1.07 2.56 0 1.52 1.1 2.96 1.26 3.17.16.2 2.17 3.31 5.26 4.64.74.32 1.32.51 1.77.66.74.24 1.42.2 1.95.13.6-.09 1.81-.74 2.07-1.46.25-.71.25-1.33.17-1.46-.08-.13-.28-.2-.58-.36Z" />
    </svg>
  );
}

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Drishyam Optical | Premium Luxury Eyewear",
  description: "Discover premium, minimal, and sophisticated eyewear designed around your style, your face, and your vision. Try virtually now.",
  openGraph: {
    title: "Drishyam Optical | Premium Luxury Eyewear",
    description: "Premium eyewear designed around your style, your face, and your vision.",
    type: "website",
    locale: "en_US",
    siteName: "Drishyam Optical",
  },
};

import { AppProvider } from "@/context/AppContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const whatsappNumber = "917999965453";

  return (
    <html
      lang="en"
      className={`${roboto.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-[#111111] selection:bg-[#fafaf9] selection:text-black">
        <Loader />
        <AppProvider>
          {children}

          <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3">
            <a
              href={`https://wa.me/${whatsappNumber}?text=Hi%20Drishyam%20Optical%2C%20I%20want%20to%20book%20a%20frame%20consultation.`}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Chat on WhatsApp"
              className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_18px_35px_rgba(37,211,102,0.38)] transition-transform duration-200 hover:scale-105"
            >
              <WhatsAppIcon />
            </a>

            <a
              href="tel:+919876543210"
              aria-label="Call Drishyam Optical"
              className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1F3A5F] text-white shadow-[0_18px_35px_rgba(31,58,95,0.32)] transition-transform duration-200 hover:scale-105"
            >
              <Phone className="h-6 w-6" />
            </a>
          </div>

          <OnboardingModal />
        </AppProvider>
      </body>
    </html>
  );
}
