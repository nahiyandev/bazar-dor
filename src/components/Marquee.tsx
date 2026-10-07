"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import FastMarquee from "react-fast-marquee";

interface ProductItem {
  id: number;
  slug?: string;
  nameBn: string;
  unit: string;
  image?: string;
  today: number;
  change?: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
}

export default function Marquee() {
  const [products, setProducts] = useState<ProductItem[]>([]);

  useEffect(() => {
    fetch("https://api.api-store.workers.dev/api/bazardor/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error loading marquee products:", err));
  }, []);

  if (!products.length) return null;

  return (
    <div className="w-full bg-[#f8faf8] border-y border-slate-200 py-1.5 overflow-hidden">
      <FastMarquee pauseOnHover={true} speed={100} gradient={false}>
        <div className="flex items-center gap-3 pr-3">
          {products.map((item) => {
            const isUp = item.change?.dir === "up";
            const isDown = item.change?.dir === "down";

            return (
              <Link
                key={item.id}
                href={`/products/${item.id}`}
                className="inline-flex items-center gap-2 whitespace-nowrap bg-white border border-slate-200 px-3.5 py-1.5 rounded-md shadow-2xs hover:border-[#0e8a44] transition-colors text-xs sm:text-sm text-slate-800"
              >
                <span className="text-base select-none">{item.image || "📦"}</span>
                <span className="font-semibold text-slate-800">{item.nameBn}</span>
                <span className="font-bold text-slate-900">
                  {item.today} টাকা/{item.unit === "kg" ? "কেজি" : item.unit}
                </span>

                {isUp && (
                  <span className="font-bold text-red-600 flex items-center ml-0.5">
                    ▲ {Math.abs(item.change?.pct || 0)}%
                  </span>
                )}
                {isDown && (
                  <span className="font-bold text-emerald-600 flex items-center ml-0.5">
                    ▼ {Math.abs(item.change?.pct || 0)}%
                  </span>
                )}
                {!isUp && !isDown && (
                  <span className="text-slate-400 font-semibold ml-0.5">- ০%</span>
                )}
              </Link>
            );
          })}
        </div>
      </FastMarquee>
    </div>
  );
}