import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", // Matches CSS variable in globals.css
  display: 'swap',
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron-val", // Matches CSS variable in globals.css
  weight: ["500", "700"], // As used in the target HTML
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
    <html lang="en" className="dark"> {/* Assuming dark is the default and only theme */}
      <body
        className={cn(
          inter.variable,
          orbitron.variable,
          "antialiased min-h-screen" // bg and text color applied via @layer base in globals.css
        )}
      >
        {children}
      </body>
    </html>
  );
}
