"use client";

import React from 'react';
import { LogIn, LogOut, PaletteIcon } from 'lucide-react';
import { AyandaLogoIcon } from './AyandaLogoIcon';
import { cn } from '@/lib/utils';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ThemeCustomizer } from './ThemeCustomizer';

export function Header() {
  const { data: session, status } = useSession();

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-[95]",
        "flex items-center justify-between",
        "px-6 py-4",
        "bg-background", // Use themed background
        "shadow-[0_2px_10px_rgba(0,0,0,0.2)] border-b border-border" // Use themed border
      )}
      style={{ height: '5rem' }}
    >
      <Link href={session ? "/" : "/landing"} className="flex items-center space-x-3 cursor-pointer group">
        <AyandaLogoIcon className="group-hover:scale-110 transition-transform duration-200" />
        <h1 className="font-orbitron text-3xl font-bold tracking-wider accent-text group-hover:brightness-110 transition-all duration-200">AYANDA</h1>
      </Link>
      
      <div className="flex items-center gap-3">
        {status === "loading" ? (
          <div className="w-9 h-9 bg-muted animate-pulse rounded-full"></div>
        ) : session?.user ? (
          <>
            <span className="text-sm text-muted-foreground hidden sm:inline">
              Welcome, {session.user.name || session.user.email}
            </span>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent-foreground" title="Customize Theme">
                  <PaletteIcon className="w-6 h-6" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <ThemeCustomizer />
              </PopoverContent>
            </Popover>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => signOut({ callbackUrl: '/landing' })}
              className="text-muted-foreground hover:text-accent-foreground"
              title="Sign Out"
            >
              <LogOut className="w-6 h-6" />
            </Button>
          </>
        ) : (
          <>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent-foreground" title="Customize Theme">
                  <PaletteIcon className="w-6 h-6" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <ThemeCustomizer />
              </PopoverContent>
            </Popover>
            <Link href="/login" legacyBehavior>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent-foreground" title="Sign In">
                <LogIn className="w-6 h-6" />
              </Button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
