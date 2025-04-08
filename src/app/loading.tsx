import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 flex items-center justify-between">
        <Skeleton className="h-12 w-56" />
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
