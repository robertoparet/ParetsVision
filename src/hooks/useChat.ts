import { useState, useCallback } from 'react';
import { ChatMessage, ApiResponse } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string, imageFile?: File) => {
    if (!content.trim() && !imageFile) return;

    const userMessage: ChatMessage = {
      id: uuidv4(),
      content,
      role: 'user',
      timestamp: new Date(),
      imageUrl: imageFile ? URL.createObjectURL(imageFile) : undefined,
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setError(null);

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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      
      const errorResponse: ChatMessage = {
        id: uuidv4(),
        content: 'Lo siento, ha ocurrido un error al procesar tu consulta. Por favor, intenta nuevamente.',
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearMessages,
  };
}
