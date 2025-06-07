'use client';

import React, { useState, useCallback } from 'react';
import { Upload, File, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Document, ApiResponse } from '@/types';
import { formatFileSize, formatDate } from '@/utils';

interface DocumentManagerProps {
  documents: Document[];
  onDocumentsChange: (documents: Document[]) => void;
}

export function DocumentManager({ documents, onDocumentsChange }: DocumentManagerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = useCallback(async (files: FileList) => {
    if (files.length === 0) return;

    setIsUploading(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data: ApiResponse<{ document: Document }> = await response.json();
        
        if (data.success && data.data) {
          return data.data.document;
        } else {
          throw new Error(data.error || `Error al subir ${file.name}`);
        }
      });

      const uploadedDocuments = await Promise.all(uploadPromises);
      onDocumentsChange([...documents, ...uploadedDocuments]);
    } catch (error) {
      console.error('Error uploading files:', error);
      // TODO: Show error toast
    } finally {
      setIsUploading(false);
    }
  }, [documents, onDocumentsChange]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDeleteDocument = useCallback(async (documentId: string) => {
    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'DELETE',
      });

      const data: ApiResponse = await response.json();
      
      if (data.success) {
        onDocumentsChange(documents.filter(doc => doc.id !== documentId));
      } else {
        throw new Error(data.error || 'Error al eliminar el documento');
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      // TODO: Show error toast
    }
  }, [documents, onDocumentsChange]);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b bg-background p-4">
        <h2 className="text-lg font-semibold">Documentos</h2>
        <p className="text-sm text-muted-foreground">
          Sube manuales, PDFs o imágenes técnicas
        </p>
      </div>

      {/* Upload Area */}
      <div className="p-4">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-muted-foreground/50'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">
            {isUploading ? 'Subiendo archivos...' : 'Arrastra archivos aquí'}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            O haz clic para seleccionar archivos
          </p>
          <Button
            disabled={isUploading}
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.multiple = true;
              input.accept = '.pdf,.docx,.txt,.png,.jpg,.jpeg';
              input.onchange = (e) => {
                const files = (e.target as HTMLInputElement).files;
                if (files) handleFileUpload(files);
              };
              input.click();
            }}
          >
            Seleccionar archivos
          </Button>
        </div>
      </div>

      {/* Documents List */}
      <div className="flex-1 overflow-y-auto p-4">
        {documents.length === 0 ? (
          <div className="text-center text-muted-foreground">
            <File className="mx-auto h-8 w-8 mb-2" />
            <p>No hay documentos subidos</p>
          </div>
        ) : (
          <div className="space-y-2">
            {documents.map((document) => (
              <div
                key={document.id}
                className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/50"
              >
                <File className="h-5 w-5 text-muted-foreground" />
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{document.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {document.metadata && formatFileSize(document.metadata.size)} • {' '}
                    {formatDate(document.createdAt)}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteDocument(document.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
