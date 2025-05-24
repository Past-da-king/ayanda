import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AIDALogoIcon } from '@/components/layout/AIDALogoIcon'; // Ensure path is correct
// import { cn } from '@/lib/utils';

export function HeroSection() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-[var(--background-color-val)] to-[var(--widget-background-val)] text-center">
      <div className="container mx-auto px-6">
        <AIDALogoIcon className="w-20 h-20 mx-auto mb-8 animate-pulse" />
        <h1 className="font-orbitron text-5xl md:text-7xl font-bold mb-6">
          Meet <span className="accent-text">AIDA</span>
        </h1>
        <p className="text-xl md:text-2xl text-[var(--text-muted-color-val)] mb-10 max-w-3xl mx-auto">
          Your intelligent personal assistant and dashboard, designed to streamline your tasks, goals, notes, and events with the power of AI.
        </p>
        <div className="space-x-4">
          <Link href="/register" legacyBehavior>
            <Button size="lg" className="btn-primary text-lg px-8 py-6">
              Get Started Free
            </Button>
          </Link>
          <Link href="#features" legacyBehavior>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-[var(--accent-color-val)] text-[var(--accent-color-val)] hover:bg-[var(--accent-color-val)]/10 hover:text-[var(--accent-color-val)]">
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

