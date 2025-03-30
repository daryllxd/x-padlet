"use client";

import { useState } from "react";
import { useTodo } from "@/context/TodoContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function PresentationPage() {
  const { todos } = useTodo();
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
    <div className="container mx-auto py-10 flex flex-col h-screen">
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
        <div className="flex flex-col items-center justify-center flex-1">
          <div className="relative w-full max-w-3xl aspect-video">
            <Card className="w-full h-full flex flex-col">
              <CardContent className="flex-1 flex flex-col items-center justify-center p-10">
                <div className="w-full h-full flex flex-col items-center justify-center text-center space-y-6">
                  <h2 className="text-4xl font-bold">
                    {activeTodos[currentSlide]?.title}
                  </h2>
                  <p className="text-xl">
                    {activeTodos[currentSlide]?.description}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between p-4 border-t">
                <p className="text-sm text-slate-500">
                  Slide {currentSlide + 1} of {activeTodos.length}
                </p>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={goToPrevSlide}
                    className="h-8 w-8"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={goToNextSlide}
                    className="h-8 w-8"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>

          <div className="flex items-center justify-center mt-8 gap-1">
            {activeTodos.map((_, index) => (
              <Button
                key={index}
                variant="ghost"
                size="icon"
                className={cn(
                  "h-2 w-2 rounded-full p-0",
                  index === currentSlide
                    ? "bg-primary"
                    : "bg-slate-200 hover:bg-slate-300"
                )}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center">
              <p className="text-slate-500">
                No active todos to present. Add some todos or mark some as
                incomplete.
              </p>
              <Link href="/" className="block mt-4">
                <Button>Go to Todo List</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
