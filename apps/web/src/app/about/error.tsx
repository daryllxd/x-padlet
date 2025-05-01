'use client';

import { Button } from '@/components/ui/button';

export default function AboutError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error(error);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="rounded-lg bg-red-50 p-6 text-center">
        <p className="text-red-600">Error loading about page</p>
        <Button
          onClick={reset}
          className="mt-4 rounded-md bg-red-100 px-4 py-2 text-sm text-red-700 transition-colors hover:bg-red-200"
        >
          Try Again
        </Button>
      </div>
    </div>
  );
}
