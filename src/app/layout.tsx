import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Oak's Originals - Kanto Pokédex",
  description: "Professor Oak's personal collection of the original 151 Pokémon. Complete Kanto region Pokédex with advanced search, filtering, and detailed information.",
  keywords: ["Pokémon", "Pokédex", "Kanto", "Professor Oak", "151 Pokémon", "Pokémon Red", "Pokémon Blue", "Pokémon Yellow"],
  authors: [{ name: "Xandred" }],
  icons: {
    icon: [
      { url: '/pokeball.png', sizes: '1024x1024', type: 'image/png' },
    ],
    shortcut: '/pokeball.png',
    apple: '/pokeball.png',
  }, 
  
  openGraph: {
    title: "Oak's Originals - Kanto Pokédex",
    description: "Complete Kanto region Pokédex featuring all 151 original Pokémon with detailed information and evolution chains.",
    url: "https://github.com/Tribal-Chief-001/Oaks-Originals",
    siteName: "Oak's Originals",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Oak's Originals - Kanto Pokédex",
    description: "Complete Kanto region Pokédex featuring all 151 original Pokémon.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
