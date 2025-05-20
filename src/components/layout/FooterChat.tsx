"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Square, Loader2 } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea"; // Changed from Input to Textarea
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

interface FooterChatProps {
  onSendCommand: (command: string) => void;
  onSendAudioCommand: (audioBase64: string, mimeType: string) => void;
  isProcessingAi: boolean;
  isAiChatModeActive: boolean;
  currentChatInput: string; 
  onChatInputChange?: (value: string) => void;
}

export function FooterChat({ 
  onSendCommand, 
  onSendAudioCommand, 
  isProcessingAi, 
  isAiChatModeActive,
  currentChatInput,
  onChatInputChange
}: FooterChatProps) {
  
  const [localMessage, setLocalMessage] = useState(''); // For non-chat mode input
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);


  const inputValue = isAiChatModeActive ? currentChatInput : localMessage;
  const setInputValue = isAiChatModeActive ? (onChatInputChange || setLocalMessage) : setLocalMessage;

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);
  
  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set to scroll height
    }
  }, [inputValue]);


  const handleTextSend = () => {
    const messageToSend = inputValue.trim();
    if (messageToSend) {
      onSendCommand(messageToSend);
      setInputValue('');
       if (textareaRef.current) { // Reset height after send
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); 
      if(!isProcessingAi) handleTextSend();
    }
  };


  const startRecording = async () => {
    setRecordingError(null);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorderRef.current?.mimeType || 'audio/webm' });
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = () => {
            const base64Audio = reader.result as string;
            const pureBase64 = base64Audio.substring(base64Audio.indexOf(',') + 1);
            onSendAudioCommand(pureBase64, mediaRecorderRef.current?.mimeType || 'audio/webm');
          };
          audioChunksRef.current = [];
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Error accessing microphone:", err);
        setRecordingError("Mic access error. Check permissions.");
        setIsRecording(false);
      }
    } else {
      setRecordingError("Audio recording not supported.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const placeholderText = isAiChatModeActive ? "Message AIDA... (Shift+Enter for new line)" : "AYANDA, what can I help you with?";

  return (
    <div 
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-[98]",
        "w-[clamp(300px,60%,700px)]", 
        "bg-[rgba(20,20,20,0.9)] backdrop-blur-md",
        "border border-[var(--border-color-val)] rounded-full", // Keep rounded-full for overall shape
        "pl-5 pr-2 py-2",
        "shadow-[0_10px_30px_rgba(0,0,0,0.5)]",
        "flex items-end gap-2" // items-end for button alignment with growing textarea
      )}
    >
      {recordingError && <p className="text-xs text-destructive px-2 flex-grow text-center self-center">{recordingError}</p>}
      {!isRecording && (
        <Textarea
          ref={textareaRef}
          rows={1} // Start with 1 row
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholderText}
          className={cn(
            "flex-grow bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0",
            "text-[var(--text-color-val)] text-[0.925rem] placeholder:text-[var(--text-muted-color-val)]",
            "resize-none overflow-y-auto py-2 px-0 leading-tight max-h-[120px]", // Max height for textarea
            "custom-scrollbar-footerchat" // Specific scrollbar for this textarea if needed
          )}
          onKeyDown={handleKeyDown}
          disabled={isProcessingAi || isRecording}
        />
      )}
      {isRecording && (
        <div className="flex-grow flex items-center justify-center h-10"> {/* Match button height */}
          <span className="text-sm text-[var(--accent-color-val)] animate-pulse">Recording... Click mic to stop.</span>
        </div>
      )}

      <Button 
        size="icon"
        onClick={handleMicClick} 
        className={cn(
          isRecording ? "bg-destructive text-white hover:bg-destructive/90" : "bg-transparent text-[var(--text-muted-color-val)] hover:text-[var(--accent-color-val)]",
          "rounded-full w-10 h-10",
          "flex items-center justify-center shrink-0"
        )}
        disabled={isProcessingAi && !isRecording} 
        aria-label={isRecording ? "Stop Recording" : "Start Recording"}
      >
        {isRecording ? <Square className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
      </Button>

      {!isRecording && (
        <Button 
          size="icon"
          onClick={handleTextSend} 
          className={cn(
            "bg-[var(--accent-color-val)] text-[var(--background-color-val)] hover:bg-[#00B8D4]",
            "rounded-full w-10 h-10",
            "flex items-center justify-center shrink-0"
          )}
          disabled={!inputValue.trim() || isProcessingAi || isRecording}
          aria-label="Submit AI Input"
        >
          {isProcessingAi ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        </Button>
      )}
    </div>
  );
}
