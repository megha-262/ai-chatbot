import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HealthBot AI - Your 24/7 AI Health Companion",
  description: "AI-powered public health chatbot providing verified medical information, emergency assistance, and personalized health guidance. Available 24/7 with multilingual support.",
  keywords: "AI health chatbot, medical information, emergency assistance, health guidance, telemedicine, public health",
  authors: [{ name: "HealthBot AI Team" }],
  creator: "HealthBot AI",
  publisher: "HealthBot AI",
  robots: "index, follow",
  openGraph: {
    title: "HealthBot AI - Your 24/7 AI Health Companion",
    description: "AI-powered public health chatbot providing verified medical information, emergency assistance, and personalized health guidance.",
    type: "website",
    locale: "en_US",
    siteName: "HealthBot AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "HealthBot AI - Your 24/7 AI Health Companion",
    description: "AI-powered public health chatbot providing verified medical information, emergency assistance, and personalized health guidance.",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Navigation />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
