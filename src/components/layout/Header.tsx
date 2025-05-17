"use client";

import React from 'react';
import { UserCircle2 } from 'lucide-react'; // Replaced Lock with UserCircle for now
import { AyandaLogoIcon } from './AyandaLogoIcon'; // Import the new logo icon
import { cn } from '@/lib/utils';

// Header no longer manages category state, that will be in ProjectSelectorBar
export function Header() {
  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-[95]", // z-index from target
        "flex items-center justify-between",
        "px-6 py-4", // padding from target (1rem = 16px, 1.5rem = 24px)
        "bg-[var(--background-color-val)]", // Background from target
        "shadow-[0_2px_10px_rgba(0,0,0,0.2)]" // Box shadow from target
      )}
      style={{ height: '5rem' }} // Explicit height to match target padding
    >
      {/* Left Section: Logo */}
      <div className="flex items-center space-x-3"> {/* space-x from target */}
        <AyandaLogoIcon /> {/* Use the new SVG icon */}
        <h1 className="font-orbitron text-3xl font-bold tracking-wider accent-text">AYANDA</h1>
      </div>
      
      {/* Right Section: Icons */}
      {/* Target HTML only shows user icon, Lock icon removed for closer match */}
      <div className="flex items-center gap-3">
         <button className="p-0 bg-transparent border-none text-slate-400 hover:accent-text cursor-pointer">
            <UserCircle2 className="w-9 h-9" /> {/* Size from target */}
        </button>
      </div>
    </header>
  );
}
