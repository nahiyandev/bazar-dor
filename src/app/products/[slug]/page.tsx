import React, { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

// বাংলা সংখ্যা কনভার্টার
const toBn = (num: number | string | undefined | null): string => {
  if (num === undefined || num === null || Number.isNaN(Number(num))) return "০";
  const bnDigits: Record<string, string> = {
    "0": "০", "1": "১", "2": "২", "3": "৩", "4": "৪",
    "5": "৫", "6": "৬", "7": "৭", "8": "৮", "9": "৯",
  };
  return num
    .toLocaleString("en-US")
    .replace(/[0-9]/g, (digit) => bnDigits[digit] || digit);
};

// একক ফরম্যাটিং
const formatUnit = (unit?: string) => {
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
      return unit ? `প্রতি ${unit}` : "প্রতি কেজি";
  }
};

// ক্যাটাগরি স্লাগ থেকে বাংলা নামের ম্যাপিং
const categoryNameMap: Record<string, string> = {
  chal: "চাল",
  dal: "ডাল",
  tel: "তেল",
  sobji: "সবজি",
  mach: "মাছ",
  mangsho: "মাংস",
  "dim-dudh": "ডিম-দুধ",
  mosla: "মসলা",
};

interface MarketPriceItem {
  bazarName?: string;
  name?: string;
  market?: string;
  bazar?: string;
  division?: string;
  bibhag?: string;
  minPrice?: number;
  min?: number;
  min_price?: number;
  maxPrice?: number;
  max?: number;
  max_price?: number;
  avgPrice?: number;
  avg?: number;
  avg_price?: number;
  price?: number;
}

interface ProductDetailData {
  id: number;
  slug?: string;
  nameBn: string;
  category?: {
    nameBn?: string;
    slug?: string;
  } | string;
  categoryNameBn?: string;
  categorySlug?: string;
  unit?: string;
  image?: string;
  today: number;
  yesterday?: number;
  change?: {
    dir: "up" | "down" | "flat";
    pct: number;
    amount?: number;
  };
  summary?: {
    minPrice?: number;
    min?: number;
    maxPrice?: number;
    max?: number;
    avgPrice?: number;
    avg?: number;
  };
  minPrice?: number;
  maxPrice?: number;
  avgPrice?: number;
  markets?: MarketPriceItem[];
  marketPrices?: MarketPriceItem[];
  bazars?: MarketPriceItem[];
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function fetchProduct(slugOrId: string): Promise<ProductDetailData | null> {
  try {
    const directRes = await fetch(
      `https://api.api-store.workers.dev/api/bazardor/products/${slugOrId}`,
      { cache: "no-store" }
    );

    if (directRes.ok) {
      const data: ProductDetailData = await directRes.json();
      if (data && (data.id || data.nameBn)) {
        return data;
      }
    }

    const allRes = await fetch("https://api.api-store.workers.dev/api/bazardor/products", {
      cache: "no-store",
    });

    if (allRes.ok) {
      const allProducts: ProductDetailData[] = await allRes.json();
      const matched = allProducts.find(
        (p) =>
          p.id?.toString() === slugOrId ||
          p.slug?.toLowerCase() === slugOrId.toLowerCase()
      );
      if (matched) return matched;
    }
  } catch (error) {
    console.error("Product fetch error:", error);
  }

  return null;
}

async function ProductContent({ params }: PageProps) {
  const { slug } = await params;
  const product = await fetchProduct(slug);

  if (!product) {
    notFound();
  }

  const isUp = product.change?.dir === "up";
  const isDown = product.change?.dir === "down";

  // ক্যাটাগরি স্লাগ ও বাংলা নাম নির্ধারণ
  const rawCatSlug =
    typeof product.category === "object" && product.category !== null
      ? product.category.slug
      : typeof product.category === "string"
      ? product.category
      : product.categorySlug || "";

  const categorySlug = rawCatSlug?.toLowerCase() || "";

  const categoryName =
    typeof product.category === "object" && product.category !== null && product.category.nameBn
      ? product.category.nameBn
      : product.categoryNameBn ||
        categoryNameMap[categorySlug] ||
        categorySlug ||
        "পণ্য";

  const marketList: MarketPriceItem[] =
    product.markets || product.marketPrices || product.bazars || [];

  const minPrice =
    product.summary?.minPrice ??
    product.summary?.min ??
    product.minPrice ??
    (marketList.length > 0
      ? Math.min(...marketList.map((m) => m.minPrice ?? m.min ?? m.min_price ?? product.today))
      : product.today);

  const maxPrice =
    product.summary?.maxPrice ??
    product.summary?.max ??
    product.maxPrice ??
    (marketList.length > 0
      ? Math.max(...marketList.map((m) => m.maxPrice ?? m.max ?? m.max_price ?? product.today))
      : product.today);

  const avgPrice =
    product.summary?.avgPrice ??
    product.summary?.avg ??
    product.avgPrice ??
    product.today;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
      {/* ব্রেডক্রাম্ব */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 font-medium">
        <Link href="/" className="hover:text-slate-900 transition-colors">
          হোম
        </Link>
        <span>›</span>
        {categorySlug ? (
          <Link
            href={`/category/${categorySlug}`}
            className="hover:text-slate-900 transition-colors"
          >
            {categoryName}
          </Link>
        ) : (
          <span className="text-slate-500">{categoryName}</span>
        )}
        <span>›</span>
        <span className="text-slate-700 font-semibold">{product.nameBn}</span>
      </nav>

      {/* শীর্ষ সারসংক্ষেপ */}
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
              {formatUnit(product.unit)} • {categoryName}
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
              - {toBn(product.change?.amount ?? 2)} টাকা
            </p>
          </div>
        </div>

        <div className="w-full md:w-auto bg-[#f8faf8] border border-slate-200/80 rounded-xl p-4 sm:px-6 sm:py-3.5 text-center shrink-0">
          <span className="block text-xs font-semibold text-slate-500 mb-1">
            আজকের দাম
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 leading-none">
            {toBn(product.today)}
          </div>
          <span className="block text-xs text-slate-600 font-medium mt-1">
            টাকা / {product.unit === "kg" ? "কেজি" : product.unit || "কেজি"}
          </span>
          <div className="mt-1.5">
            <span
              className={`text-xs font-bold ${
                isUp ? "text-red-600" : isDown ? "text-emerald-600" : "text-slate-500"
              }`}
            >
              {isUp ? "▲" : isDown ? "▼" : "—"}{" "}
              {toBn(Math.abs(product.change?.pct ?? 0).toFixed(1))}%
            </span>
          </div>
        </div>
      </div>

      {/* সারসংক্ষেপ কার্ড ৩টি */}
      <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
          দামের সারসংক্ষেপ
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

          <div className="bg-[#fcfdfc] border border-slate-200/80 rounded-xl p-5 text-left">
            <span className="text-xs font-semibold text-slate-500 block mb-1">
              গড় দাম
            </span>
            <div className="text-xl sm:text-2xl font-black text-[#0e8a44]">
              {toBn(avgPrice)}{" "}
              <span className="text-xs font-bold text-[#0e8a44]">টাকা</span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 mt-2">
              প্রতি {product.unit === "kg" ? "কেজি" : product.unit || "কেজি"}-এর হিসাবে
            </p>
          </div>
        </div>

        {/* বাজারভিত্তিক টেবিল */}
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
                {marketList.length > 0 ? (
                  marketList.map((m, idx) => {
                    const bazarName = m.bazarName || m.bazar || m.name || m.market || "বাজার";
                    const division = m.division || m.bibhag || "বিভাগ";
                    const itemMin = m.minPrice ?? m.min ?? m.min_price ?? m.price ?? product.today;
                    const itemMax = m.maxPrice ?? m.max ?? m.max_price ?? m.price ?? product.today;
                    const itemAvg = m.avgPrice ?? m.avg ?? m.avg_price ?? Math.round((itemMin + itemMax) / 2);

                    return (
                      <tr key={idx} className="hover:bg-slate-50/75 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-slate-800">
                          {bazarName}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">{division}</td>
                        <td className="py-3.5 px-4 text-slate-700 font-medium">
                          {toBn(itemMin)} টাকা
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 font-medium">
                          {toBn(itemMax)} টাকা
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                          {toBn(itemAvg)} টাকা
                        </td>
                      </tr>
                    );
                  })
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
  );
}

export default function ProductDetailPage({ params }: PageProps) {
  return (
    <div className="min-h-screen bg-[#f4f7f4] py-6 sm:py-8">
      <Suspense
        fallback={
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="h-64 bg-white rounded-2xl animate-pulse border border-slate-200" />
          </div>
        }
      >
        <ProductContent params={params} />
      </Suspense>
    </div>
  );
}