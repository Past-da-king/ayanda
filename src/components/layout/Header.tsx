"use client";

import React from 'react';
import { UserCircle2, LogIn, LogOut } from 'lucide-react';
import { AyandaLogoIcon } from './AyandaLogoIcon';
import { cn } from '@/lib/utils';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button'; // Assuming you have a Button component

export function Header() {
  const { data: session, status } = useSession();

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-[95]",
        "flex items-center justify-between",
        "px-6 py-4",
        "bg-[var(--background-color-val)]",
        "shadow-[0_2px_10px_rgba(0,0,0,0.2)]"
      )}
      style={{ height: '5rem' }}
    >
      <Link href={session ? "/" : "/landing"} className="flex items-center space-x-3 cursor-pointer">
        <AyandaLogoIcon />
        <h1 className="font-orbitron text-3xl font-bold tracking-wider accent-text">AYANDA</h1>
      </Link>
      
      <div className="flex items-center gap-3">
        {status === "loading" ? (
          <div className="w-9 h-9 bg-slate-700 animate-pulse rounded-full"></div>
        ) : session?.user ? (
          <>
            <span className="text-sm text-[var(--text-muted-color-val)] hidden sm:inline">
              Welcome, {session.user.name || session.user.email}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => signOut({ callbackUrl: '/landing' })}
              className="text-slate-400 hover:accent-text"
              title="Sign Out"
            >
              <LogOut className="w-7 h-7" />
            </Button>
          </>
        ) : (
          <Link href="/login" legacyBehavior>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:accent-text" title="Sign In">
              <LogIn className="w-7 h-7" />
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
