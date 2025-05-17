"use client";

import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function FooterChat() {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      console.log("Sending message:", message);
      setMessage('');
    }
  };

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-11/12 max-w-2xl z-50">
      <div className="flex items-center gap-2 p-1.5 bg-card border border-border rounded-full shadow-2xl">
        <Input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="AYANDA, what can I help you with?"
          className="flex-grow bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground px-4 py-2"
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <Button 
          size="icon" 
          onClick={handleSend} 
          className="bg-primary text-primary-foreground hover:bg-primary/90 w-10 h-10 rounded-full flex-shrink-0"
          disabled={!message.trim()}
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
