'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, FileText, Search, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { DocumentManager } from '@/components/documents/DocumentManager';
import { Document } from '@/types';

type ActiveTab = 'chat' | 'documents' | 'search' | 'settings';

export function MainLayout() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('chat');
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    // Load documents on mount
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/documents');
      const data = await response.json();
      
      if (data.success && data.data) {
        setDocuments(data.data);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const tabs = [
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'documents', label: 'Documentos', icon: FileText },
    { id: 'search', label: 'Buscar', icon: Search },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ] as const;

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatInterface />;
      case 'documents':
        return (
          <DocumentManager
            documents={documents}
            onDocumentsChange={setDocuments}
          />
        );
      case 'search':
        return (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Búsqueda de Documentos</h3>
              <p className="text-sm text-muted-foreground">
                Próximamente: Búsqueda semántica en documentos
              </p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <Settings className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Configuración</h3>
              <p className="text-sm text-muted-foreground">
                Próximamente: Configuración de la aplicación
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-muted/40">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">ParetVision</h1>
          <p className="text-sm text-muted-foreground">
            Asistente Técnico con IA
          </p>
        </div>
        
        <nav className="p-2">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'secondary' : 'ghost'}
              className="w-full justify-start mb-1"
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className="mr-2 h-4 w-4" />
              {tab.label}
            </Button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
}
