"use client";

import React, { useState, useEffect, useRef } from 'react'; 
import { LogIn, PaletteIcon, Search as SearchIcon, X as XIcon, CalendarIcon, ListChecks, Target, StickyNote, UserCircle, ChevronDown, Cog } from 'lucide-react'; // Added ChevronDown, Cog
import { AIDALogoIcon } from './AIDALogoIcon';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react'; 
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ThemeCustomizer } from './ThemeCustomizer';
import { SearchResultItem, Project, Category } from '@/types'; 
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

interface HeaderProps {
  // Props for Project Selector functionality, if it's integrated here
  currentProjectName?: Category;
  onProjectChange?: (projectName: Category) => void;
  availableProjects?: Project[];
  onManageProjects?: () => void;
}


export function Header({
  currentProjectName,
  onProjectChange,
  availableProjects = [],
  onManageProjects
}: HeaderProps) {
  const { data: session, status } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isSearchPopoverOpen, setIsSearchPopoverOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchPopoverRef = useRef<HTMLDivElement>(null);

  // State for Project Dropdown
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const projectDropdownRef = useRef<HTMLDivElement>(null);
  const projectPillRef = useRef<HTMLDivElement>(null);


  const currentPathname = usePathname();
  const router = useRouter();


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
      if (
        projectDropdownRef.current && !projectDropdownRef.current.contains(event.target as Node) &&
        projectPillRef.current && !projectPillRef.current.contains(event.target as Node)
      ) {
        setIsProjectDropdownOpen(false);
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
  const showProjectSelector = status === "authenticated" && onProjectChange && currentProjectName && availableProjects && !["/login", "/register", "/landing", "/profile"].includes(currentPathname);
  const allProjectsOption: Category = "All Projects";


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
      <div className="flex items-center space-x-3">
        <Link href={session ? "/" : "/landing"} className="flex items-center space-x-3 cursor-pointer group">
            <AIDALogoIcon className="group-hover:scale-110 transition-transform duration-200" />
            <h1 className="font-orbitron text-3xl font-bold tracking-wider accent-text group-hover:brightness-110 transition-all duration-200">AIDA</h1>
        </Link>
      </div>
      
      {/* Project Selector in the middle */}
      {showProjectSelector && (
        <div className="flex-grow flex justify-center items-center">
            <div className="relative">
                <div
                ref={projectPillRef}
                onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
                className={cn(
                    "bg-widget-bg border border-border",
                    "rounded-full px-4 py-1.5", // Slightly smaller padding for header
                    "text-xs font-medium cursor-pointer text-foreground",
                    "flex items-center min-w-[180px] max-w-[220px] justify-between", // Adjusted width
                    "transition-colors duration-200 hover:border-primary hover:bg-accent"
                )}
                >
                <span className="truncate">{currentProjectName}</span>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground ml-1 shrink-0" />
                </div>

                {isProjectDropdownOpen && (
                <div
                    ref={projectDropdownRef}
                    className={cn(
                    "absolute mt-2 bg-popover border border-border rounded-md",
                    "w-[220px] max-h-[300px] overflow-y-auto text-popover-foreground",
                    "shadow-[0_8px_25px_rgba(0,0,0,0.4)] z-[105]", // Higher z-index
                    "transition-all duration-200 ease-out",
                    isProjectDropdownOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2.5"
                    )}
                    style={{ top: 'calc(100% + 0.3rem)', left: '50%', transform: 'translateX(-50%)' }} 
                >
                    <div 
                        className={cn(
                            "px-3 py-2 cursor-pointer text-xs",
                            currentProjectName === allProjectsOption 
                            ? "bg-accent text-accent-foreground font-semibold" 
                            : "hover:bg-accent hover:text-accent-foreground"
                        )}
                        onClick={() => { onProjectChange(allProjectsOption); setIsProjectDropdownOpen(false); }}
                    >
                    {allProjectsOption}
                    </div>
                    {availableProjects.filter(p => p.name !== allProjectsOption).map(proj => (
                    <div
                        key={proj.id}
                        className={cn(
                        "px-3 py-2 cursor-pointer text-xs",
                        currentProjectName === proj.name 
                            ? "bg-accent text-accent-foreground font-semibold" 
                            : "hover:bg-accent hover:text-accent-foreground"
                        )}
                        onClick={() => { onProjectChange(proj.name); setIsProjectDropdownOpen(false); }}
                    >
                        {proj.name}
                    </div>
                    ))}
                </div>
                )}
            </div>
            {onManageProjects && (
                <button 
                    title="Manage Projects" 
                    onClick={onManageProjects}
                    className="ml-2 p-1.5 rounded-full hover:bg-input-bg text-muted-foreground hover:text-accent-foreground"
                >
                    <Cog className="w-4 h-4" />
                </button>
            )}
        </div>
      )}


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
                  <p className="p-3 text-sm text-muted-foreground text-center">No results found for &quot;{searchQuery}&quot;.</p>
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
            
            <Link href="/profile" passHref>
                 <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-accent-foreground rounded-full"
                  title="My Profile"
                  // asChild // Removed asChild to make the Button itself the link target for consistent styling
                >
                  <UserCircle className="w-6 h-6" />
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
            <Link href="/login">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent-foreground" title="Sign In" > 
                <LogIn className="w-5 h-5" />
              </Button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}



