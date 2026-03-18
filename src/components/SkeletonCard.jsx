export default function SkeletonCard() {
  return (
    <div className="card p-4 flex flex-col gap-3" aria-hidden="true">
      <div className="flex justify-between">
        <div className="skeleton w-10 h-8 rounded" />
        <div className="skeleton w-16 h-5 rounded-full" />
      </div>
      <div className="skeleton w-3/4 h-6 rounded" />
      <div className="skeleton w-1/2 h-4 rounded" />
      <div className="pt-2 border-t border-gray-800">
        <div className="skeleton w-16 h-5 rounded" />
      </div>
    </div>
  )
}

export function SkeletonGrid() {
  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
      aria-label="Loading teams…"
      aria-busy="true"
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
