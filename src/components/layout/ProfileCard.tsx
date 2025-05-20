"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea'; // For displaying context
import { LogOut, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserProfileData {
  name?: string | null;
  email?: string | null;
  userContextSummary?: string;
}

interface ProfileCardProps {
  user: UserProfileData | null;
  isLoading: boolean;
  onSignOut: () => void;
  onRefreshContext?: () => void; // Optional: for manually refreshing context display
}

export function ProfileCard({ user, isLoading, onSignOut, onRefreshContext }: ProfileCardProps) {
  return (
    <div className="p-4 space-y-4 bg-popover text-popover-foreground rounded-md shadow-lg border border-border w-80">
      <div className="pb-3 border-b border-border">
        <h4 className="text-sm font-medium text-muted-foreground">Profile</h4>
        {isLoading && !user && <p className="text-xs text-muted-foreground">Loading profile...</p>}
        {user && (
          <>
            <p className="text-base font-semibold text-foreground truncate" title={user.name || user.email || undefined}>
              {user.name || user.email?.split('@')[0] || 'User'}
            </p>
            <p className="text-xs text-muted-foreground truncate" title={user.email || undefined}>{user.email}</p>
          </>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
            <h5 className="text-sm font-medium text-muted-foreground">AI Context Summary</h5>
            {onRefreshContext && (
                 <Button variant="ghost" size="icon" onClick={onRefreshContext} className="w-6 h-6 text-muted-foreground hover:text-accent-foreground" title="Refresh Context">
                    <RefreshCw className="w-3 h-3"/>
                </Button>
            )}
        </div>
        {isLoading && <p className="text-xs text-muted-foreground">Loading context...</p>}
        {!isLoading && (
          <Textarea
            readOnly
            value={user?.userContextSummary || "No AI context summary available yet. Chat with AIDA to build one!"}
            className="input-field h-32 text-xs resize-none bg-input-bg/50 custom-scrollbar-fullscreen"
            placeholder="AI context summary..."
          />
        )}
         <p className="text-[11px] text-muted-foreground/70 mt-1">This is what AIDA remembers about your preferences and recent topics to personalize your experience.</p>
      </div>

      <Button variant="outline" size="sm" onClick={onSignOut} className="w-full border-border text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
        <LogOut className="mr-2 h-4 w-4" />
        Sign Out
      </Button>
    </div>
  );
}
