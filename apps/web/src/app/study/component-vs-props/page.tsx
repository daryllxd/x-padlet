'use client';

import { useBlinkOnRender } from '@/hooks/useBlinkOnRender';
import { useMemo, useRef, useState } from 'react';

function Footer({ color }: { color: string }) {
  const divRef = useRef<HTMLDivElement>(null);
  useBlinkOnRender(divRef);

  return (
    <footer ref={divRef} className="mt-4 rounded border p-4" style={{ color }}>
      I am the ({color}) footer
    </footer>
  );
}

const footer = (color: string) => <Footer color={color} />;

function MainWithProps({ color }: { color: string }) {
  const divRef = useRef<HTMLDivElement>(null);
  useBlinkOnRender(divRef);

  const [count, setCount] = useState(0);
  const increment = () => setCount((c) => c + 1);

  return (
    <div ref={divRef} className="rounded border p-4">
      <h3 className="mb-2 font-semibold">Main with Props</h3>
      <button
        onClick={increment}
        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        The count is {count}
      </button>
      <Footer color={color} />
    </div>
  );
}

function MainWithComponent({ footer }: { footer: React.ReactNode }) {
  const divRef = useRef<HTMLDivElement>(null);
  useBlinkOnRender(divRef);

  const [count, setCount] = useState(0);
  const increment = () => setCount((c) => c + 1);

  return (
    <div ref={divRef} className="rounded border p-4">
      <h3 className="mb-2 font-semibold">Main with Component</h3>
      <button
        onClick={increment}
        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        The count is {count}
      </button>
      {footer}
    </div>
  );
}

function MainWithMemo({ color }: { color: string }) {
  const divRef = useRef<HTMLDivElement>(null);
  useBlinkOnRender(divRef);

  const [count, setCount] = useState(0);
  const increment = () => setCount((c) => c + 1);

  const memoizedFooter = useMemo(() => <Footer color={color} />, [color]);

  return (
    <div ref={divRef} className="rounded border p-4">
      <h3 className="mb-2 font-semibold">Main with useMemo</h3>
      <button
        onClick={increment}
        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        The count is {count}
      </button>
      {memoizedFooter}
    </div>
  );
}

function MainWithChildren({ children }: { children: React.ReactNode }) {
  const divRef = useRef<HTMLDivElement>(null);
  useBlinkOnRender(divRef);

  const [count, setCount] = useState(0);
  const increment = () => setCount((c) => c + 1);

  return (
    <div ref={divRef} className="rounded border p-4">
      <h3 className="mb-2 font-semibold">Main with Children</h3>
      <button
        onClick={increment}
        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        The count is {count}
      </button>
      {children}
    </div>
  );
}

export default function ComponentVsPropsPage() {
  const [color, setColor] = useState('black');

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-8 text-3xl font-bold">Component vs Props Performance</h1>

      <div className="space-y-8">
        <section className="rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">Set the footer color:</h2>
          <div className="flex gap-4">
            <button
              onClick={() => setColor('black')}
              className="rounded bg-gray-800 px-4 py-2 text-white hover:bg-gray-700"
            >
              Black
            </button>
            <button
              onClick={() => setColor('blue')}
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Blue
            </button>
            <button
              onClick={() => setColor('green')}
              className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
            >
              Green
            </button>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <MainWithProps color={color} />
          <MainWithComponent footer={footer(color)} />
          <MainWithMemo color={color} />
          <MainWithChildren>
            <Footer color={color} />
          </MainWithChildren>
        </div>

        <section className="rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">What's happening?</h2>
          <p className="mb-2">
            All components show a red border when they re-render. Notice the differences:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>Main with Props:</strong> When you click the increment button, only the Main
              component re-renders. The Footer component is created fresh each time.
            </li>
            <li>
              <strong>Main with Component:</strong> When you click the increment button, both Main
              and Footer re-render because the footer prop changes on every render.
            </li>
            <li>
              <strong>Main with useMemo:</strong> The Footer component is memoized and only
              re-renders when the color prop changes, not when the count changes.
            </li>
            <li>
              <strong>Main with Children:</strong> Similar to passing a component, but using the
              children prop pattern which is more idiomatic in React.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
