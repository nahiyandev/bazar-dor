"use client";

import React, { useEffect, useState, useTransition, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function LoaderContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [, startTransition] = useTransition();

  // ১. রাউট পরিবর্তন শেষ হলে লোডার লুকাবে
  useEffect(() => {
    startTransition(() => {
      setLoading(false);
    });
  }, [pathname, searchParams]);

  // ২. যেকোনো লিংকে ক্লিক করার সাথে সাথে লোডার চালু হবে
  useEffect(() => {
    const handleAnchorClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (
        href &&
        href.startsWith("/") &&
        !href.startsWith("#") &&
        target.target !== "_blank" &&
        href !== pathname
      ) {
        setLoading(true);
      }
    };

    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-xs transition-all">
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 rounded-3xl shadow-2xl flex flex-col items-center gap-4">
        {/* স্পিনিং রিং */}
        <div className="relative flex items-center justify-center">
          <div className="w-14 h-14 rounded-full border-4 border-emerald-100 dark:border-emerald-950 border-t-[#0e8a44] animate-spin" />
          <div className="absolute text-2xl animate-bounce">🛒</div>
        </div>

        {/* টেক্সট */}
        <div className="text-center space-y-0.5">
          <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
            বাজার দর লোড হচ্ছে...
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            একটু অপেক্ষা করুন
          </p>
        </div>
      </div>
    </div>
  );
}

// Next.js রুট প্রি-রেন্ডারিংয়ের জন্য Suspense দিয়ে র‍্যাপ করা মেইন এক্সপোর্ট
export default function GlobalLoader() {
  return (
    <Suspense fallback={null}>
      <LoaderContent />
    </Suspense>
  );
}