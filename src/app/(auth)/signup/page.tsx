"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp, signIn } from "@/lib/auth-client";
import { toast } from "react-toastify";

// ব্র্যান্ড লোগো SVG
function BrandLogo() {
  return (
    <div className="w-12 h-12 rounded-2xl bg-[#0e8a44] flex items-center justify-center text-white shadow-md shadow-emerald-700/20">
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
      </svg>
    </div>
  );
}

// অফিসিয়াল গুগল লোগো SVG
function GoogleIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
      />
    </svg>
  );
}

// অফিসিয়াল গিটহাব লোগো SVG
function GitHubIcon() {
  return (
    <svg className="w-4 h-4 shrink-0 fill-slate-900" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
    </svg>
  );
}

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

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

  const handleSocialLogin = async (provider: "google" | "github") => {
    try {
      setSocialLoading(provider);
      await signIn.social({
        provider,
        callbackURL: "/profile",
      });
    } catch {
      toast.error(
        `${provider === "google" ? "গুগল" : "গিটহাব"} দিয়ে অ্যাকাউন্ট খোলা সম্ভব হয়নি`
      );
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#f8faf8] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-sm space-y-6">
        
        {/* ব্র্যান্ড লোগো ও নাম */}
        <div className="flex flex-col items-center text-center space-y-2">
          <Link href="/" className="flex flex-col items-center gap-2 group">
            <BrandLogo />
            <span className="text-xl font-black text-slate-900 tracking-tight group-hover:text-[#0e8a44] transition-colors">
              বাজার দর
            </span>
          </Link>
          <div className="pt-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              অ্যাকাউন্ট তৈরি করুন
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।
            </p>
          </div>
        </div>

        {/* সোশাল সাইন-আপ বাটনসমূহ */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={!!socialLoading || loading}
            onClick={() => handleSocialLogin("google")}
            className="flex items-center justify-center gap-2.5 py-2.5 px-4 border border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 transition-all cursor-pointer disabled:opacity-60 shadow-xs"
          >
            <GoogleIcon />
            <span>{socialLoading === "google" ? "অপেক্ষা..." : "Google"}</span>
          </button>
          <button
            type="button"
            disabled={!!socialLoading || loading}
            onClick={() => handleSocialLogin("github")}
            className="flex items-center justify-center gap-2.5 py-2.5 px-4 border border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 transition-all cursor-pointer disabled:opacity-60 shadow-xs"
          >
            <GitHubIcon />
            <span>{socialLoading === "github" ? "অপেক্ষা..." : "GitHub"}</span>
          </button>
        </div>

        {/* ডিভাইডার */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-slate-400 font-medium">অথবা</span>
          </div>
        </div>

        {/* রেজিস্ট্রেশন ফর্ম */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              নাম *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="আপনার পূর্ণ নাম"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e8a44] focus:bg-white transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ইমেইল *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e8a44] focus:bg-white transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              প্রোফাইল ছবির লিংক (ঐচ্ছিক)
            </label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e8a44] focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              পাসওয়ার্ড *
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="কমপক্ষে ৬ অক্ষরের"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e8a44] focus:bg-white transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              পাসওয়ার্ড নিশ্চিত করুন *
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="একই পাসওয়ার্ড পুনরায় লিখুন"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e8a44] focus:bg-white transition-all"
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
          <Link href="/" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
            ← হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  );
}