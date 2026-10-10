import React from "react";
import ProductCard, { Product } from "./ProductCard";
import AllProductsList from "./AllProductsList";

const PRIMARY_API = "https://api.api-store.workers.dev/api/bazardor/products";
const FALLBACK_API = "https://api.abcz.workers.dev/api/bazardor/products";


async function fetchProducts(): Promise<Product[]> {
  try {
    // ১. প্রথমে প্রাইমারি এপিআই চেষ্টা করবে
    const res = await fetch(PRIMARY_API, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (err) {
    console.warn("Primary API failed, trying fallback API:", err);
  }

  try {
    // ২. প্রাইমারি কাজ না করলে অটোমেটিক ব্যাকআপ এপিআই কল করবে
    const fallbackRes = await fetch(FALLBACK_API, {
      next: { revalidate: 60 },
    });
    if (fallbackRes.ok) {
      const data = await fallbackRes.json();
      if (Array.isArray(data)) return data;
    }
  } catch (err) {
    console.error("Fallback API also failed:", err);
  }

  return [];
}

export default async function ProductSections() {
  const products = await fetchProducts();

  // ১. আজ দাম বেড়েছে (Top 6 risers, sorted by % descending)
  const topRisers = products
    .filter((p) => p.change?.dir === "up")
    .sort((a, b) => (b.change?.pct || 0) - (a.change?.pct || 0))
    .slice(0, 6);

  // ২. আজ দাম কমেছে (Top 6 fallers, sorted by % descending)
  const topFallers = products
    .filter((p) => p.change?.dir === "down")
    .sort((a, b) => (b.change?.pct || 0) - (a.change?.pct || 0))
    .slice(0, 6);

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* 🔴 Section A: আজ দাম বেড়েছে (Top 6 Risers) */}
      {topRisers.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4 sm:mb-5">
            <span className="text-red-600 dark:text-red-400 text-sm sm:text-base font-black">▲</span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              আজ দাম বেড়েছে
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4">
            {topRisers.map((product) => (
              <ProductCard key={`riser-${product.id}`} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 🟢 Section B: আজ দাম কমেছে (Top 6 Fallers) */}
      {topFallers.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4 sm:mb-5">
            <span className="text-emerald-600 dark:text-emerald-400 text-sm sm:text-base font-black">▼</span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              আজ দাম কমেছে
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4">
            {topFallers.map((product) => (
              <ProductCard key={`faller-${product.id}`} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 🧺 Section C: সব পণ্য (সাজান ড্রপডাউন ও নিউমেরিক সর্টিং সহ) */}
      <AllProductsList initialProducts={products} />
    </div>
  );
}