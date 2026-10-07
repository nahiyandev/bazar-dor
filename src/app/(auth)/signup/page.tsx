"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import { toast } from "react-toastify";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      toast.error("সবগুলো প্রয়োজনীয় ঘর পূরণ করুন");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("উভয় পাসওয়ার্ড এক হতে হবে");
      return;
    }

    if (password.length < 8) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");
      return;
    }

    setLoading(true);
    try {
      const res = await signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        image: image.trim() || undefined,
      });

      if (res.error) {
        toast.error(res.error.message || "রেজিস্ট্রেশন সম্পন্ন করা যায়নি");
      } else {
        toast.success("অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে! অনুগ্রহ করে সাইন ইন করুন।");
        router.push("/signin");
      }
    } catch {
      toast.error("সার্ভার সমস্যা, কিছুক্ষণ পর আবার চেষ্টা করুন");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#f4f7f4] flex flex-col items-center justify-center px-4 py-10">
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          অ্যাকাউন্ট তৈরি করুন
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1.5 font-medium">
          বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।
        </p>
      </div>

      <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-2xs">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              নাম <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="যেমন: রহিম উদ্দিন"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e8a44]/20 focus:border-[#0e8a44] transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              ইমেইল <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e8a44]/20 focus:border-[#0e8a44] transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              প্রোফাইল ছবির লিংক (Image URL - ঐচ্ছিক)
            </label>
            <input
              type="url"
              placeholder="https://example.com/avatar.jpg"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e8a44]/20 focus:border-[#0e8a44] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              পাসওয়ার্ড <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              placeholder="কমপক্ষে ৮ অক্ষর"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e8a44]/20 focus:border-[#0e8a44] transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              পাসওয়ার্ড নিশ্চিত করুন <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              placeholder="আবার লিখুন"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e8a44]/20 focus:border-[#0e8a44] transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0e8a44] hover:bg-[#0b6f36] text-white font-bold py-2.5 rounded-xl shadow-xs transition-colors flex items-center justify-center text-sm disabled:opacity-60 cursor-pointer"
          >
            {loading ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "অ্যাকাউন্ট তৈরি করুন"}
          </button>
        </form>

        <p className="text-center text-xs text-slate-600 font-medium mt-6">
          অ্যাকাউন্ট আছে?{" "}
          <Link href="/signin" className="text-[#0e8a44] font-bold hover:underline">
            সাইন ইন করুন
          </Link>
        </p>
      </div>

      <Link
        href="/"
        className="text-xs text-slate-500 hover:text-slate-800 transition-colors mt-6 font-medium"
      >
        ← হোম পেজে ফিরে যান
      </Link>
    </div>
  );
}