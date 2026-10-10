import React from "react";
import Link from "next/link";

export interface Product {
  id: number;
  nameBn: string;
  unit: string;
  image?: string;
  today: number;
  change?: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
}

// ইংরেজি সংখ্যাকে বাংলা সংখ্যায় রূপান্তর করার হেল্পার ফাংশন
export const toBnNumber = (num: number | string): string => {
  const bnDigits: { [key: string]: string } = {
    "0": "০", "1": "১", "2": "২", "3": "৩", "4": "৪",
    "5": "৫", "6": "৬", "7": "৭", "8": "৮", "9": "৯",
  };
  return num
    .toLocaleString("en-US")
    .replace(/[0-9]/g, (digit) => bnDigits[digit] || digit);
};

// এককের নাম বাংলায় রূপান্তর
export const formatUnit = (unit: string) => {
  switch (unit?.toLowerCase()) {
    case "kg":
      return "প্রতি কেজি";
    case "liter":
    case "litre":
      return "প্রতি লিটার";
    case "dozen":
      return "প্রতি ডজন";
    case "piece":
      return "প্রতি পিস";
    default:
      return `প্রতি ${unit}`;
  }
};

export default function ProductCard({ product }: { product: Product }) {
  const isUp = product.change?.dir === "up";
  const isDown = product.change?.dir === "down";
  const pctBn = toBnNumber((product.change?.pct ?? 0).toFixed(1));

  return (
    <Link
      href={`/products/${product.id}`}
      className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:shadow-md hover:border-[#0e8a44]/50 dark:hover:border-[#0e8a44]/60 transition-all duration-200 group text-left"
    >
      {/* উপরের অংশ: ইমোজি/ছবি + নাম + একক */}
      <div className="flex items-center gap-3 sm:gap-3.5 mb-5 sm:mb-6">
        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
          {product.image || "📦"}
        </div>
        <div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base group-hover:text-[#0e8a44] dark:group-hover:text-emerald-400 transition-colors leading-snug">
            {product.nameBn}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            {formatUnit(product.unit)}
          </p>
        </div>
      </div>

      {/* নিচের অংশ: আজকের দাম এবং চেঞ্জ ব্যাজ */}
      <div className="flex items-end justify-between pt-1">
        <div>
          <span className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">
            আজকের দাম
          </span>
          <span className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-none">
            {toBnNumber(product.today)}{" "}
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">টাকা</span>
          </span>
        </div>

        {/* চেঞ্জ ব্যাজ (আপ = লাল, ডাউন = সবুজ, ফ্ল্যাট = ধূসর) */}
        <div
          className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 shrink-0 ${
            isUp
              ? "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200/60 dark:border-red-800/50"
              : isDown
              ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/50"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
          }`}
        >
          {isUp && <span>▲ {pctBn}%</span>}
          {isDown && <span>▼ {pctBn}%</span>}
          {!isUp && !isDown && <span>— ০.০%</span>}
        </div>
      </div>
    </Link>
  );
}