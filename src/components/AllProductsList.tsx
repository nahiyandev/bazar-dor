"use client";

import React, { useState, useMemo, ChangeEvent } from "react";
import ProductCard, { Product, toBnNumber } from "./ProductCard";

type SortOption = "default" | "lowToHigh" | "highToLow";

// বাংলা বা ইংরেজি সংখ্যার স্ট্রিং/নাম্বার থেকে নিউমেরিক ভ্যালু পাওয়ার ফাংশন (no-explicit-any মুক্ত)
const parseToNumericValue = (val: unknown): number => {
  if (typeof val === "number") return val;
  if (!val) return 0;
  const bnToEn: Record<string, string> = {
    "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4",
    "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9",
  };
  const str = String(val).replace(/[০-৯]/g, (d) => bnToEn[d] || d);
  const num = parseFloat(str.replace(/[^0-9.-]/g, ""));
  return isNaN(num) ? 0 : num;
};

// Product অবজেক্ট থেকে সেফলি দামের সংখ্যা বের করার হেল্পার
const extractProductPrice = (item: Product): number => {
  const record = item as unknown as Record<string, unknown>;

  // সম্ভাব্য বিভিন্ন স্ট্রাকচার চেক করা
  if (record.price !== undefined) {
    return parseToNumericValue(record.price);
  }
  if (record.currentPrice !== undefined) {
    return parseToNumericValue(record.currentPrice);
  }
  if (typeof record.prices === "object" && record.prices !== null) {
    const pricesObj = record.prices as Record<string, unknown>;
    return parseToNumericValue(pricesObj.avg ?? pricesObj.current ?? pricesObj.min);
  }
  return 0;
};

interface AllProductsListProps {
  initialProducts: Product[];
}

export default function AllProductsList({ initialProducts }: AllProductsListProps) {
  const [sortOption, setSortOption] = useState<SortOption>("default");

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value as SortOption);
  };

  // বাংলা সংখ্যাকে নিউমেরিক মানে কনভার্ট করে সর্টিং
  const sortedProducts = useMemo(() => {
    const list = [...initialProducts];
    if (sortOption === "lowToHigh") {
      return list.sort((a, b) => extractProductPrice(a) - extractProductPrice(b));
    }
    if (sortOption === "highToLow") {
      return list.sort((a, b) => extractProductPrice(b) - extractProductPrice(a));
    }
    return list;
  }, [initialProducts, sortOption]);

  return (
    <section id="all-products" className="scroll-mt-6">
      <div className="mb-4 sm:mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            সব পণ্য
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            মোট {toBnNumber(initialProducts.length)}টি পণ্য দেখানো হচ্ছে
          </p>
        </div>

        {/* সাজান (Sort) ড্রপডাউন with Chevron Icon */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <label htmlFor="sort-dropdown" className="text-xs sm:text-sm font-semibold text-slate-600">
            সাজান:
          </label>
          <div className="relative inline-block w-48">
            <select
              id="sort-dropdown"
              value={sortOption}
              onChange={handleSortChange}
              className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-3.5 py-2 pr-9 text-xs sm:text-sm font-medium text-slate-700 shadow-xs hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0e8a44] transition-all cursor-pointer"
            >
              <option value="default">ডিফল্ট</option>
              <option value="lowToHigh">দাম: কম থেকে বেশি</option>
              <option value="highToLow">দাম: বেশি থেকে কম</option>
            </select>
            {/* Chevron Icon */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* রেসপনসিভ গ্রিড */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-3.5 sm:gap-4">
        {sortedProducts.map((product) => (
          <ProductCard key={`all-${product.id}`} product={product} />
        ))}
      </div>
    </section>
  );
}