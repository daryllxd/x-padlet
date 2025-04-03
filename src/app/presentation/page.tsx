'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useTodos } from '@/hooks/useTodos';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function PresentationPage() {
  const { data: todos } = useTodos('params.list_id');
  const [currentSlide, setCurrentSlide] = useState(0);

  // Filter out completed todos for presentation
  const activeTodos = todos.filter((todo) => !todo.completed);

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : activeTodos.length - 1));
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev < activeTodos.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="container mx-auto flex h-screen flex-col py-10">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Todo Presentation</h1>
          <Link href="/">
            <Button variant="outline" size="icon">
              <Home className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {activeTodos.length > 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="relative aspect-video w-full max-w-3xl">
            <Card className="flex h-full w-full flex-col">
              <CardContent className="flex flex-1 flex-col items-center justify-center p-10">
                <div className="flex h-full w-full flex-col items-center justify-center space-y-6 text-center">
                  <h2 className="text-4xl font-bold">{activeTodos[currentSlide]?.title}</h2>
                  <p className="text-xl">{activeTodos[currentSlide]?.description}</p>
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between border-t p-4">
                <p className="text-sm text-slate-500">
                  Slide {currentSlide + 1} of {activeTodos.length}
                </p>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" onClick={goToPrevSlide} className="h-8 w-8">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={goToNextSlide} className="h-8 w-8">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>

          <div className="mt-8 flex items-center justify-center gap-1">
            {activeTodos.map((_, index) => (
              <Button
                key={index}
                variant="ghost"
                size="icon"
                className={cn(
                  'h-2 w-2 rounded-full p-0',
                  index === currentSlide ? 'bg-primary' : 'bg-slate-200 hover:bg-slate-300'
                )}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center">
              <p className="text-slate-500">
                No active todos to present. Add some todos or mark some as incomplete.
              </p>
              <Link href="/" className="mt-4 block">
                <Button>Go to Todo List</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
