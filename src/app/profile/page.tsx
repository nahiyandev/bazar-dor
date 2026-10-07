"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession, signOut, authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  // ডিফল্টভাবে সেশন থেকে নাম নেওয়া হবে
  const [name, setName] = useState<string>("");
  const [updating, setUpdating] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);

  // ইউজার অথেনটিকেশন স্টেট চেক করা
  useEffect(() => {
    if (!isPending && !session?.user) {
      toast.warn("প্রোফাইল দেখার জন্য অনুগ্রহ করে প্রথমে সাইন ইন করুন");
      router.push("/signin");
    }
  }, [session, isPending, router]);

  // সাইন আউট হ্যান্ডলার
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("সফলভাবে অ্যাকাউন্ট থেকে সাইন আউট হয়েছে");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("সাইন আউট সম্পন্ন করা যায়নি");
    }
  };

  // নাম আপডেট হ্যান্ডলার
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const currentName = name || session?.user?.name || "";
    const trimmedName = currentName.trim();

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
        toast.success("আপনার নাম সফলভাবে আপডেট করা হয়েছে!");
        router.refresh();
      }
    } catch {
      toast.error("নাম আপডেট করতে সমস্যা হয়েছে, আবার চেষ্টা করুন");
    } finally {
      setUpdating(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-[85vh] bg-[#f4f7f4] py-10 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="h-28 bg-white rounded-3xl animate-pulse border border-slate-200" />
          <div className="h-44 bg-white rounded-3xl animate-pulse border border-slate-200" />
        </div>
      </div>
    );
  }

  const user = session?.user;
  const displayName = name || user?.name || "";
  const userInitials = (displayName || "U").slice(0, 2).toUpperCase();

  return (
    <div className="min-h-[85vh] bg-[#f4f7f4] py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            আমার প্রোফাইল
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
          </p>
        </div>

        {/* শীর্ষ প্রোফাইল কার্ড */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden relative border border-slate-200 flex items-center justify-center text-xl font-bold text-slate-600 shrink-0">
              {user?.image && !imageError ? (
                <Image
                  src={user.image}
                  alt={user.name || "Avatar"}
                  fill
                  className="object-cover"
                  onError={() => setImageError(true)}
                  unoptimized
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

        {/* তথ্য ফর্ম */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-800">তথ্য</h3>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">
                নাম
              </label>
              <input
                type="text"
                value={name || user?.name || ""}
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
              {updating ? "আপডেট হচ্ছে..." : "আপডেট"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}