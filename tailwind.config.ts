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
      // Add typography for react-markdown
      typography: ({ theme }: { theme: (path: string, defaultValue?: any) => any }) => ({
        DEFAULT: {
          css: {
            color: theme('colors.foreground'),
            a: {
              color: theme('colors.primary'),
              '&:hover': {
                color: `hsl(var(--accent-color-hsl) / 0.8)`,
              },
            },
            strong: { color: theme('colors.foreground') },
            code: { color: theme('colors.primary'), backgroundColor: `hsl(var(--accent-color-hsl) / 0.1)` , padding: '0.2em 0.4em', borderRadius: '0.25rem'},
            blockquote: { color: theme('colors.muted-foreground'), borderLeftColor: theme('colors.border')},
            h1: { color: theme('colors.foreground') },
            h2: { color: theme('colors.foreground') },
            h3: { color: theme('colors.foreground') },
            h4: { color: theme('colors.foreground') },
            'ul > li::before': { backgroundColor: theme('colors.muted-foreground') },
            'ol > li::before': { color: theme('colors.muted-foreground') },
          },
        },
        sm: { // for prose-sm
             css: {
                fontSize: '0.875rem', // text-sm
                p: { marginTop: '0.75em', marginBottom: '0.75em'},
                ul: { marginTop: '0.75em', marginBottom: '0.75em'},
                ol: { marginTop: '0.75em', marginBottom: '0.75em'},
                // Add other specific sm styles if needed
             }
        },
        invert: { // For dark mode, if using prose-invert
          css: {
            color: theme('colors.foreground'), // Assuming foreground is already dark-mode aware
            a: {
              color: theme('colors.primary'),
               '&:hover': {
                color: `hsl(var(--accent-color-hsl) / 0.8)`,
              },
            },
            strong: { color: theme('colors.foreground') },
            code: { color: theme('colors.primary'), backgroundColor: `hsl(var(--accent-color-hsl) / 0.15)`},
            blockquote: { color: theme('colors.muted-foreground'), borderLeftColor: theme('colors.border')},
            h1: { color: theme('colors.foreground') },
            h2: { color: theme('colors.foreground') },
            h3: { color: theme('colors.foreground') },
            h4: { color: theme('colors.foreground') },
            'ul > li::before': { backgroundColor: theme('colors.muted-foreground') },
            'ol > li::before': { color: theme('colors.muted-foreground') },
          },
        },
      }),
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'), // New plugin
  ],
};

export default config;
