"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Cog } from 'lucide-react';
import { Category } from '@/types';
import { cn } from '@/lib/utils';

interface ProjectSelectorBarProps {
  currentCategory: Category;
  onCategoryChange: (category: Category) => void;
  availableCategories: Category[];
  // onManageProjects: () => void; 
}

export function ProjectSelectorBar({ 
  currentCategory, 
  onCategoryChange, 
  availableCategories 
}: ProjectSelectorBarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleSelectCategory = (category: Category | null) => {
    onCategoryChange(category || "All Projects" as Category);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
        pillRef.current && !pillRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayCategoryName = currentCategory === "All Projects" ? "All Projects" : currentCategory;


  return (
    <div 
      className={cn(
        "fixed left-0 right-0 z-[90]",
        "bg-background", // Use themed background
        "px-6 py-3 border-b border-border", // Add bottom border to match header style for integration
        // "shadow-[0_2px_5px_rgba(0,0,0,0.1)]", // Shadow removed for less separation
        "flex items-center justify-center"
      )}
      style={{ top: '5rem' }} 
    >
      <div className="relative">
        <div
          ref={pillRef}
          onClick={toggleDropdown}
          className={cn(
            "bg-widget-bg border border-border", // Use themed widget-bg and border
            "rounded-full px-5 py-2",
            "text-sm font-medium cursor-pointer text-foreground", // Use themed text
            "flex items-center min-w-[220px] justify-between",
            "transition-colors duration-200 hover:border-primary hover:bg-accent" // Use themed primary/accent
          )}
        >
          <span>{displayCategoryName}</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </div>

        {isDropdownOpen && (
          <div
            ref={dropdownRef}
            className={cn(
              "absolute mt-2 bg-popover border border-border rounded-md", // Use themed popover and border
              "w-[250px] max-h-[300px] overflow-y-auto text-popover-foreground", // Use themed text
              "shadow-[0_8px_25px_rgba(0,0,0,0.4)] z-[100]", // Keep shadow for dropdown itself
              "transition-all duration-200 ease-out",
              isDropdownOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2.5"
            )}
            style={{ top: 'calc(100% + 0.5rem)'}} 
          >
            <div 
              className={cn(
                "px-4 py-2.5 cursor-pointer text-sm",
                (currentCategory === "All Projects" || !availableCategories.includes(currentCategory as Category)) 
                  ? "bg-accent text-accent-foreground font-medium" 
                  : "hover:bg-accent hover:text-accent-foreground"
              )}
              onClick={() => handleSelectCategory("All Projects" as Category)}
            >
              All Projects
            </div>
            {availableCategories.map(cat => (
              <div
                key={cat}
                className={cn(
                  "px-4 py-2.5 cursor-pointer text-sm",
                  currentCategory === cat 
                    ? "bg-accent text-accent-foreground font-medium" 
                    : "hover:bg-accent hover:text-accent-foreground"
                )}
                onClick={() => handleSelectCategory(cat)}
              >
                {cat}
              </div>
            ))}
          </div>
        )}
      </div>
       <button 
        title="Manage Projects" 
        className="ml-3 p-2 rounded-full hover:bg-input-bg text-muted-foreground hover:text-accent-foreground" // Use themed colors
      >
        <Cog className="w-5 h-5" />
      </button>
    </div>
  );
}
