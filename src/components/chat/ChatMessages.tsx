'use client';

import React, { useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubble';
import { ChatMessage } from '@/types';

interface ChatMessagesProps {
  messages: ChatMessage[];
  isLoading?: boolean;
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="flex h-full items-center justify-center text-center">
          <div className="max-w-sm">
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              ¡Bienvenido a ParetVision!
            </h3>
            <p className="text-sm text-muted-foreground">
              Soy tu asistente técnico con IA. Puedes preguntarme sobre documentos, 
              subir manuales o imágenes de diagramas técnicos para obtener ayuda.
            </p>
          </div>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          
          {isLoading && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
              <div className="flex max-w-[80%] flex-col gap-2">
                <div className="rounded-2xl bg-muted px-4 py-2">
                  <p className="text-sm text-muted-foreground">
                    Analizando tu consulta...
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
}
