// FULL, COMPLETE, READY-TO-RUN CODE ONLY.
// NO SNIPPETS. NO PLACEHOLDERS. NO INCOMPLETE SECTIONS.
// CODE MUST BE ABLE TO RUN IMMEDIATELY WITHOUT MODIFICATION.
import type { Metadata, Viewport } from "next"; // Added Viewport
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
  title: "AIDA",
  description: "Your personal assistant and dashboard.",
  manifest: "/manifest.json", // Added manifest link
  icons: [ // Added basic icons for PWA
    { rel: "apple-touch-icon", url: "/icons/icon-192x192.png" },
    { rel: "icon", url: "/favicon.ico" },
  ],
};

// Added Viewport configuration for PWA theme color
export const viewport: Viewport = {
  themeColor: "#00DCFF", // Default theme color from manifest
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <FOUTPreventionScript />
        {/* PWA specific meta tags - manifest is in metadata now */}
        {/* <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AIDA" /> */}
        {/* theme-color is handled by viewport export */}
      </head>
      <body
        className={cn(
          inter.variable,
          orbitronFont.variable,
          geistSans.variable,
          manrope.variable,
          lexend.variable,
          poppins.variable,
          jetbrainsMono.variable,
          lora.variable,
          "antialiased min-h-screen bg-background text-foreground"
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
