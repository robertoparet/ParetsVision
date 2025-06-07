# ParetVision - Asistente Técnico con IA

Una aplicación web moderna de asistencia técnica basada en IA que permite procesar documentos, analizar imágenes técnicas y proporcionar soporte inteligente a través de chat.

## 🚀 Características

- **Chat con IA**: Interfaz de chat inteligente para consultas técnicas
- **Procesamiento de Documentos**: Soporte para PDFs, DOCX, TXT e imágenes
- **Análisis de Imágenes**: Análisis de diagramas técnicos con GPT-4 Vision
- **Búsqueda Semántica**: Búsqueda inteligente en documentos usando embeddings
- **Base de Datos Vectorial**: Almacenamiento eficiente con Supabase
- **UI Moderna**: Interfaz responsive con Tailwind CSS y Radix UI

## 🛠️ Tecnologías

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Backend**: Next.js API Routes
- **Base de Datos**: Supabase (PostgreSQL + Vector Storage)
- **IA**: OpenAI (GPT-4, GPT-4 Vision, text-embedding-3-small)
- **Procesamiento**: PDF-parse, Mammoth, Sharp

## 📋 Prerrequisitos

- Node.js 18+ 
- Cuenta en [Supabase](https://supabase.com)
- API Key de [OpenAI](https://openai.com)

## 🔧 Instalación

1. **Instalar dependencias**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno**
   ```bash
   cp .env.example .env.local
   ```
   
   Completar las variables en `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   OPENAI_API_KEY=your_openai_api_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **Configurar Supabase**
   
   Ejecutar en el SQL Editor de Supabase:
   ```sql
   -- Habilitar la extensión vector
   CREATE EXTENSION IF NOT EXISTS vector;

   -- Tabla de documentos
   CREATE TABLE documents (
     id TEXT PRIMARY KEY,
     title TEXT NOT NULL,
     content TEXT NOT NULL,
     type TEXT NOT NULL CHECK (type IN ('pdf', 'docx', 'txt', 'image')),
     url TEXT,
     metadata JSONB,
     embedding vector(1536),
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Tabla de chunks de documentos
   CREATE TABLE document_chunks (
     id TEXT PRIMARY KEY,
     document_id TEXT REFERENCES documents(id) ON DELETE CASCADE,
     content TEXT NOT NULL,
     embedding vector(1536),
     chunk_index INTEGER NOT NULL,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Índices para búsqueda vectorial
   CREATE INDEX ON documents USING ivfflat (embedding vector_cosine_ops);
   CREATE INDEX ON document_chunks USING ivfflat (embedding vector_cosine_ops);
   ```

4. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

## 🏗️ Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── api/               # API Routes
│   │   ├── chat/          # Endpoint de chat
│   │   ├── documents/     # CRUD de documentos
│   │   ├── upload/        # Subida de archivos
│   │   └── search/        # Búsqueda semántica
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página principal
├── components/            # Componentes React
│   ├── chat/             # Componentes de chat
│   ├── documents/        # Gestión de documentos
│   ├── layout/           # Layout components
│   └── ui/               # Componentes UI básicos
├── lib/                  # Configuraciones y clientes
├── types/                # Definiciones TypeScript
├── utils/                # Utilidades
└── hooks/                # React Hooks personalizados
```

## 📝 Uso

### Subir Documentos
1. Navegar a la pestaña "Documentos"
2. Arrastrar archivos o hacer clic para seleccionar
3. Formatos soportados: PDF, DOCX, TXT, PNG, JPG

### Chat con IA
1. Ir a la pestaña "Chat"
2. Escribir preguntas sobre documentos subidos
3. Subir imágenes para análisis técnico
4. El asistente buscará automáticamente contexto relevante

## 🔧 Scripts Disponibles

```bash
npm run dev          # Desarrollo
npm run build        # Construcción
npm run start        # Producción
npm run lint         # Linting
npm run type-check   # Verificación de tipos
```

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
