export default function ProductLoading() {
  return (
    <div className="bg-brand-cream">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 h-4 w-2/3 animate-pulse rounded bg-brand-black/10 sm:w-1/3" />
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="aspect-square w-full animate-pulse rounded-2xl border border-brand-black/10 bg-white" />
          <div className="flex flex-col gap-6">
            <div className="h-6 w-24 animate-pulse rounded bg-brand-black/10" />
            <div className="h-10 w-3/4 animate-pulse rounded bg-brand-black/10" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-brand-black/10" />
            <div className="h-24 animate-pulse rounded-xl bg-white ring-1 ring-brand-black/10" />
            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-brand-black/10" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-brand-black/10" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-brand-black/10" />
            </div>
            <div className="h-12 w-full animate-pulse rounded-lg bg-brand-black/10 sm:w-56" />
          </div>
        </div>
      </div>
    </div>
  )
}
