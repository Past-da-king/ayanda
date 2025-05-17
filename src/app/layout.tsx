import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import AuthSessionProvider from "@/components/auth/AuthSessionProvider"; // Import the provider

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

const orbitronFont = Orbitron({ // Renamed to avoid conflict with Orbitron type
  subsets: ["latin"],
  variable: "--font-orbitron-val",
  weight: ["500", "700"],
  display: 'swap',
});

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
    <html lang="en" className="dark">
      <body
        className={cn(
          inter.variable,
          orbitronFont.variable, // Use renamed font variable
          "antialiased min-h-screen"
        )}
      >
        <AuthSessionProvider> {/* Wrap children with AuthSessionProvider */}
          {children}
        </AuthSessionProvider>
      </body>
    </html>
  );
}
