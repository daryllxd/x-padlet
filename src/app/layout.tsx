import "@/app/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TodoProvider } from "@/context/TodoContext";
import { NavBar } from "@/components/NavBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Todo Manager",
  description: "A simple todo manager application with presentation mode",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TodoProvider>
          <Toaster />
          <div className="flex flex-col min-h-screen">
            <NavBar />
            <main className="flex-1">{children}</main>
          </div>
        </TodoProvider>
      </body>
    </html>
  );
}
