-- ========================================
-- CONFIGURACIÓN DE BASE DE DATOS SUPABASE
-- ParetVision - AI Technical Support
-- ========================================

-- Habilitar extensión para embeddings vectoriales
CREATE EXTENSION IF NOT EXISTS vector;

-- ========================================
-- TABLA: documents
-- Almacena los documentos subidos por los usuarios
-- ========================================
CREATE TABLE IF NOT EXISTS documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('pdf', 'docx', 'txt', 'image')),
  file_path TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ========================================
-- TABLA: document_embeddings
-- Almacena los embeddings de los documentos para búsqueda semántica
-- ========================================
CREATE TABLE IF NOT EXISTS document_embeddings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  embedding VECTOR(1536), -- OpenAI embeddings son de 1536 dimensiones
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ========================================
-- TABLA: chat_sessions
-- Almacena las sesiones de chat de los usuarios
-- ========================================
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ========================================
-- TABLA: chat_messages
-- Almacena los mensajes individuales de cada sesión de chat
-- ========================================
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ========================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ========================================
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(type);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_document_embeddings_document_id ON document_embeddings(document_id);

-- Índice para búsqueda vectorial (importante para rendimiento)
CREATE INDEX IF NOT EXISTS idx_document_embeddings_vector ON document_embeddings USING ivfflat (embedding vector_cosine_ops);

-- ========================================
-- FUNCIONES AUXILIARES
-- ========================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_documents_updated_at 
    BEFORE UPDATE ON documents 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_sessions_updated_at 
    BEFORE UPDATE ON chat_sessions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- CONFIGURACIÓN RLS (Row Level Security)
-- ========================================

-- Habilitar RLS en todas las tablas
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Políticas permisivas para desarrollo
-- NOTA: En producción, ajusta estas políticas según tus necesidades de seguridad

-- Políticas para documents
CREATE POLICY "Allow all operations on documents" ON documents
    FOR ALL USING (true);

-- Políticas para document_embeddings
CREATE POLICY "Allow all operations on document_embeddings" ON document_embeddings
    FOR ALL USING (true);

-- Políticas para chat_sessions
CREATE POLICY "Allow all operations on chat_sessions" ON chat_sessions
    FOR ALL USING (true);

-- Políticas para chat_messages
CREATE POLICY "Allow all operations on chat_messages" ON chat_messages
    FOR ALL USING (true);

-- ========================================
-- CONFIGURACIÓN DE STORAGE (OPCIONAL)
-- Para almacenar archivos subidos
-- ========================================

-- Crear bucket para documentos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- Política para el bucket de documentos
CREATE POLICY "Allow all operations on documents bucket" ON storage.objects
    FOR ALL USING (bucket_id = 'documents');

-- ========================================
-- DATOS DE EJEMPLO (OPCIONAL)
-- ========================================

-- Insertar una sesión de chat de ejemplo
INSERT INTO chat_sessions (id, title) 
VALUES (gen_random_uuid(), 'Sesión de ejemplo')
ON CONFLICT DO NOTHING;

-- ========================================
-- VERIFICACIÓN DE CONFIGURACIÓN
-- ========================================

-- Mostrar las tablas creadas
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename IN ('documents', 'document_embeddings', 'chat_sessions', 'chat_messages')
ORDER BY tablename;

-- Verificar que la extensión vector esté habilitada
SELECT extname, extversion FROM pg_extension WHERE extname = 'vector';

-- Mostrar información de las tablas
\d+ documents;
\d+ document_embeddings;
\d+ chat_sessions;
\d+ chat_messages;
