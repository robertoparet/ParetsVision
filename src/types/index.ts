export interface Document {
  id: string;
  title: string;
  content: string;
  type: 'pdf' | 'docx' | 'txt' | 'image';
  url?: string;
  metadata?: DocumentMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentMetadata {
  author?: string;
  pages?: number;
  size: number;
  mimeType: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
  documentContext?: string[];
  imageUrl?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchResult {
  id: string;
  title: string;
  content: string;
  score: number;
  metadata?: DocumentMetadata;
}

export interface EmbeddingResponse {
  embedding: number[];
  text: string;
}

export interface UploadResponse {
  success: boolean;
  document?: Document;
  error?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
