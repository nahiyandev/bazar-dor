export default function Loading() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center gap-4 bg-[#f8faf8] px-4">
      <div className="relative flex items-center justify-center">
        {/* স্পিনিং রিং */}
        <div className="w-16 h-16 rounded-full border-4 border-emerald-100 border-t-[#0e8a44] animate-spin" />
        {/* সেন্ট্রাল আইকন */}
        <div className="absolute text-xl animate-pulse">🛒</div>
      </div>
      <div className="text-center space-y-1">
        <p className="text-sm font-bold text-slate-800">বাজার দর লোড হচ্ছে...</p>
        <p className="text-xs text-slate-400">একটু অপেক্ষা করুন</p>
      </div>
    </div>
  );
}