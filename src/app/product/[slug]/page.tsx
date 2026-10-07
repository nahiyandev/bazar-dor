import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

// বাংলা সংখ্যা কনভার্টার
const toBn = (num: number | string | undefined | null): string => {
  if (num === undefined || num === null) return "০";
  const bnDigits: { [key: string]: string } = {
    "0": "০", "1": "১", "2": "২", "3": "৩", "4": "৪",
    "5": "৫", "6": "৬", "7": "৭", "8": "৮", "9": "৯",
  };
  return num
    .toLocaleString("en-US")
    .replace(/[0-9]/g, (digit) => bnDigits[digit] || digit);
};

// একক ফরম্যাট
const formatUnit = (unit: string) => {
  switch (unit?.toLowerCase()) {
    case "kg":
      return "প্রতি কেজি";
    case "liter":
    case "litre":
      return "প্রতি লিটার";
    case "dozen":
      return "প্রতি ডজন";
    case "piece":
    case "pc":
      return "প্রতি পিস";
    default:
      return `প্রতি ${unit}`;
  }
};

interface MarketPrice {
  bazarName: string;
  division: string;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
}

interface ProductDetail {
  id: number;
  slug: string;
  nameBn: string;
  category: {
    nameBn: string;
    slug: string;
  };
  unit: string;
  image?: string;
  today: number;
  yesterday?: number;
  change?: {
    dir: "up" | "down" | "flat";
    pct: number;
    amount?: number;
  };
  summary?: {
    minPrice: number;
    maxPrice: number;
    avgPrice: number;
  };
  markets?: MarketPrice[];
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let product: ProductDetail | null = null;

  try {
    const res = await fetch(
      `https://api.api-store.workers.dev/api/bazardor/products/${slug}`,
      { next: { revalidate: 60 } }
    );
    if (res.ok) {
      product = await res.json();
    }
  } catch (err) {
    console.error("Error fetching product detail:", err);
  }

  if (!product) {
    // API যদি স্লাগ বা আইডি উভয় সাপোর্ট করে, তবে ফলব্যাক ফেচ ট্রাই করতে পারেন
    notFound();
  }

  const isUp = product.change?.dir === "up";
  const isDown = product.change?.dir === "down";

  // সারসংক্ষেপের মান নির্ধারণ
  const minPrice = product.summary?.minPrice ?? product.today;
  const maxPrice = product.summary?.maxPrice ?? product.today;
  const avgPrice = product.summary?.avgPrice ?? product.today;

  return (
    <div className="min-h-screen bg-[#f4f7f4] py-6 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* ১. ব্রেডক্রাম্ব (Breadcrumb) */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 font-medium">
          <Link href="/" className="hover:text-slate-900 transition-colors">
            হোম
          </Link>
          <span>›</span>
          <Link
            href={`/?category=${product.category?.slug || ""}`}
            className="hover:text-slate-900 transition-colors"
          >
            {product.category?.nameBn || "পণ্য"}
          </Link>
          <span>›</span>
          <span className="text-slate-700 font-semibold">{product.nameBn}</span>
        </nav>

        {/* ২. শীর্ষ সারসংক্ষেপ কার্ড (Top Summary Card) */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xs">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shadow-2xs shrink-0">
              {product.image || "📦"}
            </div>
            <div className="space-y-1 sm:space-y-1.5">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
                {product.nameBn}
              </h1>
              <p className="text-xs sm:text-sm font-medium text-slate-500">
                {formatUnit(product.unit)} • {product.category?.nameBn}
              </p>
              <p className="text-xs sm:text-sm font-medium text-slate-600">
                গতকালের তুলনায় আজ দাম{" "}
                <span
                  className={`font-bold ${
                    isUp ? "text-red-600" : isDown ? "text-emerald-600" : "text-slate-700"
                  }`}
                >
                  {isUp ? "বেড়েছে" : isDown ? "কমেছে" : "অপরিবর্তিত"}
                </span>{" "}
                - {toBn(product.change?.amount || 2)} টাকা
              </p>
            </div>
          </div>

          {/* আজকের দামের ব্যাজ কার্ড */}
          <div className="w-full md:w-auto bg-[#f8faf8] border border-slate-200/80 rounded-xl p-4 sm:px-6 sm:py-3.5 text-center shrink-0">
            <span className="block text-xs font-semibold text-slate-500 mb-1">
              আজকের দাম
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 leading-none">
              {toBn(product.today)}
            </div>
            <span className="block text-xs text-slate-600 font-medium mt-1">
              টাকা / {product.unit === "kg" ? "কেজি" : product.unit}
            </span>
            <div className="mt-1.5">
              <span
                className={`text-xs font-bold ${
                  isUp ? "text-red-600" : isDown ? "text-emerald-600" : "text-slate-500"
                }`}
              >
                {isUp ? "▲" : isDown ? "▼" : "—"}{" "}
                {toBn(Math.abs(product.change?.pct || 0).toFixed(1))}%
              </span>
            </div>
          </div>
        </div>

        {/* ৩. দামের সারসংক্ষেপ (৩টি কার্ড) */}
        <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            দামের সারসংক্ষেপ
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* সর্বনিম্ন দাম */}
            <div className="bg-[#fcfdfc] border border-slate-200/80 rounded-xl p-5 text-left">
              <span className="text-xs font-semibold text-slate-500 block mb-1">
                সর্বনিম্ন দাম
              </span>
              <div className="text-xl sm:text-2xl font-black text-emerald-600">
                {toBn(minPrice)}{" "}
                <span className="text-xs font-bold text-emerald-600">টাকা</span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 mt-2">
                সবচেয়ে কম দামের বাজার
              </p>
            </div>

            {/* সর্বাধিক দাম */}
            <div className="bg-[#fcfdfc] border border-slate-200/80 rounded-xl p-5 text-left">
              <span className="text-xs font-semibold text-slate-500 block mb-1">
                সর্বাধিক দাম
              </span>
              <div className="text-xl sm:text-2xl font-black text-red-600">
                {toBn(maxPrice)}{" "}
                <span className="text-xs font-bold text-red-600">টাকা</span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 mt-2">
                সবচেয়ে বেশি দামের বাজার
              </p>
            </div>

            {/* গড় দাম */}
            <div className="bg-[#fcfdfc] border border-slate-200/80 rounded-xl p-5 text-left">
              <span className="text-xs font-semibold text-slate-500 block mb-1">
                গড় দাম
              </span>
              <div className="text-xl sm:text-2xl font-black text-[#0e8a44]">
                {toBn(avgPrice)}{" "}
                <span className="text-xs font-bold text-[#0e8a44]">টাকা</span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 mt-2">
                প্রতি {product.unit === "kg" ? "কেজি" : product.unit}-এর হিসাবে
              </p>
            </div>
          </div>

          {/* ৪. বাজারভিত্তিক আজকের দাম (টেবিল) */}
          <div className="pt-4 space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              বাজারভিত্তিক আজকের দাম
            </h2>

            <div className="overflow-x-auto border border-slate-200/90 rounded-xl">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#f8faf8] border-b border-slate-200 text-slate-600 font-bold">
                  <tr>
                    <th className="py-3 px-4">বাজার</th>
                    <th className="py-3 px-4">বিভাগ</th>
                    <th className="py-3 px-4">সর্বনিম্ন</th>
                    <th className="py-3 px-4">সর্বাধিক</th>
                    <th className="py-3 px-4 text-right">গড়</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {product.markets && product.markets.length > 0 ? (
                    product.markets.map((m, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/75 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-slate-800">
                          {m.bazarName}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">{m.division}</td>
                        <td className="py-3.5 px-4 text-slate-700 font-medium">
                          {toBn(m.minPrice)} টাকা
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 font-medium">
                          {toBn(m.maxPrice)} টাকা
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                          {toBn(m.avgPrice)} টাকা
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-500 font-medium">
                        কোনো বাজারভিত্তিক তথ্য পাওয়া যায়নি।
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}