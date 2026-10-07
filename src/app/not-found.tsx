import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4 bg-[#f8faf8]">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm">
        {/* আইকন বা ইলাস্ট্রেশন */}
        <div className="relative inline-flex items-center justify-center">
          <div className="w-24 h-24 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-5xl shadow-inner border border-emerald-100">
            🧺
          </div>
          <span className="absolute -top-2 -right-2 px-2.5 py-1 bg-rose-500 text-white text-xs font-black rounded-full shadow-md animate-bounce">
            ৪০৪
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            পণ্যটি বাজারে খুঁজে পাওয়া যায়নি!
          </h1>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            আপনি যে পেজ বা পণ্যের সন্ধান করছেন তা হয়তো সরানো হয়েছে অথবা লিংকটি ভুল।
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 bg-[#0e8a44] hover:bg-[#0b6f36] text-white font-bold py-3 px-6 rounded-2xl shadow-sm transition-colors text-sm"
          >
            <span>🏠</span> বাজারে ফিরে যান
          </Link>
        </div>
      </div>
    </main>
  );
}