'use client';

import React from 'react';
import { User, Bot } from 'lucide-react';
import { ChatMessage } from '@/types';
import { formatDate } from '@/utils';

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
        isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
      }`}>
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      
      <div className={`flex max-w-[80%] flex-col gap-2 ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`rounded-2xl px-4 py-2 ${
          isUser 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted text-muted-foreground'
        }`}>
          {message.imageUrl && (
            <div className="mb-2">
              <img
                src={message.imageUrl}
                alt="Imagen adjunta"
                className="max-w-sm rounded-lg"
              />
            </div>
          )}
          
          <p className="whitespace-pre-wrap text-sm">
            {message.content}
          </p>
        </div>
        
        <span className="text-xs text-muted-foreground">
          {formatDate(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
