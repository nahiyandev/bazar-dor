import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ToastProvider from "@/components/ToastProvider";

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
    <html lang="bn" className={hindSiliguri.variable}>
      <body className={`${hindSiliguri.className} antialiased bg-[#f8faf8] text-slate-800`}>
        <Navbar />
        {children}
        {/* আলাদা ক্লায়েন্ট প্রোভাইডার */}
        <ToastProvider />
      </body>
    </html>
  );
}