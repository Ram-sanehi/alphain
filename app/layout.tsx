import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/motion/smooth-scroll";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FloatingConsultationAction } from "@/components/layout/floating-action";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

export const metadata: Metadata = {
  title: "Alpha Investment Management | SEBI Registered Investment Advisor, Pune",
  description:
    "Bespoke private wealth management, disciplined portfolio advisory, and capital stewardship for families and institutions. SEBI Registered Investment Advisor, Pune. Established 2019.",
  keywords: [
    "SEBI Registered Investment Advisor",
    "Wealth Management Pune",
    "Fiduciary Financial Advisor",
    "Portfolio Management India",
    "Alpha Investment Management",
  ],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable} font-sans antialiased`}>
      <body
        className={`${inter.variable} ${cormorant.variable} bg-ink text-slate-100 font-sans selection:bg-gold selection:text-ink min-h-screen flex flex-col justify-between`}
        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
      >
        <SmoothScrollProvider>
          <Navbar />
          <div className="flex-grow">{children}</div>
          <Footer />
          <FloatingConsultationAction />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
