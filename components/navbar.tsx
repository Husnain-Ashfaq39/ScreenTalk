'use client';

import { Video, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useState } from 'react';

const routes = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'Join Meeting',
    href: '/join',
  },
  {
    label: 'Create Room',
    href: '/create',
  },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed w-full z-50 flex justify-between items-center py-2 px-4 border-b border-primary/10 bg-background h-16">
      <div className="flex items-center">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 bg-background">
            <div className="space-y-4 flex flex-col h-full bg-background">
              <div className="p-4 flex items-center gap-2">
                <Video className="h-8 w-8" />
                <span className="font-bold text-xl">ScreenTalk</span>
              </div>
              <div className="flex flex-col space-y-2 px-4">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                      'text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition',
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {route.label}
                  </Link>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <Link href="/" className="flex items-center gap-2">
          <Video className="h-8 w-8" />
          <span className="font-bold text-xl hidden md:block">ScreenTalk</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 mx-6">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {route.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <Button size="sm">Sign In</Button>
      </div>
    </div>
  );
}