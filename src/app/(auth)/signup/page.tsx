"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp, signIn } from "@/lib/auth-client";
import { toast } from "react-toastify";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  // ইমেইল রেজিস্ট্রেশন
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("দুই পাসওয়ার্ডের মিল নেই");
      return;
    }

    if (password.length < 6) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে");
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
        toast.error(res.error.message || "রেজিস্ট্রেশন সম্পন্ন করা যায়নি");
      } else {
        toast.success("অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!");
        router.push("/profile");
        router.refresh();
      }
    } catch {
      toast.error("সার্ভার সমস্যা, কিছুক্ষণ পর আবার চেষ্টা করুন");
    } finally {
      setLoading(false);
    }
  };

  // Google ও GitHub দিয়ে সাইন আপ/লগইন
  const handleSocialLogin = async (provider: "google" | "github") => {
    try {
      setSocialLoading(provider);
      await signIn.social({
        provider,
        callbackURL: "/profile",
      });
    } catch {
      toast.error(
        `${provider === "google" ? "গুগল" : "গিটহাব"} দিয়ে অ্যাকাউন্ট খোলা সম্ভব হয়নি`
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
            অ্যাকাউন্ট তৈরি করুন
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।
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

        {/* রেজিস্ট্রেশন ফর্ম */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              নাম *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="আপনার পূর্ণ নাম"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:outline-none focus:ring-1 focus:ring-[#0e8a44]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              ইমেইল *
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
            <label className="block text-xs font-bold text-slate-600 mb-1">
              প্রোফাইল ছবির লিংক (ঐচ্ছিক)
            </label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:outline-none focus:ring-1 focus:ring-[#0e8a44]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              পাসওয়ার্ড *
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="কমপক্ষে ৬ অক্ষরের"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:outline-none focus:ring-1 focus:ring-[#0e8a44]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              পাসওয়ার্ড নিশ্চিত করুন *
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="একই পাসওয়ার্ড পুনরায় লিখুন"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:outline-none focus:ring-1 focus:ring-[#0e8a44]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !!socialLoading}
            className="w-full bg-[#0e8a44] hover:bg-[#0b6f36] text-white font-bold py-3 rounded-xl shadow-xs transition-colors text-sm cursor-pointer disabled:opacity-60 mt-2"
          >
            {loading ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "অ্যাকাউন্ট তৈরি করুন"}
          </button>
        </form>

        <div className="text-center text-xs font-medium text-slate-500 pt-1">
          অ্যাকাউন্ট আছে?{" "}
          <Link href="/signin" className="text-[#0e8a44] font-bold hover:underline">
            সাইন ইন করুন
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