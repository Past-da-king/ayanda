"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Cog } from 'lucide-react'; // Cog for settings
import { Category } from '@/types'; // Assuming Category is similar to Project conceptually
import { cn } from '@/lib/utils';

interface ProjectSelectorBarProps {
  currentCategory: Category; // Renamed from currentProject for consistency
  onCategoryChange: (category: Category) => void;
  availableCategories: Category[];
  // onManageProjects: () => void; // Callback to open manage projects modal
}

export function ProjectSelectorBar({ 
  currentCategory, 
  onCategoryChange, 
  availableCategories 
  // onManageProjects 
}: ProjectSelectorBarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleSelectCategory = (category: Category | null) => { // Allow null for "All Projects"
    onCategoryChange(category || "All Projects" as Category); // Default to "All Projects" if null
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
        "fixed left-0 right-0 z-[90]", // z-index from target
        "bg-[var(--background-color-val)]",
        "px-6 py-3", // padding from target (0.75rem = 12px, 1.5rem = 24px)
        "shadow-[0_2px_5px_rgba(0,0,0,0.1)]",
        "flex items-center justify-center"
      )}
      style={{ top: '5rem' }} // Position below header
    >
      <div className="relative"> {/* Container for pill and dropdown */}
        <div
          ref={pillRef}
          onClick={toggleDropdown}
          className={cn(
            "bg-[var(--widget-background-val)] border border-[var(--border-color-val)]",
            "rounded-full px-5 py-2", // padding 0.5rem 1.25rem
            "text-sm font-medium cursor-pointer",
            "flex items-center min-w-[220px] justify-between",
            "transition-colors duration-200 hover:border-[var(--accent-color-val)] hover:bg-[rgba(0,220,255,0.05)]"
          )}
        >
          <span>{displayCategoryName}</span>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </div>

        {isDropdownOpen && (
          <div
            ref={dropdownRef}
            className={cn(
              "absolute mt-2 bg-[#141D26] border border-[var(--border-color-val)] rounded-md", // Original was 0.5rem
              "w-[250px] max-h-[300px] overflow-y-auto",
              "shadow-[0_8px_25px_rgba(0,0,0,0.4)] z-[100]",
              "transition-all duration-200 ease-out",
              isDropdownOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2.5"
            )}
            style={{ top: 'calc(100% + 0.5rem)'}} // Position dropdown below pill
          >
            <div 
              className={cn(
                "px-4 py-2.5 cursor-pointer text-sm", // padding 0.6rem 1rem
                (currentCategory === "All Projects" || !availableCategories.includes(currentCategory as Category)) ? "bg-[rgba(0,220,255,0.1)] text-[var(--accent-color-val)] font-medium" : "hover:bg-[rgba(0,220,255,0.1)]"
              )}
              onClick={() => handleSelectCategory("All Projects" as Category)} // Treat "All Projects" distinctly
            >
              All Projects
            </div>
            {availableCategories.map(cat => (
              <div
                key={cat}
                className={cn(
                  "px-4 py-2.5 cursor-pointer text-sm",
                  currentCategory === cat ? "bg-[rgba(0,220,255,0.1)] text-[var(--accent-color-val)] font-medium" : "hover:bg-[rgba(0,220,255,0.1)]"
                )}
                onClick={() => handleSelectCategory(cat)}
              >
                {cat}
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Manage Projects Button - functionality to be added if needed */}
       <button 
        // onClick={onManageProjects} 
        title="Manage Projects" 
        className="ml-3 p-2 rounded-full hover:bg-[var(--input-bg-val)] text-[var(--text-muted-color-val)] hover:accent-text"
      >
        <Cog className="w-5 h-5" />
      </button>
    </div>
  );
}
