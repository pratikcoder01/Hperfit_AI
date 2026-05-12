import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "HyperFitness — The Future Operating System for Modern Fitness",
    template: "%s | HyperFitness",
  },
  description:
    "HyperFitness is the next-generation enterprise fitness platform. Manage memberships, track workouts, monitor attendance, and analyze performance — all in one futuristic SaaS ecosystem.",
  keywords: [
    "fitness management",
    "gym software",
    "membership management",
    "workout tracking",
    "SaaS fitness platform",
    "enterprise fitness",
  ],
  authors: [{ name: "HyperFitness" }],
  creator: "HyperFitness",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://hyperfitness.io",
    title: "HyperFitness — The Future Operating System for Modern Fitness",
    description:
      "Enterprise-grade fitness management platform with AI-ready architecture.",
    siteName: "HyperFitness",
  },
  twitter: {
    card: "summary_large_image",
    title: "HyperFitness",
    description: "The Future Operating System for Modern Fitness",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0F19",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-[#0B0F19] text-white overflow-x-hidden">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
