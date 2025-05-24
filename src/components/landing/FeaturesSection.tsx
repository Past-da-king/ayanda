import React from 'react';
import { Brain, Zap, CalendarDays, ListChecks, Target, StickyNote } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { cn } from '@/lib/utils';

const features = [
  {
    icon: <Brain className="w-10 h-10 accent-text mb-4" />,
    title: 'AI-Powered Assistance',
    description: 'Leverage generative AI to quickly add tasks, notes, goals, and events using natural language commands.',
  },
  {
    icon: <ListChecks className="w-10 h-10 accent-text mb-4" />,
    title: 'Task Management',
    description: 'Organize your to-dos, set due dates, categorize tasks by project, and track your progress efficiently.',
  },
  {
    icon: <Target className="w-10 h-10 accent-text mb-4" />,
    title: 'Goal Tracking',
    description: 'Define your personal and professional goals, set targets, and monitor your achievements over time.',
  },
  {
    icon: <StickyNote className="w-10 h-10 accent-text mb-4" />,
    title: 'Quick Notes',
    description: 'Jot down ideas, reminders, and important information with an easy-to-use notes system.',
  },
  {
    icon: <CalendarDays className="w-10 h-10 accent-text mb-4" />,
    title: 'Event Scheduling',
    description: 'Keep track of your appointments, meetings, and important dates with an integrated calendar.',
  },
  {
    icon: <Zap className="w-10 h-10 accent-text mb-4" />,
    title: 'Unified Dashboard',
    description: 'Get a comprehensive overview of your upcoming tasks, events, goal progress, and recent notes all in one place.',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-16 md:py-24 bg-[var(--widget-background-val)]">
      <div className="container mx-auto px-6">
        <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-center mb-4">
          Why <span className="accent-text">AIDA</span>?
        </h2>
        <p className="text-lg text-[var(--text-muted-color-val)] text-center mb-12 md:mb-16 max-w-2xl mx-auto">
          AIDA brings clarity and control to your busy life. Focus on what matters most with our intuitive and powerful features.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="bg-[var(--input-bg-val)] border-[var(--border-color-val)] hover:border-[var(--accent-color-val)]/50 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
            >
              <CardHeader className="items-center">
                {feature.icon}
                <CardTitle className="font-orbitron text-xl text-center accent-text">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[var(--text-muted-color-val)] text-center text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

