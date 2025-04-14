export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 flex items-center justify-between">
          <div className="space-y-1">
            <div className="h-10 w-48 animate-pulse rounded bg-slate-200"></div>
            <div className="h-5 w-64 animate-pulse rounded bg-slate-200"></div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
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
