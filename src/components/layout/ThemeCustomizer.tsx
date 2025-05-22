"use client";

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { themes } from '@/lib/themes';
import { availableFonts } from '@/lib/fonts';
import { Button } from '@/components/ui/button';
import { CheckIcon, MoonIcon, SunIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ThemeCustomizer() {
  const { themeKey, fontKey, mode, setTheme, setFont, toggleMode } = useTheme();

  return (
    <div className="p-4 space-y-6 bg-popover text-popover-foreground rounded-md shadow-lg border border-border w-72">
      <div>
        <h4 className="mb-2 text-sm font-medium text-muted-foreground">Color Theme</h4>
        <div className="grid grid-cols-3 gap-2">
          {themes.map((themeOption) => (
            <Button
              key={themeOption.key}
              variant="outline"
              size="sm"
              onClick={() => setTheme(themeOption.key)}
              className={cn(
                "justify-start h-10",
                themeKey === themeOption.key && "border-2 border-primary ring-2 ring-ring"
              )}
              style={{ backgroundColor: themeOption.previewColor }}
              title={themeOption.displayName}
            >
              <span
                className={cn(
                  "mr-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                )}
                style={{ backgroundColor: themeOption.previewColor }}
              >
                {themeKey === themeOption.key && <CheckIcon className="h-4 w-4 text-white mix-blend-difference" />}
              </span>
              {/* <span className="text-xs text-white mix-blend-difference">{themeOption.displayName}</span> */}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-2 text-sm font-medium text-muted-foreground">Font</h4>
        <Select value={fontKey} onValueChange={setFont}>
          <SelectTrigger>
            <SelectValue placeholder="Select font" />
          </SelectTrigger>
          <SelectContent className="z-[999]">
            {availableFonts.map((fontOption) => (
              <SelectItem key={fontOption.key} value={fontOption.key} style={fontOption.previewStyle}>
                {fontOption.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <h4 className="mb-2 text-sm font-medium text-muted-foreground">Mode</h4>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => toggleMode()} className="w-full">
            {mode === 'light' ? <SunIcon className="mr-2 h-4 w-4" /> : <MoonIcon className="mr-2 h-4 w-4" />}
            {mode === 'light' ? 'Light Mode' : 'Dark Mode'}
          </Button>
        </div>
      </div>
    </div>
  );
}

