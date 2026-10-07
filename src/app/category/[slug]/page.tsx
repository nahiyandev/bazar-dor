"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import ProductCard, { Product, toBnNumber } from "@/components/ProductCard";

interface CategoryInfo {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
}

// API থেকে আসা পণ্যের সুনির্দিষ্ট টাইপ ডেফিনিশন (কোনো any নেই)
interface RawProductItem extends Product {
  category?: {
    slug?: string;
    nameBn?: string;
  } | string;
  categorySlug?: string;
  categoryId?: string | number;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

type SortOption = "default" | "lowToHigh" | "highToLow";

export default function CategoryPage({ params }: PageProps) {
  const { slug } = use(params);

  const [category, setCategory] = useState<CategoryInfo | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<SortOption>("default");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [catRes, prodRes] = await Promise.all([
          fetch("https://api.api-store.workers.dev/api/bazardor/categories"),
          fetch("https://api.api-store.workers.dev/api/bazardor/products"),
        ]);

        const categoriesData: CategoryInfo[] = await catRes.json();
        const productsData: RawProductItem[] = await prodRes.json();

        // ১. স্লাগ অথবা আইডির সাথে ম্যাচ করে ক্যাটাগরি চিহ্নিত করা
        const currentCat = categoriesData.find(
          (c) => c.slug?.toLowerCase() === slug.toLowerCase() || c.id === slug
        );
        setCategory(currentCat || null);

        // ২. টাইপ-সেফ ফিল্টারিং
        const filtered = productsData.filter((p) => {
          const pCatSlug =
            typeof p.category === "object" && p.category !== null
              ? p.category.slug
              : typeof p.category === "string"
              ? p.category
              : p.categorySlug || p.categoryId;

          const pCatNameBn =
            typeof p.category === "object" && p.category !== null
              ? p.category.nameBn
              : typeof p.category === "string"
              ? p.category
              : "";

          return (
            pCatSlug?.toString().toLowerCase() === slug.toLowerCase() ||
            (currentCat && pCatSlug?.toString() === currentCat.id?.toString()) ||
            (currentCat && pCatNameBn === currentCat.nameBn)
          );
        });

        setProducts(filtered);
      } catch (err) {
        console.error("Error loading category data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [slug]);

  // সর্টিং লজিক
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "lowToHigh") return a.today - b.today;
    if (sortBy === "highToLow") return b.today - a.today;
    return 0;
  });

  // ১. লোডিং অবস্থা
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f7f4] py-6 sm:py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 animate-pulse flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-200" />
            <div className="space-y-2 flex-1">
              <div className="h-6 w-36 bg-slate-200 rounded" />
              <div className="h-4 w-48 bg-slate-200 rounded" />
            </div>
          </div>
          <div className="bg-white border border-slate-200/90 rounded-xl p-4 flex justify-end animate-pulse">
            <div className="h-9 w-40 bg-slate-200 rounded" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-white border border-slate-200/90 rounded-2xl p-5 h-36 animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ২. এম্পটি অবস্থা
  if (!category || products.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#f4f7f4] flex flex-col items-center justify-center px-4">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-8 sm:p-12 text-center max-w-md w-full shadow-2xs">
          <div className="text-5xl mb-4">🧺</div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            কোনো পণ্য পাওয়া যায়নি
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            এই ক্যাটাগরিতে বর্তমানে কোনো পণ্য তালিকাভুক্ত নেই অথবা ভুল লিংকে প্রবেশ করেছেন।
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-[#0e8a44] hover:bg-[#0b6f36] text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-xs transition-colors"
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    );
  }

  // ৩. মূল কন্টেন্ট
  return (
    <div className="min-h-screen bg-[#f4f7f4] py-6 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-5">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 flex items-center gap-4 sm:gap-5 shadow-2xs">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-3xl sm:text-4xl shadow-2xs shrink-0">
            {category.icon || "📦"}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {category.nameBn}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              {toBnNumber(products.length)}টি পণ্যের আজকের দাম ও পরিবর্তন
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl px-4 sm:px-6 py-3 flex items-center justify-end gap-3 shadow-2xs">
          <label htmlFor="sort" className="text-xs sm:text-sm font-semibold text-slate-600">
            সাজান
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm font-medium rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#0e8a44] cursor-pointer"
          >
            <option value="default">ডিফল্ট</option>
            <option value="lowToHigh">দাম: কম থেকে বেশি</option>
            <option value="highToLow">দাম: বেশি থেকে কম</option>
          </select>
        </div>

        <div className="text-xs sm:text-sm font-medium text-slate-500 pt-1">
          মোট {toBnNumber(sortedProducts.length)}টি পণ্য দেখানো হচ্ছে
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}