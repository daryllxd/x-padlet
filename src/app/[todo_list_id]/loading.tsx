export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-4 py-6 sm:py-10">
        <header className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1 sm:gap-2">
              <div className="flex items-center gap-2">
                <div className="h-8 w-48 animate-pulse rounded-md bg-slate-200 sm:h-10" />
              </div>
              <div className="h-4 w-64 animate-pulse rounded-md bg-slate-200" />
            </div>
            <div className="flex flex-col gap-4 lg:flex-row">
              <div className="h-10 w-32 animate-pulse rounded-md bg-slate-200" />
              <div className="h-10 w-32 animate-pulse rounded-md bg-slate-200" />
            </div>
          </div>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex h-32 animate-pulse flex-col gap-2 rounded-lg border border-slate-200 bg-white p-4"
            >
              <div className="h-4 w-3/4 rounded-md bg-slate-200" />
              <div className="h-4 w-1/2 rounded-md bg-slate-200" />
              <div className="mt-auto flex justify-end gap-2">
                <div className="h-8 w-8 rounded-md bg-slate-200" />
                <div className="h-8 w-8 rounded-md bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
