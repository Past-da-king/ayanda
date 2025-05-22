"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Header } from '@/components/layout/Header'; // Assuming Header is a shared layout component
import { FooterChat } from '@/components/layout/FooterChat'; // For consistent page structure
import { Loader2, RefreshCw, LogOut, UserCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface UserProfileData {
  id?: string;
  name?: string | null;
  email?: string | null;
  userContextSummary?: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Dummy states for FooterChat, as it's part of the layout
  // but its AI functionality isn't the primary focus of this page.
  // const [isProcessingAi, setIsProcessingAi] = useState(false); // setIsProcessingAi was unused
  const [currentFooterChatMessage, setCurrentFooterChatMessage] = useState('');


  const fetchProfileData = useCallback(async () => {
    if (status !== "authenticated") return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/profile');
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Failed to fetch profile (${res.status})`);
      }
      const data: UserProfileData = await res.json();
      setUserProfile(data);
    } catch (err) {
      console.error("Error fetching profile data:", err);
      setError((err as Error).message);
      setUserProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, [status]);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.replace('/login');
      return;
    }
    fetchProfileData();
  }, [status, router, fetchProfileData]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/landing' });
  };

  // Dummy handler for FooterChat
  const handleFooterCommand = (command: string) => {
    console.log("Footer command on profile page:", command);
    // Typically, you might disable AI commands on this page or provide a specific response.
  };
  
  const pagePaddingTop = "pt-[calc(5rem+1.5rem)]"; // Header height + gap

  if (status === "loading" || (status === "authenticated" && isLoading && !userProfile && !error)) {
    return (
      <div className="flex flex-col min-h-screen h-screen max-h-screen overflow-hidden">
        <Header />
        <main className={cn("flex-grow px-6 pb-6 flex justify-center items-center", pagePaddingTop)}
              style={{ height: "calc(100vh - 5rem - 70px)" }} >
          <Loader2 className="w-12 h-12 accent-text animate-spin" />
        </main>
         {status === "authenticated" && (
            <FooterChat 
                onSendCommand={handleFooterCommand} 
                onSendAudioCommand={() => handleFooterCommand("Audio command sent")}
                isProcessingAi={false} // Was state, now directly false as it's not used
                isAiChatModeActive={false} // Chat mode not relevant here
                currentChatInput={currentFooterChatMessage}
                onChatInputChange={setCurrentFooterChatMessage}
            />
        )}
      </div>
    );
  }


  return (
    <div className="flex flex-col min-h-screen h-screen max-h-screen overflow-hidden">
      <Header />
      <main 
        className={cn("flex-grow px-6 pb-6 overflow-y-auto custom-scrollbar-fullscreen", pagePaddingTop)}
        style={{ height: "calc(100vh - 5rem - 70px)" }} // Approx 70px for FooterChat
      >
        <div className="max-w-3xl mx-auto py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Link href="/" passHref legacyBehavior>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent-foreground">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <h1 className="font-orbitron text-3xl accent-text">My Profile</h1>
            </div>
          </div>

          {error && <p className="text-destructive bg-destructive/10 p-3 rounded-md mb-6">{error}</p>}

          <div className="space-y-8">
            {/* User Details Section */}
            <div className="bg-widget-background border border-border-main rounded-lg p-6 shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <UserCircle className="w-16 h-16 text-accent-color-val" />
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">
                    {userProfile?.name || session?.user?.name || 'User'}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {userProfile?.email || session?.user?.email}
                  </p>
                </div>
              </div>
              {/* Future: Add fields for editing name, password change link, etc. */}
            </div>

            {/* AI Context Summary Section */}
            <div className="bg-widget-background border border-border-main rounded-lg p-6 shadow-md">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-semibold text-foreground">AIDA Context Summary</h3>
                <Button variant="outline" size="sm" onClick={fetchProfileData} disabled={isLoading} className="text-xs border-border-main hover:bg-input-bg">
                  {isLoading ? <Loader2 className="w-3 h-3 mr-1.5 animate-spin"/> : <RefreshCw className="w-3 h-3 mr-1.5" />}
                  Refresh
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                This is what AIDA remembers about your preferences and recent topics to personalize your experience. It is updated after each chat session with AIDA.
              </p>
              <Textarea
                readOnly
                value={isLoading ? "Loading context..." : userProfile?.userContextSummary || "No AI context summary available yet. Chat with AIDA in the main dashboard to build one!"}
                className="input-field h-48 text-sm resize-none bg-input-bg/30 custom-scrollbar-fullscreen"
                placeholder="AI context summary..."
              />
            </div>

            {/* Sign Out Button */}
            <div className="pt-4">
              <Button variant="destructive" onClick={handleSignOut} className="w-full sm:w-auto">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </main>
      {status === "authenticated" && (
        <FooterChat 
            onSendCommand={handleFooterCommand} 
            onSendAudioCommand={() => handleFooterCommand("Audio command sent")}
            isProcessingAi={false} // Was state, now directly false as it's not used
            isAiChatModeActive={false}
            currentChatInput={currentFooterChatMessage}
            onChatInputChange={setCurrentFooterChatMessage}
        />
      )}
    </div>
  );
}
