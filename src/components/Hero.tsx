"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  const [banglaDate, setBanglaDate] = useState("");

  useEffect(() => {
    // শুধুমাত্র ক্লায়েন্ট সাইড ব্রাউজারে মাউন্ট হওয়ার পর বর্তমান তারিখ রেন্ডার হবে
    const timer = setTimeout(() => {
      const formatted = new Intl.DateTimeFormat("bn-BD", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date());
      setBanglaDate(formatted);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl px-6 sm:px-10 py-6 sm:py-8 shadow-xs flex flex-col-reverse md:flex-row items-center justify-between gap-6 transition-colors duration-200">
        
        {/* বাম দিকের টেক্সট কনটেন্ট */}
        <div className="w-full md:w-3/5 space-y-3 sm:space-y-4 text-left">
          
          {/* 🗓️ গর্জিয়াস ও স্পষ্ট তারিখ ব্যাজ (Dark & Light Mode ফিক্সড) */}
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 dark:bg-emerald-400/10 border border-emerald-600/20 dark:border-emerald-400/25 px-3.5 py-1.5 rounded-full shadow-2xs">
            <span className="text-xs sm:text-sm leading-none">🗓️</span>
            <span className="text-xs sm:text-sm font-bold text-emerald-800 dark:text-emerald-300 tracking-wide font-sans">
              {banglaDate || "শনিবার, ১০ অক্টোবর, ২০২৬"}
            </span>
          </div>

          {/* Main heading */}
          <h1 className="text-2xl sm:text-3xl lg:text-3.5xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
            আজকের বাজারের দাম এক নজরে
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl font-normal">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বোচ্চ এবং দামের পরিবর্তন এক জায়গায়।
          </p>

          {/* CTA বাটন */}
          <div className="pt-1">
            <Link
              href="#all-products"
              className="inline-flex items-center justify-center bg-[#0e8a44] hover:bg-[#0b6f36] text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer active:scale-95"
            >
              সব পণ্য দেখুন
            </Link>
          </div>
        </div>

        {/* ডান দিকের হিরো ইমেজ */}
        <div className="w-full md:w-2/5 flex justify-center md:justify-end">
          <div className="relative w-44 h-40 sm:w-56 sm:h-48 lg:w-64 lg:h-52 drop-shadow-sm">
            <Image
              src="/bazar-hero.png"
              alt="বাজার দর বাস্কেট"
              fill
              priority
              className="object-contain"
            />
          </div>
        </div>

      </div>
    </section>
  );
}