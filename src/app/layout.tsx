import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ToastProvider from "@/components/ToastProvider";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

const hindSiliguri = Hind_Siliguri({
  weight: ["400", "500", "600", "700"],
  subsets: ["bengali", "latin"],
  display: "swap",
  variable: "--font-hind-siliguri",
});

export const metadata: Metadata = {
  title: "বাজার দর - আজকের বাজার দর এক নজরে",
  description: "দৈনিক নিত্যপ্রয়োজনীয় পণ্যের সঠিক বাজারদর তালিকা",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className={hindSiliguri.variable} suppressHydrationWarning>
      <body
        className={`${hindSiliguri.className} antialiased bg-[#f8faf8] dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <Navbar />
          {children}
          <Footer />
          <ToastProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}