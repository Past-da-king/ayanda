import React from 'react';
import { Header } from '@/components/layout/Header'; // Assuming Header handles its own auth logic
import { FooterChat } from '@/components/layout/FooterChat'; // Assuming this is fine for landing
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Metadata } from 'next';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'AYANDA | Your Intelligent Personal Assistant',
  description: 'AYANDA helps you manage tasks, goals, notes, and events with AI. Streamline your productivity and organize your life effortlessly.',
  keywords: 'AI assistant, personal dashboard, task management, goal tracking, note taking, event scheduling, productivity app',
};


export default function LandingPage() {
  // The onSendCommand for FooterChat on a landing page might not be relevant
  // or could be a no-op / log to console / specific landing page action
  const handleLandingPageCommand = (command: string) => {
    console.log("Landing page AI command attempt:", command);
    // Perhaps redirect to login or show a message that AI features are for logged-in users
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background-color-val)] text-[var(--text-color-val)]">
      <Header />
      <main className="flex-grow pt-[5rem]"> {/* Adjust pt if header height changes */}
        <HeroSection />
        <FeaturesSection />
        
        {/* Call to Action Section */}
        <section className="py-16 md:py-24 bg-[var(--background-color-val)]">
          <div className="container mx-auto px-6 text-center">
            <h2 className="font-orbitron text-3xl md:text-4xl font-bold mb-6">
              Ready to Supercharge Your Productivity?
            </h2>
            <p className="text-lg text-[var(--text-muted-color-val)] mb-8 max-w-xl mx-auto">
              Join AYANDA today and transform the way you manage your life and work.
            </p>
            <Link href="/register" legacyBehavior>
              <Button size="lg" className="btn-primary text-lg px-10 py-6 animate-bounce">
                Sign Up Now - It&apos;s Free!
              </Button>
            </Link>
          </div>
        </section>

        {/* Footer Section - Basic */}
        <footer className="py-8 border-t border-[var(--border-color-val)] bg-[var(--widget-background-val)]">
            <div className="container mx-auto px-6 text-center text-sm text-[var(--text-muted-color-val)]">
                &copy; {new Date().getFullYear()} AYANDA. All rights reserved.
                {/* Add more links if needed, e.g., Privacy Policy, Terms of Service */}
            </div>
        </footer>
      </main>
      {/* FooterChat might be conditionally rendered or have different behavior on landing */}
      {/* <FooterChat onSendCommand={handleLandingPageCommand} /> */}
    </div>
  );
}

