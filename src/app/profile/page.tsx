"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [name, setName] = useState<string>("");

  useEffect(() => {
    if (!isPending) {
      if (!session?.user) {
        toast.warn("প্রোফাইল দেখার জন্য অনুগ্রহ করে প্রথমে সাইন ইন করুন");
        router.push("/signin");
      } else if (session.user.name && !name) {
        const userName = session.user.name;
        setTimeout(() => setName(userName), 0);
      }
    }
  }, [session, isPending, router, name]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("সফলভাবে অ্যাকাউন্ট থেকে সাইন আউট হয়েছে");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("সাইন আউট ব্যর্থ হয়েছে, অনুগ্রহ করে আবার চেষ্টা করুন");
    }
  };

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("নামের ঘর ফাঁকা রাখা যাবে না");
      return;
    }
    toast.success("আপনার নাম সফলভাবে আপডেট করা হয়েছে!");
  };

  if (isPending) {
    return (
      <div className="min-h-[80vh] bg-[#f4f7f4] py-10 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="h-28 bg-white rounded-3xl animate-pulse border border-slate-200" />
          <div className="h-44 bg-white rounded-3xl animate-pulse border border-slate-200" />
        </div>
      </div>
    );
  }

  const user = session?.user;

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
            <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden relative border border-slate-200 flex items-center justify-center text-2xl font-bold text-slate-600">
              {user?.image ? (
                <Image
                  src={user.image}
                  alt={user.name || "User Avatar"}
                  fill
                  className="object-cover"
                />
              ) : (
                <span>👤</span>
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="আপনার নাম লিখুন"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:outline-none focus:ring-1 focus:ring-[#0e8a44]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#0e8a44] hover:bg-[#0b6f36] text-white font-bold py-2.5 rounded-xl shadow-xs transition-colors text-sm cursor-pointer"
            >
              আপডেট
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}