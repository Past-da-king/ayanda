

## src/lib/fonts.ts
```typescript
import { Inter, Orbitron, Manrope, Lexend, Poppins, JetBrains_Mono, Lora } from 'next/font/google';
import { GeistSans } from 'geist/font/sans'; // Vercel's Geist font

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

export const orbitronFont = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron-val",
  weight: ["500", "700"],
  display: 'swap',
});

export const geistSans = GeistSans; // Already configured with variable --font-geist-sans

export const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

export const lexend = Lexend({
  subsets: ['latin'],
  variable: '--font-lexend',
  display: 'swap',
});

export const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
});

export interface FontConfig {
  key: string;
  name: string;
  variableName: string; // The CSS variable name (e.g., "--font-inter")
  className: string; // The className from next/font if needed directly (e.g., inter.className)
  previewStyle?: React.CSSProperties;
}

export const availableFonts: FontConfig[] = [
  { key: 'inter', name: 'Inter (Default)', variableName: '--font-inter', className: inter.className, previewStyle: { fontFamily: 'var(--font-inter)'} },
  { key: 'geist-sans', name: 'Geist Sans', variableName: '--font-geist-sans', className: geistSans.variable, previewStyle: { fontFamily: 'var(--font-geist-sans)'} },
  { key: 'orbitron', name: 'Orbitron', variableName: '--font-orbitron-val', className: orbitronFont.className, previewStyle: { fontFamily: 'var(--font-orbitron-val)'} },
  { key: 'manrope', name: 'Manrope', variableName: '--font-manrope', className: manrope.className, previewStyle: { fontFamily: 'var(--font-manrope)'} },
  { key: 'lexend', name: 'Lexend', variableName: '--font-lexend', className: lexend.className, previewStyle: { fontFamily: 'var(--font-lexend)'} },
  { key: 'poppins', name: 'Poppins', variableName: '--font-poppins', className: poppins.className, previewStyle: { fontFamily: 'var(--font-poppins)'} },
  { key: 'jetbrains-mono', name: 'JetBrains Mono', variableName: '--font-jetbrains-mono', className: jetbrainsMono.className, previewStyle: { fontFamily: 'var(--font-jetbrains-mono)'} },
  { key: 'lora', name: 'Lora', variableName: '--font-lora', className: lora.className, previewStyle: { fontFamily: 'var(--font-lora)'} },
];

export const defaultFontKey = 'inter';
```

## src/lib/themes.ts
```typescript
export interface ColorSet {
  // Base AYANDA variables
  accentColorVal: string;
  accentColorHsl: string; // For shadcn HSL-based variables like ring, accent
  backgroundColorVal: string;
  widgetBackgroundVal: string;
  textColorVal: string;
  textMutedColorVal: string;
  borderColorVal: string;
  inputBgVal: string;
  dangerColorVal: string; // Typically consistent, but can be themed

  // Direct shadcn variable values derived from the palette
  // These will be set on :root by ThemeProvider
  // Their names match the CSS variables shadcn expects.
  '--background': string;
  '--foreground': string;
  '--card': string;
  '--card-foreground': string;
  '--popover': string;
  '--popover-foreground': string;
  '--primary': string;
  '--primary-foreground': string;
  '--secondary': string;
  '--secondary-foreground': string;
  '--muted': string;
  '--muted-foreground': string;
  '--accent': string; // Often a semi-transparent version of primary/accentColorVal
  '--accent-foreground': string;
  '--destructive': string;
  '--destructive-foreground': string;
  '--border': string;
  '--input': string; // Often same as border
  '--ring': string;  // Often derived from accentColorHsl
}

export interface Theme {
  key: string;
  displayName: string;
  previewColor: string; // A dominant color for the swatch
  light: ColorSet;
  dark: ColorSet;
}

// Helper to create HSL string for shadcn
const toHslString = (hue: number, saturation: number, lightness: number) => `${hue} ${saturation}% ${lightness}%`;

// Define base values for a theme and derive shadcn vars
function createThemeColors(
    isDark: boolean,
    accent: string, // hex
    accentHslParts: [number, number, number], // [hue, saturation, lightness]
    background: string,
    widgetBg: string,
    text: string,
    textMuted: string,
    border: string,
    inputBg: string,
    danger: string = '#FF4757', // Default danger
    primaryFgOverride?: string // Optional override for text on primary
): ColorSet {
    const accentHsl = toHslString(...accentHslParts);
    const primaryForeground = primaryFgOverride || (isDark ? background : '#FFFFFF'); // Contrast for primary

    return {
        accentColorVal: accent,
        accentColorHsl: accentHsl,
        backgroundColorVal: background,
        widgetBackgroundVal: widgetBg,
        textColorVal: text,
        textMutedColorVal: textMuted,
        borderColorVal: border,
        inputBgVal: inputBg,
        dangerColorVal: danger,

        '--background': background,
        '--foreground': text,
        '--card': widgetBg,
        '--card-foreground': text,
        '--popover': widgetBg,
        '--popover-foreground': text,
        '--primary': accent,
        '--primary-foreground': primaryForeground,
        '--secondary': inputBg, // Example mapping
        '--secondary-foreground': text,
        '--muted': inputBg, // Example mapping
        '--muted-foreground': textMuted,
        '--accent': `hsl(${accentHsl} / 0.1)`,
        '--accent-foreground': accent,
        '--destructive': danger,
        '--destructive-foreground': text, // Assuming danger text is primary text color
        '--border': border,
        '--input': border,
        '--ring': `hsl(${accentHsl} / 0.5)`,
    };
}

export const themes: Theme[] = [
  {
    key: 'default-cyan',
    displayName: 'Default Cyan',
    previewColor: '#00DCFF',
    light: createThemeColors(
        false,                      // isDark
        '#00A0B8',                  // accent (slightly darker for light mode primary)
        [188, 100, 36],             // accentHslParts for #00A0B8
        '#F0F4F8',                  // background
        '#FFFFFF',                  // widgetBg
        '#101820',                  // text
        '#505A6A',                  // textMuted
        '#DDE2E8',                  // border
        '#E8ECF1',                  // inputBg
        '#E53E3E',                   // danger
        '#FFFFFF'                    // primaryFg
    ),
    dark: createThemeColors(
        true,                       // isDark
        '#00DCFF',                  // accent
        [190, 100, 50],             // accentHslParts for #00DCFF
        '#0A0F14',                  // background
        '#101820',                  // widgetBg
        '#E0E7FF',                  // text
        '#707A8A',                  // textMuted
        'rgba(0, 220, 255, 0.08)',  // border
        'rgba(255, 255, 255, 0.03)',// inputBg
        '#FF4757',                   // danger
        '#0A0F14'                    // primaryFg
    ),
  },
  {
    key: 'sakura-pink',
    displayName: 'Sakura Pink',
    previewColor: '#FFB6C1',
    light: createThemeColors(
        false,
        '#F472B6',        // accent (Hot Pink)
        [330, 87, 70],    // accentHslParts for #F472B6
        '#FFF0F5',        // background (Lavender Blush)
        '#FFFFFF',        // widgetBg
        '#522236',        // text (Dark Pink/Purple)
        '#A47086',        // textMuted
        '#FFD9E1',        // border
        '#FFE5EA',        // inputBg
        '#E53E3E',
        '#FFFFFF'
    ),
    dark: createThemeColors(
        true,
        '#FFB6C1',        // accent (Light Pink)
        [351, 100, 85],   // accentHslParts for #FFB6C1
        '#1A1114',        // background (Very Dark Pink/Purple)
        '#2A1A20',        // widgetBg
        '#FFE0E5',        // text (Light Pinkish White)
        '#B88091',        // textMuted
        'rgba(255, 182, 193, 0.15)', // border
        'rgba(255, 182, 193, 0.05)', // inputBg
        '#FF6B81',        // danger (Softer Red for Pink Theme)
        '#1A1114'
    ),
  },
  {
    key: 'forest-green',
    displayName: 'Forest Green',
    previewColor: '#2F855A', // Dark Green
    light: createThemeColors(
        false,
        '#2F855A',        // accent (Dark Green)
        [147, 46, 35],    // accentHslParts for #2F855A
        '#F0FFF4',        // background (Honeydew)
        '#FFFFFF',        // widgetBg
        '#1A4731',        // text (Very Dark Green)
        '#5A806B',        // textMuted
        '#C6F6D5',        // border (Light Green)
        '#E6FFFA',        // inputBg
        '#E53E3E',
        '#FFFFFF'
    ),
    dark: createThemeColors(
        true,
        '#68D391',        // accent (Lighter Green)
        [145, 50, 61],    // accentHslParts for #68D391
        '#0E1A14',        // background (Very Dark Green)
        '#14251C',        // widgetBg
        '#D8FEE6',        // text (Pale Green)
        '#609077',        // textMuted
        'rgba(104, 211, 145, 0.15)', // border
        'rgba(104, 211, 145, 0.05)', // inputBg
        '#FF7878',        // danger
        '#0E1A14'
    ),
  },
  {
    key: 'solar-yellow',
    displayName: 'Solar Yellow',
    previewColor: '#F6E05E', // Saffron
    light: createThemeColors(
        false,
        '#D69E2E',        // accent (Darker Gold/Mustard)
        [39, 68, 51],     // accentHslParts for #D69E2E
        '#FFFFF0',        // background (Ivory)
        '#FFFFFF',        // widgetBg
        '#42340C',        // text (Dark Brown)
        '#8C6D22',        // textMuted
        '#FEFCBF',        // border (Pale Yellow)
        '#FFFDE7',        // inputBg
        '#E53E3E',
        '#42340C'         // Dark text on yellow
    ),
    dark: createThemeColors(
        true,
        '#F6E05E',        // accent (Saffron)
        [50, 90, 67],     // accentHslParts for #F6E05E
        '#1A160A',        // background (Very Dark Brown/Yellow)
        '#2A220F',        // widgetBg
        '#FFFACD',        // text (Lemon Chiffon)
        '#C0A549',        // textMuted
        'rgba(246, 224, 94, 0.15)', // border
        'rgba(246, 224, 94, 0.05)', // inputBg
        '#FF8C8C',        // danger
        '#1A160A'
    ),
  },
];

export const defaultThemeKey = 'default-cyan';
```

## src/context/ThemeContext.tsx
```typescript
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

const LS_THEME_KEY = 'ayanda-theme-key';
const LS_FONT_KEY = 'ayanda-font-key';
const LS_MODE_KEY = 'ayanda-theme-mode';

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
  }, []); // Runs once on mount client-side


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
```

## tailwind.config.ts
```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // Important for manual dark mode toggling
  theme: {
    extend: {
      fontFamily: {
        // Use a CSS variable that ThemeProvider will update
        sans: ['var(--font-selected-app)', 'var(--font-inter)', 'sans-serif'],
        orbitron: ['var(--font-orbitron-val)', 'sans-serif'],
        // Individual font variables are also available if needed directly
        inter: ['var(--font-inter)', 'sans-serif'],
        'geist-sans': ['var(--font-geist-sans)', 'sans-serif'],
        manrope: ['var(--font-manrope)', 'sans-serif'],
        lexend: ['var(--font-lexend)', 'sans-serif'],
        poppins: ['var(--font-poppins)', 'sans-serif'],
        'jetbrains-mono': ['var(--font-jetbrains-mono)', 'monospace'],
        lora: ['var(--font-lora)', 'serif'],
      },
      colors: {
        // Define colors using CSS variables that will be dynamically set
        // These are for Tailwind's `theme()` helper and JIT engine
        // The actual color values will come from :root via ThemeProvider
        primary: 'var(--primary)',
        'primary-foreground': 'var(--primary-foreground)',
        secondary: 'var(--secondary)',
        'secondary-foreground': 'var(--secondary-foreground)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        widget: 'var(--widget-background-val)', // Custom name
        'widget-bg': 'var(--widget-background-val)', // Alias if needed
        'text-main': 'var(--text-color-val)',
        'text-muted': 'var(--text-muted-color-val)',
        'border-main': 'var(--border-color-val)',
        'input-bg': 'var(--input-bg-val)',
        accent: 'var(--accent)',
        'accent-foreground': 'var(--accent-foreground)',
        destructive: 'var(--destructive)',
        'destructive-foreground': 'var(--destructive-foreground)',
        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
        card: 'var(--card)',
        'card-foreground': 'var(--card-foreground)',
        popover: 'var(--popover)',
        'popover-foreground': 'var(--popover-foreground)',
        ring: 'var(--ring)',
        input: 'var(--input)', // shadcn input border color

        // Your custom palette variable names
        'accent-color': 'var(--accent-color-val)',
        'background-color': 'var(--background-color-val)',
        'widget-background': 'var(--widget-background-val)',
        'text-color': 'var(--text-color-val)',
        'text-muted-color': 'var(--text-muted-color-val)',
        'border-color': 'var(--border-color-val)',
        'danger-color': 'var(--danger-color-val)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      // ... any other extensions
    },
  },
  plugins: [
    require('tailwindcss-animate'), // For shadcn ui if used
    // any other plugins
  ],
};

export default config;
```

## src/app/globals.css
```css
@import "tailwindcss";
/* Ensure 'tailwindcss-custom-variants' plugin is installed and configured if using @custom-variant */
/* Or remove if not using: npm uninstall tailwindcss-custom-variants */
/* @custom-variant dark (&:is(.dark *)); */

/*
  Link to Tailwind config if explicitly needed with Tailwind CSS v4+.
  However, for dynamic CSS variable changes via JS, this might not be strictly
  necessary for the color variables themselves, but good for other configs like fonts.
  The `postcss.config.mjs` already includes `@tailwindcss/postcss`.
*/
/* @config "./tailwind.config.ts"; */


@theme {
  /* Make CSS variables available to Tailwind's theme() and JIT engine */
  /* These are the *keys* Tailwind will recognize. Their *values* will be set by :root or ThemeProvider. */
  
  /* Shadcn/ui compatibility - map our theme to shadcn's expected vars */
  /* These act as aliases. The ThemeProvider sets the --*-val variables. */
  --background: var(--background-color-val);
  --foreground: var(--text-color-val);
  --card: var(--widget-background-val);
  --card-foreground: var(--text-color-val);
  --popover: var(--widget-background-val);
  --popover-foreground: var(--text-color-val);
  --primary: var(--accent-color-val);
  --primary-foreground: var(--background-color-val); /* Default, can be overridden by theme */
  --secondary: var(--input-bg-val);
  --secondary-foreground: var(--text-color-val);
  --muted: var(--input-bg-val);
  --muted-foreground: var(--text-muted-color-val);
  --accent: hsl(var(--accent-color-hsl) / 0.1);
  --accent-foreground: var(--accent-color-val);
  --destructive: var(--danger-color-val);
  --destructive-foreground: var(--text-color-val);
  --border: var(--border-color-val);
  --input: var(--border-color-val);
  --ring: hsl(var(--accent-color-hsl) / 0.5);

  --radius: 0.75rem;

  /* Fonts - --font-selected-app will be set by ThemeProvider */
  --font-sans: var(--font-selected-app), var(--font-inter); /* Fallback to Inter */
  --font-orbitron: var(--font-orbitron-val);
  /* Individual font variables are also available directly */
  --font-inter: Inter, sans-serif; /* Define actual font stack for fallback */
  --font-geist-sans: GeistSans, sans-serif;
  --font-manrope: Manrope, sans-serif;
  --font-lexend: Lexend, sans-serif;
  --font-poppins: Poppins, sans-serif;
  --font-jetbrains-mono: 'JetBrains Mono', monospace;
  --font-lora: Lora, serif;


  /* AYANDA specific variables - these are the source of truth set by ThemeProvider */
  /* Their default values are in :root */
  --accent-color-val: #00DCFF;
  --accent-color-hsl: 190 100% 50%;
  --background-color-val: #0A0F14;
  --widget-background-val: #101820;
  --text-color-val: #E0E7FF;
  --text-muted-color-val: #707A8A;
  --border-color-val: rgba(0, 220, 255, 0.08);
  --input-bg-val: rgba(255, 255, 255, 0.03);
  --danger-color-val: #FF4757;
}

/* Default values set on :root, ThemeProvider will override these dynamically */
:root {
  /* AYANDA specific variables */
  --accent-color-val: #00DCFF;
  --accent-color-hsl: 190 100% 50%; /* HSL for #00DCFF */
  --background-color-val: #0A0F14;
  --widget-background-val: #101820;
  --text-color-val: #E0E7FF;
  --text-muted-color-val: #707A8A;
  --border-color-val: rgba(0, 220, 255, 0.08);
  --input-bg-val: rgba(255, 255, 255, 0.03);
  --danger-color-val: #FF4757;

  /* Shadcn variables derived from AYANDA vars - these are effectively aliases */
  /* These are defined here for initial render / no-JS fallback */
  --background: var(--background-color-val);
  --foreground: var(--text-color-val);
  --card: var(--widget-background-val);
  --card-foreground: var(--text-color-val);
  --popover: var(--widget-background-val);
  --popover-foreground: var(--text-color-val);
  --primary: var(--accent-color-val);
  --primary-foreground: var(--background-color-val); /* Text on primary elements, default dark on light accent */
  --secondary: var(--input-bg-val);
  --secondary-foreground: var(--text-color-val);
  --muted: var(--input-bg-val);
  --muted-foreground: var(--text-muted-color-val);
  --accent: hsl(var(--accent-color-hsl) / 0.1); /* Accent bg (e.g., hover) */
  --accent-foreground: var(--accent-color-val);  /* Text on accent bg */
  --destructive: var(--danger-color-val);
  --destructive-foreground: var(--text-color-val);
  --border: var(--border-color-val);
  --input: var(--border-color-val);
  --ring: hsl(var(--accent-color-hsl) / 0.5); /* Focus ring */
  --radius: 0.75rem;

  /* Font variable that ThemeProvider will update */
  --font-selected-app: var(--font-inter); /* Default selected font */
}

.dark:root {
  /* Default dark theme values (can be overridden by ThemeProvider) */
  /* Example: if you want specific dark mode overrides not handled by theme objects */
}


@layer base {
  body {
    font-family: theme('fontFamily.sans'); /* Uses the dynamically set --font-selected-app */
    background-color: var(--background-color-val); /* Fallback, JS will set --background */
    color: var(--text-color-val); /* Fallback, JS will set --foreground */
    overflow-x: hidden;
  }
  * {
     border-color: var(--border); /* For shadcn components that expect --border */
  }
  /* Custom scrollbar for webkit browsers */
  ::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
  ::-webkit-scrollbar-track {
    background: rgba(255,255,255,0.02);
  }
  ::-webkit-scrollbar-thumb {
    background: hsl(var(--accent-color-hsl) / 0.3); /* Use HSL for consistency */
    border-radius: 2px;
  }
  /* For Firefox */
  * {
    scrollbar-width: thin;
    scrollbar-color: hsl(var(--accent-color-hsl) / 0.3) rgba(255,255,255,0.02);
  }
}

@layer components {
  .widget-item {
    background-color: var(--input-bg-val);
    padding: 0.625rem 0.875rem; /* 10px 14px */
    border-radius: 0.375rem; /* 6px */
    font-size: 0.875rem; /* 14px */
    border-left: 3px solid transparent;
    transition-property: border-color, background-color;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 200ms;
    word-break: break-word;
  }
  .widget-item:hover {
    border-left-color: var(--accent-color-val); /* Use themed accent */
    background-color: hsl(var(--accent-color-hsl) / 0.05); /* Use themed accent with low opacity */
  }

  /* General input field styling to match dashboard look */
  .input-field {
    @apply bg-[var(--input-bg-val)] border-[var(--border-color-val)] text-[var(--text-color-val)] placeholder:text-[var(--text-muted-color-val)];
    @apply focus:border-[var(--accent-color-val)] focus:ring-1 focus:ring-[var(--accent-color-val)]/50;
  }
  
  /* Button primary style consistent with theme */
  .btn-primary {
    @apply bg-[var(--accent-color-val)] text-[var(--primary-foreground)] hover:opacity-90;
  }
  .btn-icon {
    @apply text-[var(--text-muted-color-val)] hover:text-[var(--accent-color-val)];
  }
  .btn-icon.danger {
     @apply hover:text-[var(--danger-color-val)];
  }
}

@layer utilities {
    .font-orbitron { font-family: theme('fontFamily.orbitron'); }
    .accent-text { color: var(--accent-color-val); }
}
```

## src/app/layout.tsx
```typescript
import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import AuthSessionProvider from "@/components/auth/AuthSessionProvider";
import { ThemeProvider, FOUTPreventionScript } from "@/context/ThemeContext";
import {
  inter,
  orbitronFont,
  geistSans,
  manrope,
  lexend,
  poppins,
  jetbrainsMono,
  lora
} from '@/lib/fonts';

export const metadata: Metadata = {
  title: "AYANDA",
  description: "Your personal assistant and dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning> {/* suppressHydrationWarning for FOUT script + theme provider */}
      <head>
        <FOUTPreventionScript />
      </head>
      <body
        className={cn(
          // Font variables are applied here, --font-selected-app in globals.css will pick one
          inter.variable,
          orbitronFont.variable,
          geistSans.variable,
          manrope.variable,
          lexend.variable,
          poppins.variable,
          jetbrainsMono.variable,
          lora.variable,
          "antialiased min-h-screen bg-background text-foreground" // Use shadcn vars for base
        )}
      >
        <AuthSessionProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
```

## src/components/layout/ThemeCustomizer.tsx
```typescript
"use client";

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { themes } from '@/lib/themes';
import { availableFonts } from '@/lib/fonts';
import { Button } from '@/components/ui/button';
import { CheckIcon, MoonIcon, SunIcon, PaletteIcon, CaseSensitiveIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ThemeCustomizer() {
  const { themeKey, fontKey, mode, setTheme, setFont, toggleMode, currentTheme } = useTheme();

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
              <span className="text-xs text-white mix-blend-difference">{themeOption.displayName}</span>
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
          <SelectContent>
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
```

## src/components/layout/Header.tsx
```typescript
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
```
