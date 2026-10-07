"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession, signOut, authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

type ActiveTab = "name" | "image";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [activeTab, setActiveTab] = useState<ActiveTab>("name");
  const [name, setName] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [updating, setUpdating] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);

  // ইউজার অথেনটিকেশন চেক (লগআউট করার সময় যাতে ওয়ার্নিং টোস্ট না ওঠে)
  useEffect(() => {
    if (!isPending && !session?.user && !isLoggingOut) {
      toast.warn("প্রোফাইল দেখার জন্য অনুগ্রহ করে প্রথমে সাইন ইন করুন");
      router.push("/signin");
    }
  }, [session, isPending, router, isLoggingOut]);

  // সেশনের ডাটা ইনিশিয়ালাইজ করা
  useEffect(() => {
    if (session?.user) {
      if (session.user.name) setName(session.user.name);
      if (session.user.image) setImage(session.user.image);
    }
  }, [session]);

  // ১. কেবল একটি মাত্র সাকসেস টোস্ট দিয়ে সাইন আউট
  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      toast.success("সফলভাবে অ্যাকাউন্ট থেকে সাইন আউট হয়েছে");
      router.push("/signin");
      router.refresh();
    } catch {
      setIsLoggingOut(false);
      toast.error("সাইন আউট সম্পন্ন করা যায়নি");
    }
  };

  // ২. নাম আপডেট হ্যান্ডলার
  const handleUpdateName = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.error("নামের ঘর খালি রাখা যাবে না");
      return;
    }

    setUpdating(true);
    try {
      const res = await authClient.updateUser({
        name: trimmedName,
      });

      if (res.error) {
        toast.error(res.error.message || "নাম আপডেট করতে ব্যর্থ হয়েছে");
      } else {
        toast.success("নাম সফলভাবে আপডেট করা হয়েছে!");
        router.refresh();
      }
    } catch {
      toast.error("নাম আপডেট করতে সমস্যা হয়েছে");
    } finally {
      setUpdating(false);
    }
  };

  // ৩. প্রোফাইল ছবি আপডেট হ্যান্ডলার
  const handleUpdateImage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedImage = image.trim();
    if (!trimmedImage) {
      toast.error("ছবির লিঙ্ক খালি রাখা যাবে না");
      return;
    }

    setUpdating(true);
    setImageError(false);
    try {
      const res = await authClient.updateUser({
        image: trimmedImage,
      });

      if (res.error) {
        toast.error(res.error.message || "ছবি আপডেট করতে ব্যর্থ হয়েছে");
      } else {
        toast.success("প্রোফাইল ছবি সফলভাবে আপডেট হয়েছে!");
        router.refresh();
      }
    } catch {
      toast.error("ছবি আপডেট করতে সমস্যা হয়েছে");
    } finally {
      setUpdating(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-[85vh] bg-[#f4f7f4] py-10 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="h-28 bg-white rounded-3xl animate-pulse border border-slate-200" />
          <div className="h-64 bg-white rounded-3xl animate-pulse border border-slate-200" />
        </div>
      </div>
    );
  }

  const user = session?.user;
  const userInitials = (user?.name || "U").slice(0, 2).toUpperCase();

  return (
    <div className="min-h-[85vh] bg-[#f4f7f4] py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            আমার প্রোফাইল
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন ও পরিবর্তন করুন।
          </p>
        </div>

        {/* শীর্ষ প্রোফাইল কার্ড */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 min-w-16 max-w-16 rounded-2xl bg-slate-100 overflow-hidden relative border border-slate-200 flex items-center justify-center text-xl font-bold text-slate-600 shrink-0">
              {user?.image && !imageError ? (
                <Image
                  src={user.image}
                  alt={user.name || "Avatar"}
                  fill
                  unoptimized
                  className="object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <span>{userInitials}</span>
              )}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {user?.name || "ব্যবহারকারী"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                {user?.email || "ইমেইল পাওয়া যায়নি"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center gap-1.5 px-4 py-2 border border-red-300 text-red-600 rounded-xl text-xs sm:text-sm font-semibold hover:bg-red-50 transition-colors cursor-pointer"
          >
            <span>↩</span> সাইন আউট
          </button>
        </div>

        {/* তথ্য ও এডিট সেকশন */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-2xs space-y-5">
          <h3 className="text-sm font-bold text-slate-800">তথ্য আপডেট</h3>

          {/* টগল অপশন বার (Tabs) */}
          <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200/80">
            <button
              type="button"
              onClick={() => setActiveTab("name")}
              className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === "name"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              👤 নাম পরিবর্তন
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("image")}
              className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === "image"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              🖼️ ছবি পরিবর্তন
            </button>
          </div>

          {/* ১. নাম পরিবর্তন ফর্ম (টগলে একটিভ থাকলে শো করবে) */}
          {activeTab === "name" && (
            <form onSubmit={handleUpdateName} className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                  নতুন নাম
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="আপনার নাম লিখুন"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:outline-none focus:ring-1 focus:ring-[#0e8a44]"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={updating}
                className="w-full bg-[#0e8a44] hover:bg-[#0b6f36] text-white font-bold py-2.5 rounded-xl shadow-xs transition-colors text-sm cursor-pointer disabled:opacity-60"
              >
                {updating ? "আপডেট হচ্ছে..." : "নাম সেভ করুন"}
              </button>
            </form>
          )}

          {/* ২. ছবি পরিবর্তন ফর্ম (টগলে একটিভ থাকলে শো করবে) */}
          {activeTab === "image" && (
            <form onSubmit={handleUpdateImage} className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                  প্রোফাইল ছবির সরাসরি লিঙ্ক (Image URL)
                </label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:outline-none focus:ring-1 focus:ring-[#0e8a44]"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={updating}
                className="w-full bg-[#0e8a44] hover:bg-[#0b6f36] text-white font-bold py-2.5 rounded-xl shadow-xs transition-colors text-sm cursor-pointer disabled:opacity-60"
              >
                {updating ? "আপডেট হচ্ছে..." : "ছবি সেভ করুন"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}