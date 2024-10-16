import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./Providers/ThemeProvider";
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
 title: "WeatherNow",
 description: "A weather app built with Next.js and TailwindCSS by Group 4 Members",
 other: {
  'interactive-widget': 'overlays-content'
 }
};

export default function RootLayout({
 children,
}: Readonly<{
 children: React.ReactNode;
}>) {
 return (
  <html lang="en">
   <body className={inter.className}>
    <ThemeProvider
     attribute="class"
     defaultTheme="dark"
     enableSystem
     disableTransitionOnChange
    >
     <Toaster position="top-center" theme="light" />
     {children}
    </ThemeProvider>
   </body>
  </html>
 );
}
