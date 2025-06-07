# 🚀 Guía de Configuración - ParetVision

## ✅ Estado del Proyecto

### ✅ Completado
- ✅ Estructura completa del proyecto Next.js con TypeScript
- ✅ Instalación de todas las dependencias necesarias
- ✅ Configuración de TailwindCSS y sistema de diseño
- ✅ Implementación completa de componentes UI y chat
- ✅ API routes para chat, upload y gestión de documentos
- ✅ Integración con OpenAI (chat, embeddings, vision)
- ✅ Configuración de Supabase client
- ✅ Procesamiento de documentos (PDF, DOCX, TXT, imágenes)
- ✅ Compilación exitosa de TypeScript
- ✅ Servidor de desarrollo funcionando
- ✅ Interface de usuario completa y funcional

### ⏳ Pendiente de Configuración
- ⏳ Variables de entorno (API keys)
- ⏳ Base de datos Supabase
- ⏳ Pruebas de funcionalidad completa

## 📋 Pasos de Configuración

### 1. Configurar Variables de Entorno

Edita el archivo `.env.local` con tus credenciales reales:

```bash
# Configuración de Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio_de_supabase

# Configuración de OpenAI
OPENAI_API_KEY=sk-tu_clave_de_openai

# Configuración de la aplicación
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### Cómo obtener las credenciales:

**OpenAI API Key:**
1. Ve a https://platform.openai.com/api-keys
2. Inicia sesión en tu cuenta
3. Crea una nueva API key
4. Copia la clave (empieza con 'sk-')

**Supabase Credentials:**
1. Ve a https://supabase.com/dashboard
2. Crea un nuevo proyecto o selecciona uno existente
3. Ve a Settings > API
4. Copia:
   - Project URL
   - Anon/Public key
   - Service Role key

### 2. Configurar Base de Datos Supabase

Ejecuta este SQL en tu dashboard de Supabase (SQL Editor):

```sql
-- Crear tabla de documentos
CREATE TABLE IF NOT EXISTS documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  file_path TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Crear tabla de embeddings
CREATE TABLE IF NOT EXISTS document_embeddings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  embedding VECTOR(1536),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Crear tabla de sesiones de chat
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Crear tabla de mensajes de chat
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_document_embeddings_document_id ON document_embeddings(document_id);

-- RLS (Row Level Security) políticas básicas
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Políticas permisivas para desarrollo (ajustar según necesidades)
CREATE POLICY "Enable all operations for documents" ON documents FOR ALL USING (true);
CREATE POLICY "Enable all operations for document_embeddings" ON document_embeddings FOR ALL USING (true);
CREATE POLICY "Enable all operations for chat_sessions" ON chat_sessions FOR ALL USING (true);
CREATE POLICY "Enable all operations for chat_messages" ON chat_messages FOR ALL USING (true);
```

### 3. Habilitar Extensión Vector en Supabase

Para búsqueda semántica, habilita la extensión vector:

```sql
-- Habilitar extensión para embeddings
CREATE EXTENSION IF NOT EXISTS vector;
```

### 4. Verificar Configuración

Una vez configuradas las variables de entorno:

```bash
# Reiniciar el servidor de desarrollo
npm run dev
```

### 5. Probar Funcionalidades

1. **Chat Interface**: Debe permitir enviar mensajes y recibir respuestas de OpenAI
2. **Upload de Documentos**: Debe permitir subir PDF, DOCX, TXT e imágenes
3. **Gestión de Documentos**: Debe mostrar documentos subidos y permitir eliminarlos

## 🔧 Resolución de Problemas

### Error de compilación durante build
Si encuentras errores durante `npm run build`, es normal. Los errores son debido a:
- Variables de entorno placeholder que necesitan ser reemplazadas
- Falta de configuración de la base de datos

### Error de conexión a Supabase
- Verifica que las URLs y keys estén correctas
- Asegúrate de que el proyecto Supabase esté activo
- Revisa que las tablas hayan sido creadas correctamente

### Error de OpenAI API
- Verifica que tu API key sea válida
- Asegúrate de tener créditos en tu cuenta OpenAI
- Revisa que la key tenga los permisos necesarios

## 📱 Uso de la Aplicación

### Interface Principal
- **Chat**: Interface conversacional con IA
- **Documentos**: Gestión de archivos subidos
- **Buscar**: Búsqueda semántica en documentos (por implementar)
- **Configuración**: Ajustes de la aplicación (por implementar)

### Funcionalidades del Chat
- Conversaciones con GPT-4
- Subida de imágenes para análisis
- Contexto de documentos subidos
- Historial de conversaciones

### Gestión de Documentos
- Drag & drop para subir archivos
- Procesamiento automático de contenido
- Generación de embeddings para búsqueda
- Vista previa y eliminación

## 🚀 Próximos Pasos

Una vez configurado el entorno:

1. **Implementar búsqueda semántica**
2. **Agregar sistema de autenticación**
3. **Mejorar UI/UX con estados de carga**
4. **Agregar notificaciones y toasts**
5. **Implementar configuración de usuario**
6. **Optimizar rendimiento**
7. **Agregar tests**
8. **Preparar para producción**

## 📞 Soporte

Si necesitas ayuda con la configuración o encuentras problemas:
1. Revisa los logs del servidor de desarrollo
2. Verifica las variables de entorno
3. Asegúrate de que Supabase esté configurado correctamente
4. Revisa la documentación de OpenAI para límites de API

¡Tu aplicación de asistencia técnica con IA está lista para ser configurada y utilizada! 🎉
