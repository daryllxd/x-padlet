export const dynamic = 'force-static';
import Link from 'next/link';

export default function StudyPage() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">React Study Examples</h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Link
          href="/study/component-vs-props"
          className="rounded-lg border p-6 hover:border-blue-500 hover:bg-blue-50"
        >
          <h3 className="mb-2 text-xl font-semibold">Component vs Props</h3>
          <p className="text-gray-600">
            Learn about different ways to pass components and their performance implications.
          </p>
        </Link>

        <Link
          href="/study/react-performance"
          className="rounded-lg border p-6 hover:border-blue-500 hover:bg-blue-50"
        >
          <h3 className="mb-2 text-xl font-semibold">React Performance</h3>
          <p className="text-gray-600">
            Explore performance optimization techniques in React using useMemo.
          </p>
        </Link>
      </div>
    </div>
  );
}
