export function TodoListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-lg bg-white p-6 shadow-md dark:bg-gray-800"
        >
          <div className="mb-4 h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="mb-2 h-4 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="mt-4 flex items-center justify-between">
            <div className="h-4 w-1/4 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-8 w-8 rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
