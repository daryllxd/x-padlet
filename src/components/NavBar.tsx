"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ListTodo, Presentation } from "lucide-react";

export function NavBar() {
  const pathname = usePathname();

  const links = [
    {
      name: "Todo List",
      href: "/",
      icon: <ListTodo className="h-4 w-4 mr-2" />,
      active: pathname === "/",
    },
    {
      name: "Presentation",
      href: "/presentation",
      icon: <Presentation className="h-4 w-4 mr-2" />,
      active: pathname === "/presentation",
    },
  ];

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 flex h-14 items-center">
        <div className="mr-4">
          <span className="font-bold text-lg">Todo Manager</span>
        </div>
        <div className="flex space-x-4">
          {links.map((link) => (
            <Link href={link.href} key={link.href}>
              <Button
                variant={link.active ? "default" : "ghost"}
                className={cn(
                  "flex items-center",
                  link.active && "pointer-events-none"
                )}
              >
                {link.icon}
                {link.name}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
