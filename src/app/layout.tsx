import type { Metadata } from "next";
import { Geist, Caveat, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Hanie OS | Frontend Engineer Portfolio",
    template: "%s | Hanie OS",
  },
  description:
    "Interactive OS-inspired portfolio of a Frontend Engineer specializing in React, TypeScript, and Next.js.",
  applicationName: "Hanie OS",
  authors: [{ name: "Hanie" }],
  creator: "Hanie",
  keywords: [
    "Frontend Engineer",
    "React",
    "TypeScript",
    "Next.js",
    "Portfolio",
    "Hanie OS",
  ],
  openGraph: {
    title: "Hanie OS | Frontend Engineer Portfolio",
    description:
      "Interactive OS-inspired portfolio of a Frontend Engineer specializing in React, TypeScript, and Next.js.",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
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
      className={`${geistSans.variable} ${caveat.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="h-full overflow-hidden font-sans">{children}</body>
    </html>
  );
}
