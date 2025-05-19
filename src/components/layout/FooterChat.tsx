"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Square } from 'lucide-react'; // Added Mic, Square
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

interface FooterChatProps {
  onSendCommand: (command: string) => void;
  onSendAudioCommand: (audioBase64: string, mimeType: string) => void; // New prop for audio
  isProcessingAi: boolean; // To disable input during AI processing
}

export function FooterChat({ onSendCommand, onSendAudioCommand, isProcessingAi }: FooterChatProps) {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [recordingError, setRecordingError] = useState<string | null>(null);

  useEffect(() => {
    // Clean up MediaRecorder on component unmount if it's active
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);


  const handleTextSend = () => {
    if (message.trim()) {
      onSendCommand(message.trim());
      setMessage('');
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
            // remove 'data:audio/webm;base64,' part
            const pureBase64 = base64Audio.substring(base64Audio.indexOf(',') + 1);
            onSendAudioCommand(pureBase64, mediaRecorderRef.current?.mimeType || 'audio/webm');
          };
          audioChunksRef.current = [];
          // Stop all tracks on the stream to release the microphone
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Error accessing microphone:", err);
        setRecordingError("Microphone access denied or an error occurred. Please check permissions.");
        setIsRecording(false);
      }
    } else {
      setRecordingError("Audio recording is not supported by your browser.");
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

  return (
    <div 
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-[98]",
        "w-[clamp(300px,60%,700px)]", 
        "bg-[rgba(20,20,20,0.9)] backdrop-blur-md",
        "border border-[var(--border-color-val)] rounded-full",
        "pl-5 pr-2 py-2",
        "shadow-[0_10px_30px_rgba(0,0,0,0.5)]",
        "flex items-center gap-2" // Added gap for mic button
      )}
    >
      {recordingError && <p className="text-xs text-destructive px-2">{recordingError}</p>}
      {!isRecording && (
        <Input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="AYANDA, what can I help you with?"
          className={cn(
            "flex-grow bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0",
            "text-[var(--text-color-val)] text-[0.925rem] placeholder:text-[var(--text-muted-color-val)]"
          )}
          onKeyPress={(e) => e.key === 'Enter' && handleTextSend()}
          disabled={isProcessingAi || isRecording}
        />
      )}
      {isRecording && (
        <div className="flex-grow flex items-center justify-center h-full">
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
        disabled={isProcessingAi && !isRecording} // Allow stopping recording even if AI is processing previous command
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
          disabled={!message.trim() || isProcessingAi || isRecording}
          aria-label="Submit AI Input"
        >
          <Send className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
}
