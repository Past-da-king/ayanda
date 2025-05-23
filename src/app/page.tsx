import React, { Suspense } from 'react';
import HomePageContent from './HomePageContent'; // Import the new client component
import { Loader2 } from 'lucide-react'; // For a fallback loading UI

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col min-h-screen h-screen max-h-screen overflow-hidden">
        {/* You might want a simpler Header or no Header for the fallback */}
        {/* <Header /> */}
        <main className="flex-grow flex justify-center items-center p-6 pt-[5rem]">
          <Loader2 className="w-12 h-12 text-accent-color-val animate-spin" />
        </main>
      </div>
    }>
      <HomePageContent />
    </Suspense>
  );
}
