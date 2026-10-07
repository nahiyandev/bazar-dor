"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// ক্যাটাগরি এবং প্রোডাক্টের জন্য সহজ টাইপ
interface Category {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
}

interface ProductTicker {
  id: number;
  nameBn: string;
  unit: string;
  image: string;
  today: number;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
}

const NavbarContent = () => {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "all";

  const [categories, setCategories] = useState<Category[]>([]);
  const [tickerProducts, setTickerProducts] = useState<ProductTicker[]>([]);

  // আজকের বাংলা তারিখ তৈরি
  const todayBanglaDate = new Intl.DateTimeFormat("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  // API থেকে লাইভ ডেটা ফেচ
  useEffect(() => {
    const loadNavbarData = async () => {
      try {
        const [categoryRes, productRes] = await Promise.all([
          fetch("https://api.api-store.workers.dev/api/bazardor/categories"),
          fetch("https://api.api-store.workers.dev/api/bazardor/products"),
        ]);

        const categoryData: Category[] = await categoryRes.json();
        const productData: ProductTicker[] = await productRes.json();

        setCategories(categoryData);
        setTickerProducts(productData);
      } catch (error) {
        console.error("ডেটা লোড করতে সমস্যা হয়েছে:", error);
      }
    };

    loadNavbarData();
  }, []);

  return (
    <header className="w-full bg-[#f8faf8] border-b border-slate-200">
      {/* ১. টপ বার: লোগো, বাংলা তারিখ এবং সাইন ইন/সাইন আপ বাটন */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        {/* লোগো ও তারিখ */}
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

        {/* ডানদিকের অথেনটিকেশন বাটন */}
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

      {/* ২. মিডল রো: ক্যাটাগরি নেভিগেশন লিংকস */}
      <nav className="border-t border-slate-200 bg-white overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 py-2">
          {/* সব পণ্য লিংক */}
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

          {/* ডাইনামিক ক্যাটাগরি বাটনসমূহ */}
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

      {/* ৩. বটম রো: প্রাইস টিকার (Marquee) */}
      <div className="border-t border-slate-200 bg-[#f4f7f4] py-2 overflow-hidden flex items-center text-xs sm:text-sm">
        <div className="animate-marquee flex items-center gap-4">
          {/* স্মুথ ইনফিনিট স্ক্রলের জন্য লিস্ট ডাবল করা হয়েছে */}
          {[...tickerProducts, ...tickerProducts].map((item, index) => {
            const isUp = item.change?.dir === "up";
            const isDown = item.change?.dir === "down";

            return (
              <div
                key={`${item.id}-${index}`}
                className="flex items-center gap-1.5 whitespace-nowrap bg-white border border-slate-200 px-3 py-1 rounded-md shadow-2xs"
              >
                <span>{item.image || "📦"}</span>
                <span className="font-medium text-slate-800">{item.nameBn}</span>
                <span className="font-bold text-slate-900">
                  {item.today} টাকা/{item.unit === "kg" ? "কেজি" : item.unit}
                </span>

                {isUp && (
                  <span className="font-bold text-red-600 flex items-center">
                    ▲ {Math.abs(item.change.pct)}%
                  </span>
                )}
                {isDown && (
                  <span className="font-bold text-emerald-600 flex items-center">
                    ▼ {Math.abs(item.change.pct)}%
                  </span>
                )}
                {!isUp && !isDown && (
                  <span className="text-slate-400 font-semibold">-</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
};

// Vercel build prerender error এড়াতে Suspense বাউন্ডারি যুক্ত করে এক্সপোর্ট করা হলো
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