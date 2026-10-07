import React from "react";
import Image from "next/image";

export default function Hero() {
  // সার্ভার কম্পোনেন্টে new Date() চালানো পুরোপুরি বৈধ এবং কোনো বিল্ড এরর হয় না
  const banglaDate = new Intl.DateTimeFormat("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
      <div className="bg-white border border-slate-200/80 rounded-2xl px-6 sm:px-10 py-5 sm:py-6 shadow-2xs flex flex-col-reverse md:flex-row items-center justify-between gap-6">
        
        {/* বাম দিকের টেক্সট কনটেন্ট */}
        <div className="w-full md:w-3/5 space-y-3 sm:space-y-4 text-left">
          
          {/* Eyebrow / ব্যাজ */}
          <div className="inline-flex items-center gap-1.5 bg-[#eaf7ee] text-[#0e8a44] text-xs sm:text-sm font-semibold px-3 py-1 rounded-full">
            <span>📅</span>
            <span>{banglaDate}</span>
          </div>

          {/* Main heading */}
          <h1 className="text-2xl sm:text-3xl lg:text-3.5xl font-extrabold text-slate-900 tracking-tight leading-snug">
            আজকের বাজারের দাম এক নজরে
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বোচ্চ এবং দামের পরিবর্তন এক জায়গায়।
          </p>

          {/* CTA বাটন (খাঁটি Anchor Tag: কোনো JS/হাইড্রেসন এরর ছাড়াই সরাসরি #all-products এ যাবে) */}
          <div className="pt-1">
            <a
              href="#all-products"
              className="inline-flex items-center justify-center bg-[#0e8a44] hover:bg-[#0b6f36] text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-lg shadow-xs hover:shadow transition-all duration-200"
            >
              সব পণ্য দেখুন
            </a>
          </div>
        </div>

        {/* ডান দিকের ইমেজ */}
        <div className="w-full md:w-2/5 flex justify-center md:justify-end">
          <div className="relative w-44 h-40 sm:w-56 sm:h-48 lg:w-64 lg:h-52">
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