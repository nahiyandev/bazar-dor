"use client";

import React from "react";
import Image from "next/image";

export default function Hero() {
  // সরাসরি লাইভ বাংলা তারিখ তৈরি
  const banglaDate = new Intl.DateTimeFormat("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  // একই পেজের নিচে সব পণ্য সেকশনে স্মুথ স্ক্রল
  const handleScrollToProducts = () => {
    const productsSection = document.getElementById("all-products");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-10 lg:p-12 shadow-2xs flex flex-col-reverse md:flex-row items-center justify-between gap-8">
        
        {/* বাম দিকের টেক্সট কনটেন্ট */}
        <div className="w-full md:w-3/5 space-y-4 sm:space-y-5 text-left">
          
          {/* Eyebrow / ব্যাজ (suppressHydrationWarning দিয়ে SSR/Client mismatch শান্ত রাখা হয়েছে) */}
          <div className="inline-flex items-center gap-1.5 bg-[#eaf7ee] text-[#0e8a44] text-xs sm:text-sm font-semibold px-3 py-1 rounded-full">
            <span>📅</span>
            <span suppressHydrationWarning>{banglaDate}</span>
          </div>

          {/* Main heading */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            আজকের বাজারের দাম এক নজরে
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বোচ্চ এবং দামের পরিবর্তন এক জায়গায়।
          </p>

          {/* Primary CTA Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleScrollToProducts}
              className="inline-flex items-center justify-center bg-[#0e8a44] hover:bg-[#0b6f36] text-white font-semibold text-sm sm:text-base px-6 py-3 rounded-xl shadow-xs hover:shadow transition-all duration-200 cursor-pointer"
            >
              সব পণ্য দেখুন
            </button>
          </div>
        </div>

        {/* ডান দিকের হিরো ইমেজ */}
        <div className="w-full md:w-2/5 flex justify-center md:justify-end">
          <div className="relative w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80">
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