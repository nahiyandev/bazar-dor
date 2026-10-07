"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import Link from "next/link";

export default function EditProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedName = name.trim() || session?.user?.name?.trim();

    if (!updatedName) {
      toast.error("অনুগ্রহ করে একটি নাম লিখুন!");
      return;
    }

    setLoading(true);
    try {
      const { error } = await authClient.updateUser({
        name: updatedName,
      });

      if (error) {
        toast.error(error.message || "তথ্য আপডেট করা সম্ভব হয়নি");
      } else {
        toast.success("তথ্য সফলভাবে আপডেট করা হয়েছে!");
        router.push("/profile");
        router.refresh();
      }
    } catch {
      toast.error("কিছু ভুল হয়েছে, আবার চেষ্টা করুন");
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-200 border-t-[#0e8a44] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm space-y-6">
        <div>
          <Link
            href="/profile"
            className="text-xs font-semibold text-slate-500 hover:text-[#0e8a44] inline-flex items-center gap-1 mb-4"
          >
            ← প্রোফাইলে ফিরে যান
          </Link>
          <h1 className="text-xl font-bold text-slate-800">তথ্য আপডেট করুন</h1>
          <p className="text-xs text-slate-500 mt-1">আপনার প্রোফাইলের নাম পরিবর্তন করুন</p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label htmlFor="name-input" className="block text-xs font-bold text-slate-700 mb-1.5">
              নাম (Name)
            </label>
            <input
              key={session?.user?.name || "name-field"}
              id="name-input"
              type="text"
              defaultValue={session?.user?.name || ""}
              onChange={(e) => setName(e.target.value)}
              placeholder="আপনার পূর্ণ নাম লিখুন"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0e8a44] focus:bg-white transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0e8a44] hover:bg-[#0b6f36] text-white font-bold text-sm py-3 px-6 rounded-xl transition-colors shadow-xs disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? "হালনাগাদ হচ্ছে..." : "Update Information"}
          </button>
        </form>
      </div>
    </div>
  );
}