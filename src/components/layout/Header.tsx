"use client";

import React from 'react';
import { ChevronDown, Lock, UserCircle2, GridIcon } from 'lucide-react'; // Added GridIcon
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Category } from '@/types';

interface HeaderProps {
  currentCategory: Category;
  onCategoryChange: (category: Category) => void;
  availableCategories: Category[];
}

export function Header({ currentCategory, onCategoryChange, availableCategories }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-background border-b border-border h-16">
      {/* Left Section: Logo */}
      <div className="flex items-center gap-2">
        <GridIcon className="w-7 h-7 text-primary" /> {/* AYANDA Icon */}
        <h1 className="text-2xl font-bold text-primary font-orbitron">AYANDA</h1> {/* Orbitron font, primary color */}
      </div>

      {/* Center Section: Category Dropdown */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 bg-card border-border hover:bg-accent text-foreground">
              {currentCategory}
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-popover border-border text-popover-foreground">
            {availableCategories.map(cat => (
              <DropdownMenuItem 
                key={cat} 
                onSelect={() => onCategoryChange(cat)} 
                className="hover:!bg-accent focus:!bg-accent"
              >
                {cat}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Right Section: Icons */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Lock className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <UserCircle2 className="w-6 h-6" />
        </Button>
      </div>
    </header>
  );
}
