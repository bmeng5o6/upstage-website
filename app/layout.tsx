import type { Metadata } from "next";
import { DM_Sans, Playfair_Display, Manrope } from "next/font/google";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
})

export const metadata: Metadata = {
  title: "Upstage A Cappella",
  description:
    "University of Pennsylvania's premier a cappella group. All voice, all heart, no instruments needed.",
  openGraph: {
    title: "Upstage A Cappella",
    description: "University of Pennsylvania's premier a cappella group.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${playfair.variable} ${manrope.variable} h-full scroll-smooth`}
    >
      <body className="min-h-full flex flex-col antialiased">
        {children}
        {/* Injects the tracking script and reports route changes. It renders
            nothing and is inert outside Vercel, so local dev is unaffected. */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

