"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { toast } from "react-toastify";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  // ইমেইল এবং পাসওয়ার্ড দিয়ে লগইন
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signIn.email({
        email: email.trim(),
        password,
      });

      if (res.error) {
        toast.error(res.error.message || "ইমেইল বা পাসওয়ার্ড সঠিক নয়");
      } else {
        toast.success("সফলভাবে সাইন ইন হয়েছে!");
        router.push("/profile");
        router.refresh();
      }
    } catch {
      toast.error("লগইন করতে সমস্যা হয়েছে, আবার চেষ্টা করুন");
    } finally {
      setLoading(false);
    }
  };

  // Google ও GitHub দিয়ে লগইন
  const handleSocialLogin = async (provider: "google" | "github") => {
    try {
      setSocialLoading(provider);
      await signIn.social({
        provider,
        callbackURL: "/profile",
      });
    } catch {
      toast.error(
        `${provider === "google" ? "গুগল" : "গিটহাব"} দিয়ে লগইন ব্যর্থ হয়েছে`
      );
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#f8faf8] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-sm space-y-6">
        <div className="text-center space-y-1.5">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            সাইন ইন
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।
          </p>
        </div>

        {/* সোশাল লগইন বাটনসমূহ */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={!!socialLoading || loading}
            onClick={() => handleSocialLogin("google")}
            className="flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs sm:text-sm font-bold text-slate-700 transition-colors cursor-pointer disabled:opacity-60"
          >
            <span>🌐</span> {socialLoading === "google" ? "অপেক্ষা..." : "Google"}
          </button>
          <button
            type="button"
            disabled={!!socialLoading || loading}
            onClick={() => handleSocialLogin("github")}
            className="flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs sm:text-sm font-bold text-slate-700 transition-colors cursor-pointer disabled:opacity-60"
          >
            <span>🐙</span> {socialLoading === "github" ? "অপেক্ষা..." : "GitHub"}
          </button>
        </div>

        {/* ডিভাইডার */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-slate-400 font-semibold">অথবা</span>
          </div>
        </div>

        {/* ইমেইল ও পাসওয়ার্ড ফর্ম */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">
              ইমেইল
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:outline-none focus:ring-1 focus:ring-[#0e8a44]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">
              পাসওয়ার্ড
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:outline-none focus:ring-1 focus:ring-[#0e8a44]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !!socialLoading}
            className="w-full bg-[#0e8a44] hover:bg-[#0b6f36] text-white font-bold py-3 rounded-xl shadow-xs transition-colors text-sm cursor-pointer disabled:opacity-60"
          >
            {loading ? "সাইন ইন হচ্ছে..." : "সাইন ইন"}
          </button>
        </form>

        <div className="text-center text-xs font-medium text-slate-500 pt-1">
          অ্যাকাউন্ট নেই?{" "}
          <Link href="/signup" className="text-[#0e8a44] font-bold hover:underline">
            সাইন আপ করুন
          </Link>
        </div>

        <div className="text-center">
          <Link href="/" className="text-xs text-slate-400 hover:text-slate-600">
            ← হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  );
}