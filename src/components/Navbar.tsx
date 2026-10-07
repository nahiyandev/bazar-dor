"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Marquee from "@/components/Marquee";

interface Category {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
}

const NavbarContent = () => {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "all";
  const [categories, setCategories] = useState<Category[]>([]);

  // আজকের বাংলা তারিখ
  const todayBanglaDate = new Intl.DateTimeFormat("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  useEffect(() => {
    fetch("https://api.api-store.workers.dev/api/bazardor/categories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
        }
      })
      .catch((err) => console.error("Category fetch error:", err));
  }, []);

  return (
    <header className="w-full bg-[#f8faf8] border-b border-slate-200">
      {/* ১. শীর্ষ বার: লোগো ও Auth বাটন */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#0e8a44] flex items-center justify-center text-white text-2xl shadow-xs">
            🛒
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
              বাজার দর
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              {todayBanglaDate}
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/sign-in"
            className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-[#0e8a44] px-3 py-1.5 transition-colors"
          >
            সাইন ইন
          </Link>
          <Link
            href="/sign-up"
            className="text-xs sm:text-sm font-semibold bg-[#0e8a44] hover:bg-[#0b6f36] text-white px-3.5 py-1.5 rounded-lg transition-colors shadow-xs"
          >
            সাইন আপ
          </Link>
        </div>
      </div>

      {/* ২. ক্যাটাগরি বাটনসমূহ */}
      <nav className="border-t border-slate-200 bg-white overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 py-2">
          <Link
            href="/"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm whitespace-nowrap transition-colors ${
              currentCategory === "all"
                ? "bg-[#0e8a44]/10 text-[#0e8a44] font-bold border border-[#0e8a44]/20"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium"
            }`}
          >
            <span>🧺</span>
            <span>সব পণ্য</span>
          </Link>

          {categories.map((cat) => {
            const isActive = currentCategory === cat.slug;
            return (
              <Link
                key={cat.id}
                href={`/?category=${cat.slug}`}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-[#0e8a44]/10 text-[#0e8a44] font-bold border border-[#0e8a44]/20"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.nameBn}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ৩. চলমান প্রাইস টিকার */}
      <Marquee />
    </header>
  );
};

export default function Navbar() {
  return (
    <Suspense
      fallback={
        <header className="w-full bg-[#f8faf8] border-b border-slate-200 h-28 animate-pulse" />
      }
    >
      <NavbarContent />
    </Suspense>
  );
}