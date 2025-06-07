'use client';

import React, { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { ChatMessage, ApiResponse } from '@/types';

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = useCallback(async (content: string, imageFile?: File) => {
    if (!content.trim() && !imageFile) return;

    const userMessage: ChatMessage = {
      id: uuidv4(),
      content,
      role: 'user',
      timestamp: new Date(),
      imageUrl: imageFile ? URL.createObjectURL(imageFile) : undefined,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('message', content);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        body: formData,
      });

      const data: ApiResponse<{ message: string }> = await response.json();

      if (data.success && data.data) {
        const assistantMessage: ChatMessage = {
          id: uuidv4(),
          content: data.data.message,
          role: 'assistant',
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || 'Error al procesar la consulta');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        content: 'Lo siento, ha ocurrido un error al procesar tu consulta. Por favor, intenta nuevamente.',
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b bg-background p-4">
        <h2 className="text-lg font-semibold">Asistente Técnico</h2>
        <p className="text-sm text-muted-foreground">
          Pregunta sobre documentos técnicos o sube imágenes para análisis
        </p>
      </div>
      
      <ChatMessages messages={messages} isLoading={isLoading} />
      <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
    </div>
  );
}
