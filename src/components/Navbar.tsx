"use client";

import React, { useEffect, useState, Suspense, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { toast } from "react-toastify";
import Marquee from "@/components/Marquee";

interface Category {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
}

const NavbarContent = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const currentSlug = params?.slug as string | undefined;
  const isHomePage = pathname === "/";

  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [todayBanglaDate, setTodayBanglaDate] = useState<string>("বৃহস্পতিবার, ৮ অক্টোবর, ২০২৬");

  // ১. আজকের বাংলা তারিখ নির্ধারণ
  useEffect(() => {
    const timer = setTimeout(() => {
      const formatted = new Intl.DateTimeFormat("bn-BD", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date());
      setTodayBanglaDate(formatted);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // ২. ক্যাটাগরি ডাটা ফেচিং
  useEffect(() => {
    fetch("https://api.api-store.workers.dev/api/bazardor/categories")
      .then((res) => res.json())
      .then((data: Category[]) => {
        if (Array.isArray(data)) {
          setCategories(data);
        }
      })
      .catch((err: unknown) => {
        console.error("Navbar category fetch error:", err);
      });
  }, []);

  // ৩. ড্রপডাউনের বাইরে ক্লিক করলে বন্ধ করা
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ৪. সাইন আউট হ্যান্ডলার
  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("সফলভাবে সাইন আউট হয়েছে");
      setDropdownOpen(false);
      router.push("/");
      router.refresh();
    } catch {
      toast.error("সাইন আউট সম্পন্ন করা যায়নি");
    }
  };

  const user = session?.user;
  const userInitials = (user?.name || "U").slice(0, 2).toUpperCase();

  return (
    <header className="w-full bg-[#f8faf8] border-b border-slate-200">
      {/* ১. শীর্ষ বার: লোগো ও Auth বাটন / প্রোফাইল ড্রপডাউন */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#0e8a44] flex items-center justify-center text-white text-2xl shadow-xs shrink-0">
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

        {/* Auth কন্ট্রোল */}
        <div className="relative" ref={dropdownRef}>
          {user ? (
            <div>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-2xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                {/* ফিক্সড সাইজ অ্যাভাটার কনটেইনার */}
                <div className="w-9 h-9 min-w-9 max-w-9 rounded-full bg-slate-200 overflow-hidden relative border border-slate-300 flex items-center justify-center shrink-0">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || "User"}
                      width={36}
                      height={36}
                      unoptimized
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-xs font-bold text-slate-700">
                      {userInitials}
                    </span>
                  )}
                </div>
                <span className="text-sm font-bold text-slate-800 hidden sm:inline-block">
                  {user.name?.split(" ")[0]}
                </span>
                <span className="text-xs text-slate-500">▾</span>
              </button>

              {/* ড্রপডাউন মেনু */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200/90 rounded-2xl shadow-xl p-3 z-50 text-left">
                  <div className="px-2 py-1.5 border-b border-slate-100 mb-2">
                    <p className="text-sm font-bold text-slate-800 leading-snug">
                      {user.name}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {user.email}
                    </p>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    <span>👤</span> আমার প্রোফাইল
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer text-left"
                  >
                    <span>↩</span> সাইন আউট
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/signin"
                className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-[#0e8a44] px-3 py-1.5 transition-colors"
              >
                সাইন ইন
              </Link>
              <Link
                href="/signup"
                className="text-xs sm:text-sm font-semibold bg-[#0e8a44] hover:bg-[#0b6f36] text-white px-3.5 py-1.5 rounded-lg transition-colors shadow-xs"
              >
                সাইন আপ
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ২. ক্যাটাগরি তালিকা */}
      <nav className="border-t border-slate-200 bg-white overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 py-2">
          {/* হোম পেজ লিংক */}
          <Link
            href="/"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm whitespace-nowrap transition-colors ${
              isHomePage && !currentSlug
                ? "bg-[#0e8a44]/10 text-[#0e8a44] font-bold border border-[#0e8a44]/20"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium"
            }`}
          >
            <span>🧺</span>
            <span>সব পণ্য</span>
          </Link>

          {/* ডাইনামিক ক্যাটাগরি লিংকসমূহ */}
          {categories.map((cat) => {
            const isActive = currentSlug === cat.slug;
            return (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
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

      {/* ৩. প্রাইস টিকার */}
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