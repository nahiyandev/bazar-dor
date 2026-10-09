

export default function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 animate-pulse space-y-3">
      <div className="w-full h-36 bg-slate-200/70 rounded-xl" />
      <div className="h-4 bg-slate-200/70 rounded-md w-3/4" />
      <div className="h-3 bg-slate-200/70 rounded-md w-1/2" />
      <div className="h-8 bg-slate-200/70 rounded-xl w-full mt-2" />
    </div>
  );
}