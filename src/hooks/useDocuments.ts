import { useState, useEffect } from 'react';
import { Document, ApiResponse } from '@/types';

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/documents');
      const data: ApiResponse<Document[]> = await response.json();
      
      if (data.success && data.data) {
        setDocuments(data.data);
      } else {
        throw new Error(data.error || 'Error al cargar documentos');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
      });
      
      const data: ApiResponse = await response.json();
      
      if (data.success) {
        setDocuments(prev => prev.filter(doc => doc.id !== id));
        return true;
      } else {
        throw new Error(data.error || 'Error al eliminar documento');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return false;
    }
  };

  const addDocument = (document: Document) => {
    setDocuments(prev => [document, ...prev]);
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return {
    documents,
    loading,
    error,
    refetch: fetchDocuments,
    deleteDocument,
    addDocument,
  };
}
