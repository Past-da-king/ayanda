"use client";

import React, { useState, useEffect, useRef } from 'react'; // Removed useCallback as fetchUserProfile moved
import { LogIn, PaletteIcon, Search as SearchIcon, X as XIcon, CalendarIcon, ListChecks, Target, StickyNote, UserCircle } from 'lucide-react';
import { AyandaLogoIcon } from './AyandaLogoIcon';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react'; // signOut is no longer called directly here
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ThemeCustomizer } from './ThemeCustomizer';
// ProfileCard is removed
import { SearchResultItem } from '@/types'; 
import { usePathname, useRouter } from 'next/navigation';

const getIconForType = (type: SearchResultItem['type']) => {
  switch (type) {
    case 'task': return <ListChecks className="w-4 h-4 mr-2 text-muted-foreground" />;
    case 'goal': return <Target className="w-4 h-4 mr-2 text-muted-foreground" />;
    case 'note': return <StickyNote className="w-4 h-4 mr-2 text-muted-foreground" />;
    case 'event': return <CalendarIcon className="w-4 h-4 mr-2 text-muted-foreground" />;
    default: return null;
  }
};

// Removed UserProfileState and related logic from Header

export function Header() {
  const { data: session, status } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isSearchPopoverOpen, setIsSearchPopoverOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchPopoverRef = useRef<HTMLDivElement>(null);

  const currentPathname = usePathname();
  const router = useRouter();

  // Profile popover state and fetch logic removed from here

  const handleSearch = async (query: string) => {
    if (query.trim().length < 2) {
      setSearchResults([]);
      setIsSearchPopoverOpen(false);
      return;
    }
    setIsSearchLoading(true);
    setIsSearchPopoverOpen(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearchLoading(false);
    }
  };

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch(searchQuery);
      } else {
        setSearchResults([]);
        setIsSearchPopoverOpen(false);
      }
    }, 300);
    return () => clearTimeout(timerId);
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchPopoverRef.current && !searchPopoverRef.current.contains(event.target as Node) &&
        searchInputRef.current && !searchInputRef.current.contains(event.target as Node)
      ) {
        setIsSearchPopoverOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavigateToItem = (item: SearchResultItem) => {
    if (item.path) {
       router.push(`/#view=${item.type}&id=${item.id}`); 
    }
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchPopoverOpen(false);
  };

  const showSearch = status === "authenticated" && !["/login", "/register", "/landing", "/profile"].includes(currentPathname);


  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-[95]",
        "flex items-center justify-between",
        "px-6 py-4",
        "bg-background border-b border-border-main",
      )}
      style={{ height: '5rem' }}
    >
      <Link href={session ? "/" : "/landing"} className="flex items-center space-x-3 cursor-pointer group">
        <AyandaLogoIcon className="group-hover:scale-110 transition-transform duration-200" />
        <h1 className="font-orbitron text-3xl font-bold tracking-wider accent-text group-hover:brightness-110 transition-all duration-200">AYANDA</h1>
      </Link>
      
      <div className="flex items-center gap-3">
        {showSearch && (
          <div className="relative">
            <div className="relative flex items-center">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                ref={searchInputRef}
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => { if (searchQuery.trim().length >=2) setIsSearchPopoverOpen(true);}}
                className="pl-9 pr-8 h-9 w-48 md:w-64 input-field rounded-full bg-input-bg border-border-main focus:bg-widget-background focus:w-64 md:focus:w-72 transition-all"
              />
              {searchQuery && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full text-muted-foreground hover:text-foreground"
                  onClick={() => { setSearchQuery(''); setSearchResults([]); setIsSearchPopoverOpen(false); }}
                >
                  <XIcon className="h-4 w-4"/>
                </Button>
              )}
            </div>
            {isSearchPopoverOpen && (searchQuery.trim().length >= 2) && (
              <div
                ref={searchPopoverRef}
                className="absolute top-full mt-2 w-72 md:w-96 max-h-[60vh] overflow-y-auto bg-popover border border-border rounded-md shadow-lg z-[100] p-1 space-y-0.5"
              >
                {isSearchLoading && <p className="p-3 text-sm text-muted-foreground text-center">Searching...</p>}
                {!isSearchLoading && searchResults.length === 0 && (
                  <p className="p-3 text-sm text-muted-foreground text-center">No results found for "{searchQuery}".</p>
                )}
                {!isSearchLoading && searchResults.map(item => (
                  <div
                    key={`${item.type}-${item.id}`}
                    className="p-2.5 hover:bg-accent rounded cursor-pointer flex items-start"
                    onClick={() => handleNavigateToItem(item)}
                  >
                    {getIconForType(item.type)}
                    <div className="flex-grow">
                      <p className="text-sm font-medium text-popover-foreground leading-tight truncate">{item.title}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {item.type} in <span className="font-medium">{item.category}</span>
                        {item.date && ` - ${new Date(item.date).toLocaleDateString('en-US', { month:'short', day:'numeric' })}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {status === "loading" ? (
          <div className="w-9 h-9 bg-muted animate-pulse rounded-full"></div>
        ) : session?.user ? (
          <>
            {/* Display name is removed here, can be shown on profile page */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent-foreground" title="Customize Theme">
                  <PaletteIcon className="w-5 h-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <ThemeCustomizer />
              </PopoverContent>
            </Popover>
            
            {/* Profile Link instead of Popover */}
            <Link href="/profile" passHref legacyBehavior>
                 <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-accent-foreground rounded-full"
                  title="My Profile"
                  asChild // Make button act as a child of Link for proper behavior
                >
                  <a><UserCircle className="w-6 h-6" /></a>
                </Button>
            </Link>
          </>
        ) : (
          <>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent-foreground" title="Customize Theme">
                  <PaletteIcon className="w-5 h-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <ThemeCustomizer />
              </PopoverContent>
            </Popover>
            <Link href="/login" legacyBehavior>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent-foreground" title="Sign In">
                <a><LogIn className="w-5 h-5" /></a>
              </Button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}


