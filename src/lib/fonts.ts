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

