import React from "react";
import ProductCard, { Product, toBnNumber } from "./ProductCard";

export default async function ProductSections() {
  let products: Product[] = [];

  try {
    const res = await fetch("https://api.api-store.workers.dev/api/bazardor/products", {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      products = await res.json();
    }
  } catch (err) {
    console.error("Failed to load products for sections:", err);
  }

  // ১. আজ দাম বেড়েছে (Top 6 risers, sorted by % descending)
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
      {/* 🔴 Section A: আজ দাম বেড়েছে (Top 6 Risers) */}
      {topRisers.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4 sm:mb-5">
            <span className="text-red-600 text-sm sm:text-base font-black">▲</span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              আজ দাম বেড়েছে
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
            <span className="text-emerald-600 text-sm sm:text-base font-black">▼</span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
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

      {/* 🧺 Section C: সব পণ্য (All Products Grid) */}
      <section id="all-products" className="scroll-mt-6">
        <div className="mb-4 sm:mb-5">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            সব পণ্য
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            মোট {toBnNumber(products.length)}টি পণ্য দেখানো হচ্ছে
          </p>
        </div>

        {/* রেসপনসিভ গ্রিড: মোবাইল ১ কলাম, ট্যাবলেট ২ কলাম, বড় স্ক্রিনে ৩-৪ কলাম */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-3.5 sm:gap-4">
          {products.map((product) => (
            <ProductCard key={`all-${product.id}`} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}