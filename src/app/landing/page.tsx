import React from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Metadata } from 'next';
import { AIDALogoIcon } from '@/components/layout/AIDALogoIcon';
import { Brain, Zap, CalendarDays, ListChecks, Target, StickyNote, Palette, ShieldCheck, BotMessageSquare, SlidersHorizontal, Search, MicVocal, Sparkles, Projector } from 'lucide-react';
// import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'AIDA | Your Intelligent Command Center for Life & Work',
  description: 'Meet AIDA: The AI-powered personal assistant that unifies your tasks, goals, notes, and events. Organize, achieve, and thrive with intelligent automation and a customizable dashboard.',
  keywords: 'AI assistant, personal dashboard, task management, goal tracking, note taking, event scheduling, productivity app, AI productivity, intelligent assistant, Next.js, MongoDB, Gemini AI',
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string; }> = ({ icon, title, description }) => (
  <div className="bg-[var(--widget-background-val)] p-6 rounded-lg border border-[var(--border-color-val)] shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-[1.03]">
    <div className="flex justify-center mb-4">
      {icon}
    </div>
    <h3 className="font-orbitron text-xl text-center accent-text mb-2">{title}</h3>
    <p className="text-sm text-[var(--text-muted-color-val)] text-center leading-relaxed">
      {description}
    </p>
  </div>
);

const BenefitPill: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <span className="inline-block bg-[var(--accent-color-val)]/10 text-[var(--accent-color-val)] text-xs font-semibold mr-2 mb-2 px-3 py-1.5 rounded-full">
        {children}
    </span>
);

export default function LandingPageV2() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--background-color-val)] text-[var(--text-color-val)]">
      <Header />
      <main className="flex-grow pt-[5rem]">

        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-gradient-to-br from-[var(--background-color-val)] via-[var(--widget-background-val)]/30 to-[var(--background-color-val)] text-center">
          <div className="container mx-auto px-6">
            <AIDALogoIcon className="w-24 h-24 md:w-28 md:h-28 mx-auto mb-6 animate-pulse" />
            <h1 className="font-orbitron text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              Meet <span className="accent-text">AIDA</span>: Your Intelligent Command Center
            </h1>
            <p className="text-lg md:text-xl text-[var(--text-muted-color-val)] mb-10 max-w-3xl mx-auto">
              Unify your tasks, goals, notes, and events with a smart, AI-powered assistant.
              AIDA understands you, adapts to your workflow, and helps you conquer your day.
            </p>
            <div className="space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/register" legacyBehavior>
                <Button size="lg" className="btn-primary text-lg px-8 py-6 w-full sm:w-auto transform hover:scale-105 transition-transform">
                  Get Started Free
                </Button>
              </Link>
              <Link href="#features" legacyBehavior>
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 w-full sm:w-auto border-[var(--accent-color-val)] text-[var(--accent-color-val)] hover:bg-[var(--accent-color-val)]/10 hover:text-[var(--accent-color-val)] transform hover:scale-105 transition-transform">
                  Explore Features
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Problem/Solution Section */}
        <section className="py-16 md:py-24 bg-[var(--widget-background-val)]">
            <div className="container mx-auto px-6 text-center">
                <h2 className="font-orbitron text-3xl md:text-4xl font-bold mb-4">
                    Feeling <span className="accent-text">Overwhelmed & Disorganized</span>?
                </h2>
                <p className="text-lg text-[var(--text-muted-color-val)] mb-10 max-w-2xl mx-auto">
                    Juggling countless apps, scattered notes, and a never-ending to-do list? AIDA brings everything into one intelligent hub, simplifying your life so you can focus on what truly matters.
                </p>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    <div className="text-center p-4">
                        <Zap className="w-12 h-12 text-[var(--accent-color-val)] mx-auto mb-3"/>
                        <h3 className="font-semibold text-xl mb-1">Scattered Information</h3>
                        <p className="text-sm text-[var(--text-muted-color-val)]">Notes here, tasks there, goals somewhere else... it&apos;s hard to keep track.</p>
                    </div>
                    <div className="text-center p-6 bg-[var(--background-color-val)] rounded-lg shadow-2xl border-2 border-[var(--accent-color-val)] relative -top-4">
                        <AIDALogoIcon className="w-16 h-16 text-[var(--accent-color-val)] mx-auto mb-3"/>
                        <h3 className="font-orbitron accent-text text-2xl mb-2">AIDA is the Solution</h3>
                        <p className="text-md text-[var(--text-color-val)]">One smart platform for total organization, powered by AI that understands your needs.</p>
                    </div>
                    <div className="text-center p-4">
                        <Brain className="w-12 h-12 text-[var(--accent-color-val)] mx-auto mb-3"/>
                        <h3 className="font-semibold text-xl mb-1">Mental Overload</h3>
                        <p className="text-sm text-[var(--text-muted-color-val)]">Constantly trying to remember everything drains your energy and focus.</p>
                    </div>
                </div>
            </div>
        </section>


        {/* Key Features Section */}
        <section id="features" className="py-16 md:py-24 bg-[var(--background-color-val)]">
          <div className="container mx-auto px-6">
            <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-center mb-4">
              AIDA&apos;s <span className="accent-text">Powerful Toolkit</span>
            </h2>
            <p className="text-lg text-[var(--text-muted-color-val)] text-center mb-12 md:mb-16 max-w-2xl mx-auto">
              Discover features designed for clarity, efficiency, and intelligent assistance.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<BotMessageSquare className="w-12 h-12 accent-text" />}
                title="AI-Powered Management"
                description="Use natural language (text or voice!) to create, update, and manage tasks, notes, goals, and events. AIDA understands and executes."
              />
              <FeatureCard
                icon={<SlidersHorizontal className="w-12 h-12 accent-text" />}
                title="Unified Dashboard"
                description="Get a bird's-eye view of your day. Upcoming tasks, events, goal progress, and AI insights, all in one customizable place."
              />
              <FeatureCard
                icon={<Projector className="w-12 h-12 accent-text" />}
                title="Project-Based Organization"
                description="Structure your life and work with flexible projects. Filter your views and keep everything neatly categorized."
              />
              <FeatureCard
                icon={<ListChecks className="w-12 h-12 accent-text" />}
                title="Smart Task & Sub-Task System"
                description="Manage complex to-dos with sub-tasks, due dates, recurrence rules, and link tasks directly to your goals for calculated progress."
              />
               <FeatureCard
                icon={<Target className="w-12 h-12 accent-text" />}
                title="Dynamic Goal Tracking"
                description="Set ambitious goals and watch your progress update automatically as you complete linked tasks. Stay motivated and on track."
              />
              <FeatureCard
                icon={<CalendarDays className="w-12 h-12 accent-text" />}
                title="Intelligent Event Scheduling"
                description="Organize your calendar with recurring events, Markdown descriptions, and clear visual cues for what's next."
              />
              <FeatureCard
                icon={<StickyNote className="w-12 h-12 accent-text" />}
                title="Quick & Rich Notes"
                description="Capture ideas, reminders, and important information effortlessly. Notes are easily searchable and categorized."
              />
               <FeatureCard
                icon={<Palette className="w-12 h-12 accent-text" />}
                title="Personalized Themes & Fonts"
                description="Make AIDA yours. Choose from multiple color themes (light/dark) and fonts to create your perfect workspace."
              />
              <FeatureCard
                icon={<Brain className="w-12 h-12 accent-text" />}
                title="Persistent AI Context"
                description="AIDA learns from your interactions, remembering preferences and past topics to provide more personalized and efficient assistance over time."
              />
            </div>
          </div>
        </section>
        
        {/* How AI Works / Benefits Section */}
        <section className="py-16 md:py-24 bg-[var(--widget-background-val)]">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="font-orbitron text-3xl md:text-4xl font-bold mb-4">
                       The <span className="accent-text">AIDA Advantage</span>: Beyond a To-Do List
                    </h2>
                    <p className="text-lg text-[var(--text-muted-color-val)] max-w-3xl mx-auto">
                        AIDA isn&apos;t just another productivity tool. It&apos;s an intelligent partner designed to adapt to you, learn from you, and actively help you achieve more with less stress.
                    </p>
                </div>
                <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center mb-2">
                                <MicVocal className="w-7 h-7 accent-text mr-3 shrink-0"/>
                                <h3 className="text-xl font-semibold">Converse, Don&apos;t Just Click</h3>
                            </div>
                            <p className="text-[var(--text-muted-color-val)] text-sm">
                                Tell AIDA what you need in plain English or via voice command. &quot;Remind me to call John tomorrow at 2 PM about the project update &quot; is all it takes. No more navigating complex menus.
                            </p>
                        </div>
                         <div>
                            <div className="flex items-center mb-2">
                                <Sparkles className="w-7 h-7 accent-text mr-3 shrink-0"/>
                                <h3 className="text-xl font-semibold">Intelligence That Grows With You</h3>
                            </div>
                            <p className="text-[var(--text-muted-color-val)] text-sm">
                                AIDA&apos;s persistent context summary means it gets smarter and more helpful with every interaction. It remembers your projects, priorities, and preferences.
                            </p>
                        </div>
                        <div>
                            <div className="flex items-center mb-2">
                                <Search className="w-7 h-7 accent-text mr-3 shrink-0"/>
                                <h3 className="text-xl font-semibold">Find Anything, Instantly</h3>
                            </div>
                            <p className="text-[var(--text-muted-color-val)] text-sm">
                                Global search cuts through the clutter. Whether it&apos;s a task from last month or a note from yesterday, AIDA finds it fast.
                            </p>
                        </div>
                    </div>
                    <div className="bg-[var(--background-color-val)] p-6 sm:p-8 rounded-lg shadow-xl border border-[var(--border-color-val)]">
                        <h4 className="font-orbitron text-2xl mb-4 text-center">AIDA Helps You:</h4>
                        <div className="flex flex-wrap justify-center">
                            <BenefitPill>Reduce Mental Clutter</BenefitPill>
                            <BenefitPill>Achieve Goals Faster</BenefitPill>
                            <BenefitPill>Never Miss a Deadline</BenefitPill>
                            <BenefitPill>Streamline Workflows</BenefitPill>
                            <BenefitPill>Stay Organized Effortlessly</BenefitPill>
                            <BenefitPill>Boost Productivity</BenefitPill>
                            <BenefitPill>Personalize Your Workspace</BenefitPill>
                            <BenefitPill>Manage Everything in One Place</BenefitPill>
                        </div>
                         <div className="mt-8 text-center">
                            <ShieldCheck className="w-10 h-10 text-green-400 mx-auto mb-2"/>
                            <p className="text-sm text-green-400/80">Your data is managed securely with user-specific access and robust authentication.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 md:py-32 bg-[var(--background-color-val)] bg-gradient-to-tr from-[var(--accent-color-val)]/5 via-[var(--background-color-val)] to-[var(--background-color-val)]">
          <div className="container mx-auto px-6 text-center">
            <h2 className="font-orbitron text-4xl md:text-5xl font-bold mb-6">
              Ready to <span className="accent-text">Elevate Your Productivity</span>?
            </h2>
            <p className="text-lg text-[var(--text-muted-color-val)] mb-10 max-w-xl mx-auto">
              Stop juggling, start achieving. Join AIDA today and experience the future of personal organization.
            </p>
            <Link href="/register" legacyBehavior>
              <Button 
                size="lg" 
                className="btn-primary text-xl px-12 py-8 animate-pulse hover:animate-none transform hover:scale-105 transition-transform duration-300 shadow-2xl hover:shadow-[0_0_60px_-15px_var(--accent-color-val)]"
              >
                Unlock Your AIDA Now
              </Button>
            </Link>
          </div>
        </section>

        {/* Footer Section - Basic */}
        <footer className="py-10 border-t border-[var(--border-color-val)] bg-[var(--widget-background-val)]">
            <div className="container mx-auto px-6 text-center">
                <AIDALogoIcon className="w-10 h-10 mx-auto mb-3" />
                <p className="text-sm text-[var(--text-muted-color-val)]">
                    &copy; {new Date().getFullYear()} AIDA. Your Intelligent Command Center.
                </p>
                <p className="text-xs text-[var(--text-muted-color-val)]/70 mt-1">
                    {/* Placeholder for future links */}
                    {/* <Link href="/privacy" className="hover:accent-text transition-colors">Privacy Policy</Link> | 
                    <Link href="/terms" className="hover:accent-text transition-colors"> Terms of Service</Link> */}
                </p>
            </div>
        </footer>
      </main>
    </div>
  );
}

