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
  title: "Oak's Originals - Professor Oak's Personal Pokémon Collection",
  description: "Professor Oak's personal collection of the original 151 Pokémon from the Kanto region. A modern, responsive digital Pokédex built with Next.js.",
  keywords: ["Pokemon", "Pokedex", "Oak's Originals", "Kanto", "Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui"],
  authors: [{ name: "Oak's Originals Team" }],
  icons: {
    icon: [
      { url: '/pokeball.png', sizes: '1024x1024', type: 'image/png' },
    ],
    shortcut: '/pokeball.png',
    apple: '/pokeball.png',
  },
  openGraph: {
    title: "Oak's Originals - Professor Oak's Personal Pokémon Collection",
    description: "Explore the original 151 Pokémon from Professor Oak's personal collection in this modern digital Pokédex.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Oak's Originals - Professor Oak's Personal Pokémon Collection",
    description: "Explore the original 151 Pokémon from Professor Oak's personal collection.",
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
