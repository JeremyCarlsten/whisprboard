import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Whisprboard – Feedback boards for your product",
  description:
    "Collect feature requests, bug reports, and ideas from your users. Prioritize what to build next with beautiful, embeddable feedback boards.",
  openGraph: {
    title: "Whisprboard – Feedback boards for your product",
    description:
      "Collect feature requests and prioritize what to build next.",
    siteName: "Whisprboard",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Whisprboard – Feedback boards for your product",
    description:
      "Collect feature requests and prioritize what to build next.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
