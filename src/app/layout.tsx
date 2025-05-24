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
  title: "AIDA",
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

