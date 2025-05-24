"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { themes, defaultThemeKey, Theme, ColorSet } from '@/lib/themes';
import { availableFonts, defaultFontKey, FontConfig } from '@/lib/fonts';

type ThemeMode = 'light' | 'dark';

interface ThemeContextState {
  themeKey: string;
  fontKey: string;
  mode: ThemeMode;
  currentTheme: Theme;
  currentFont: FontConfig;
}

interface ThemeContextType extends ThemeContextState {
  setTheme: (themeKey: string) => void;
  setFont: (fontKey: string) => void;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

const LS_THEME_KEY = 'AIDA-theme-key';
const LS_FONT_KEY = 'AIDA-font-key';
const LS_MODE_KEY = 'AIDA-theme-mode';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeKey, setThemeKeyState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(LS_THEME_KEY) || defaultThemeKey;
    }
    return defaultThemeKey;
  });

  const [fontKey, setFontKeyState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(LS_FONT_KEY) || defaultFontKey;
    }
    return defaultFontKey;
  });

  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const storedMode = localStorage.getItem(LS_MODE_KEY) as ThemeMode;
      if (storedMode) return storedMode;
      // return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark'; // Default to dark mode
  });
  
  // Effect for initializing from localStorage and applying theme on first load
  // This helps with FOUT prevention strategy.
  useEffect(() => {
    const root = document.documentElement;
    const initialTheme = themes.find(t => t.key === themeKey) || themes.find(t => t.key === defaultThemeKey)!;
    const initialFont = availableFonts.find(f => f.key === fontKey) || availableFonts.find(f => f.key === defaultFontKey)!;
    
    // Apply colors
    const colorsToApply: ColorSet = mode === 'dark' ? initialTheme.dark : initialTheme.light;
    for (const [key, value] of Object.entries(colorsToApply)) {
      root.style.setProperty(key.startsWith('--') ? key : `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`, value);
    }
    
    // Apply font
    root.style.setProperty('--font-selected-app', `var(${initialFont.variableName})`);
    
    // Apply mode class
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [fontKey, mode, themeKey]); // Runs once on mount client-side, and when these specific deps change


  // Effect for persisting and applying changes whenever state changes
  useEffect(() => {
    const root = document.documentElement;
    const selectedTheme = themes.find(t => t.key === themeKey) || themes.find(t => t.key === defaultThemeKey)!;
    const selectedFont = availableFonts.find(f => f.key === fontKey) || availableFonts.find(f => f.key === defaultFontKey)!;

    // Apply colors
    const colorsToApply: ColorSet = mode === 'dark' ? selectedTheme.dark : selectedTheme.light;
     for (const [key, value] of Object.entries(colorsToApply)) {
      // Ensure CSS variable names are correctly formatted (e.g., backgroundColorVal -> --background-color-val)
      // Also handle direct CSS var names like '--background'
      const cssVarName = key.startsWith('--') ? key : `--${key.replace(/([A-Z])/g, (match) => `-${match.toLowerCase()}`)}`;
      root.style.setProperty(cssVarName, value);
    }

    // Apply font
    root.style.setProperty('--font-selected-app', `var(${selectedFont.variableName})`);
    
    // Apply mode class
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Persist
    localStorage.setItem(LS_THEME_KEY, themeKey);
    localStorage.setItem(LS_FONT_KEY, fontKey);
    localStorage.setItem(LS_MODE_KEY, mode);

  }, [themeKey, fontKey, mode]);

  const setTheme = useCallback((newThemeKey: string) => {
    setThemeKeyState(newThemeKey);
  }, []);

  const setFont = useCallback((newFontKey: string) => {
    setFontKeyState(newFontKey);
  }, []);

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
  }, []);

  const toggleMode = useCallback(() => {
    setModeState(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
  }, []);

  const currentTheme = themes.find(t => t.key === themeKey) || themes.find(t => t.key === defaultThemeKey)!;
  const currentFont = availableFonts.find(f => f.key === fontKey) || availableFonts.find(f => f.key === defaultFontKey)!;

  const value: ThemeContextType = {
    themeKey,
    fontKey,
    mode,
    currentTheme,
    currentFont,
    setTheme,
    setFont,
    setMode,
    toggleMode,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// FOUT Prevention Script Injector
export const FOUTPreventionScript = () => {
    const script = `
      (function() {
        try {
          const themeKey = localStorage.getItem('${LS_THEME_KEY}') || '${defaultThemeKey}';
          const fontKey = localStorage.getItem('${LS_FONT_KEY}') || '${defaultFontKey}';
          let mode = localStorage.getItem('${LS_MODE_KEY}');
          if (!mode) {
            // mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            mode = 'dark'; // Default to dark
          }

          const themes = ${JSON.stringify(themes)};
          const fonts = ${JSON.stringify(availableFonts)};

          const selectedTheme = themes.find(t => t.key === themeKey) || themes.find(t => t.key === '${defaultThemeKey}');
          const selectedFont = fonts.find(f => f.key === fontKey) || fonts.find(f => f.key === '${defaultFontKey}');
          
          const root = document.documentElement;

          if (selectedTheme) {
            const colorsToApply = mode === 'dark' ? selectedTheme.dark : selectedTheme.light;
            for (const [key, value] of Object.entries(colorsToApply)) {
                const cssVarName = key.startsWith('--') ? key : '--' + key.replace(/([A-Z])/g, (match) => '-' + match.toLowerCase());
                root.style.setProperty(cssVarName, value);
            }
          }

          if (selectedFont) {
            root.style.setProperty('--font-selected-app', 'var(' + selectedFont.variableName + ')');
          }
          
          if (mode === 'dark') {
            root.classList.add('dark');
          } else {
            root.classList.remove('dark');
          }
        } catch (e) {
          console.error('Error applying initial theme:', e);
        }
      })();
    `;
    return <script dangerouslySetInnerHTML={{ __html: script }} />;
};

