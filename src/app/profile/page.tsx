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
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);

  // ইউজার অথেনটিকেশন চেক
  useEffect(() => {
    if (!isPending && !session?.user && !isLoggingOut) {
      toast.warn("প্রোফাইল দেখার জন্য অনুগ্রহ করে প্রথমে সাইন ইন করুন");
      router.push("/signin");
    }
  }, [session, isPending, router, isLoggingOut]);

  // সাইন আউট হ্যান্ডলার
  const handleSignOut = async () => {
    setShowLogoutModal(false);
    setIsLoggingOut(true);
    try {
      await signOut();
      toast.success("সফলভাবে অ্যাকাউন্ট থেকে সাইন আউট হয়েছে");
      router.push("/signin");
      router.refresh();
    } catch {
      setIsLoggingOut(false);
      toast.error("সাইন আউট সম্পন্ন করা যায়নি");
    }
  };

  // নাম আপডেট হ্যান্ডলার
  const handleUpdateName = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const targetName = name !== "" ? name : session?.user?.name || "";
    const trimmedName = targetName.trim();

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
        setName("");
        router.refresh();
      }
    } catch {
      toast.error("নাম আপডেট করতে সমস্যা হয়েছে");
    } finally {
      setUpdating(false);
    }
  };

  // প্রোফাইল ছবি আপডেট হ্যান্ডলার
  const handleUpdateImage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const targetImage = image !== "" ? image : session?.user?.image || "";
    const trimmedImage = targetImage.trim();

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
        setImage("");
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
        <div className="max-w-xl mx-auto space-y-6">
          <div className="h-32 bg-white rounded-3xl animate-pulse border border-slate-200" />
          <div className="h-72 bg-white rounded-3xl animate-pulse border border-slate-200" />
        </div>
      </div>
    );
  }

  const user = session?.user;
  const userInitials = (user?.name || "U").slice(0, 2).toUpperCase();

  const currentInputValue = name !== "" ? name : user?.name || "";
  const currentImageInputValue = image !== "" ? image : user?.image || "";

  return (
    <div className="min-h-[85vh] bg-linear-to-b from-[#f2f8f3] via-[#f7faf7] to-[#ffffff] py-8 sm:py-12 px-4">
      <div className="max-w-xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            আমার প্রোফাইল
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন ও পরিবর্তন করুন।
          </p>
        </div>

        {/* 🌟 প্রিমিয়াম গ্রেডিয়েন্ট প্রোফাইল কার্ড */}
        <div className="relative overflow-hidden bg-linear-to-br from-white via-emerald-50/40 to-teal-50/30 border border-emerald-200/70 rounded-3xl p-5 sm:p-6 shadow-md shadow-emerald-900/5">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-emerald-200/30 rounded-full blur-2xl pointer-events-none" />

          <div className="relative flex items-start justify-between gap-3">
            {/* প্রোফাইল ইমেজ ও ফুল ইনফরমেশন */}
            <div className="flex items-start gap-3.5 sm:gap-4 flex-1 min-w-0">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-linear-to-tr from-[#0e8a44] to-emerald-500 overflow-hidden relative border-2 border-white flex items-center justify-center text-xl font-black text-white shrink-0 shadow-sm">
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

              {/* নাম ও ইমেইল */}
              <div className="flex-1 min-w-0 pt-0.5">
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-rose-500 block leading-tight">
                  HELLO,
                </span>
                <h2 className="text-base sm:text-lg font-black text-[#0e8a44] wrap-break-word leading-snug mt-0.5">
                  {user?.name || "ব্যবহারকারী"}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 font-medium break-all mt-1 leading-tight">
                  {user?.email || "ইমেইল পাওয়া যায়নি"}
                </p>
              </div>
            </div>

            {/* সাইন আউট বাটন */}
            <button
              type="button"
              onClick={() => setShowLogoutModal(true)}
              className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-white/90 hover:bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-xs font-bold transition-all shadow-2xs hover:border-rose-300 active:scale-95 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>সাইন আউট</span>
            </button>
          </div>
        </div>

        {/* তথ্য ও এডিট সেকশন */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-black text-slate-800">তথ্য আপডেট</h3>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
              প্রোফাইল সেটিংস
            </span>
          </div>

          {/* টগল অপশন বার */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/60">
            <button
              type="button"
              onClick={() => setActiveTab("name")}
              className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === "name"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <span>👤</span> নাম পরিবর্তন
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("image")}
              className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === "image"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <span>🖼️</span> ছবি পরিবর্তন
            </button>
          </div>

          {/* নাম পরিবর্তন ফর্ম */}
          {activeTab === "name" && (
            <form onSubmit={handleUpdateName} className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  নতুন নাম
                </label>
                <input
                  type="text"
                  value={currentInputValue}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="আপনার নাম লিখুন"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e8a44] focus:bg-white transition-all shadow-2xs"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={updating}
                className="w-full bg-[#0e8a44] hover:bg-[#0b6f36] text-white font-bold py-3 rounded-xl shadow-xs transition-all text-sm cursor-pointer disabled:opacity-60 active:scale-[0.99]"
              >
                {updating ? "আপডেট হচ্ছে..." : "নাম সেভ করুন"}
              </button>
            </form>
          )}

          {/* ছবি পরিবর্তন ফর্ম */}
          {activeTab === "image" && (
            <form onSubmit={handleUpdateImage} className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  প্রোফাইল ছবির লিঙ্ক (Direct Image URL)
                </label>
                <input
                  type="url"
                  value={currentImageInputValue}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e8a44] focus:bg-white transition-all shadow-2xs"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={updating}
                className="w-full bg-[#0e8a44] hover:bg-[#0b6f36] text-white font-bold py-3 rounded-xl shadow-xs transition-all text-sm cursor-pointer disabled:opacity-60 active:scale-[0.99]"
              >
                {updating ? "আপডেট হচ্ছে..." : "ছবি সেভ করুন"}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* সাইন-আউট কনফার্মেশন মোডাল */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xs w-full p-6 text-center space-y-4 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 mx-auto flex items-center justify-center text-xl font-bold">
              ⚠️
            </div>
            <div>
              <h4 className="text-base font-extrabold text-slate-900">
                লগআউট নিশ্চিতকরণ
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                আপনি কি নিশ্চিত যে অ্যাকাউন্ট থেকে সাইন আউট করতে চান?
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                না, থাকুন
              </button>
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
              >
                হ্যাঁ, সাইন আউট
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}