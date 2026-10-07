import React, { Suspense } from "react";
import Hero from "@/components/Hero";
import ProductSections from "@/components/ProductSections";

// প্রোডাক্ট লোডিং স্কেলিটন কম্পোনেন্ট
function ProductSectionsSkeleton() {
  return (
    <div className="space-y-12">
      {[1, 2].map((section) => (
        <div key={section} className="space-y-5">
          {/* ক্যাটাগরি টাইটেল স্কেলিটন */}
          <div className="flex items-center justify-between">
            <div className="h-6 w-36 bg-slate-200/80 rounded-lg animate-pulse" />
            <div className="h-4 w-20 bg-slate-200/80 rounded-md animate-pulse" />
          </div>

          {/* প্রোডাক্ট গ্রিড স্কেলিটন */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3 animate-pulse"
              >
                {/* ইমেজ প্লেসহোল্ডার */}
                <div className="w-full h-36 bg-slate-200/80 rounded-xl" />
                {/* নাম */}
                <div className="h-4 bg-slate-200/80 rounded-md w-3/4" />
                {/* দাম */}
                <div className="h-3 bg-slate-200/80 rounded-md w-1/2" />
                {/* বাটন */}
                <div className="h-9 bg-slate-200/80 rounded-xl w-full mt-2" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const Home = () => {
  return (
    <div className="min-h-screen bg-[#f8faf8]">
      {/* ব্যানার / হিরো সেকশন */}
      <Hero />

      {/* মূল প্রোডাক্ট সেকশনসমূহ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <Suspense fallback={<ProductSectionsSkeleton />}>
          <ProductSections />
        </Suspense>
      </main>
    </div>
  );
};

export default Home;