export default function CardSkeleton() {
  return (
    <div className="w-[400px] bg-neutral-900 border border-neutral-800 rounded-2xl p-5 animate-pulse">
      <div className="h-4 w-24 bg-neutral-700 rounded mb-4" />
      <div className="h-5 w-56 bg-neutral-700 rounded mb-4" />
      <div className="h-4 w-40 bg-neutral-800 rounded mb-2" />
      <div className="h-4 w-28 bg-neutral-800 rounded mb-6" />
      <div className="flex gap-3">
        <div className="h-10 w-24 bg-neutral-700 rounded" />
        <div className="h-10 w-24 bg-neutral-700 rounded" />
      </div>
    </div>
  );
}
