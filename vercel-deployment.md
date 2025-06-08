# 🚀 Guía de Despliegue en Vercel - ParetVision

Esta guía te ayudará a desplegar ParetVision en Vercel paso a paso.

## 📋 Prerrequisitos

- ✅ Código subido a GitHub
- ✅ Cuenta en [Vercel](https://vercel.com)
- ✅ Cuenta en [Supabase](https://supabase.com)
- ✅ API Key de [OpenAI](https://platform.openai.com/api-keys)

## 🎯 Pasos de Despliegue

### 1. Configurar Supabase

#### 1.1 Crear Proyecto en Supabase
```bash
1. Ve a https://supabase.com/dashboard
2. Clic en "New Project"
3. Elige tu organización
4. Nombra tu proyecto (ej: "paretvision-prod")
5. Elige una región cercana
6. Crea una contraseña segura para la base de datos
7. Clic en "Create new project"
```

#### 1.2 Configurar Base de Datos
```sql
1. Ve a "SQL Editor" en el dashboard de Supabase
2. Copia todo el contenido del archivo `supabase-setup.sql`
3. Pégalo en el editor SQL
4. Clic en "Run" para ejecutar el script
5. Verifica que todas las tablas se crearon correctamente
```

#### 1.3 Obtener Credenciales
```bash
1. Ve a Settings > API en tu proyecto de Supabase
2. Copia los siguientes valores:
   - Project URL (ej: https://abc123.supabase.co)
   - Anon key (empieza con "eyJ...")
   - Service Role key (empieza con "eyJ...")
```

### 2. Desplegar en Vercel

#### 2.1 Importar Proyecto
```bash
1. Ve a https://vercel.com/dashboard
2. Clic en "Add New..." > "Project"
3. Importar tu repositorio de GitHub
4. Selecciona el repositorio "ParetsVision"
5. Configura el proyecto:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: npm run build
   - Output Directory: .next
```

#### 2.2 Configurar Variables de Entorno
```bash
En la sección "Environment Variables" de Vercel, agrega:

NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_supabase_service_role_key
OPENAI_API_KEY=sk-tu_openai_api_key
NEXT_PUBLIC_APP_URL=https://tu-app.vercel.app
```

#### 2.3 Desplegar
```bash
1. Clic en "Deploy"
2. Espera a que termine el build (2-3 minutos)
3. ¡Tu aplicación estará lista!
```

## 🔧 Configuración Post-Despliegue

### 3. Verificar Funcionalidades

#### 3.1 Probar Chat
```bash
1. Ve a tu aplicación desplegada
2. Envía un mensaje de prueba
3. Verifica que recibes respuesta de OpenAI
```

#### 3.2 Probar Upload de Documentos
```bash
1. Ve a la sección "Documentos"
2. Sube un archivo PDF/DOCX/TXT de prueba
3. Verifica que aparece en la lista
4. Prueba hacer preguntas sobre el documento
```

#### 3.3 Verificar Base de Datos
```sql
1. Ve al SQL Editor de Supabase
2. Ejecuta: SELECT * FROM documents;
3. Deberías ver los documentos subidos
```

## 🚨 Solución de Problemas

### Error de Build
```bash
Problema: "TypeError: Invalid URL"
Solución: Verifica que todas las variables de entorno estén configuradas correctamente en Vercel
```

### Error de Supabase
```bash
Problema: "Missing Supabase environment variables"
Solución: 
1. Verifica que las variables estén en Vercel
2. Redespliega el proyecto
3. Verifica que el script SQL se ejecutó correctamente
```

### Error de OpenAI
```bash
Problema: "Invalid API key"
Solución:
1. Verifica que tu API key sea válida
2. Asegúrate de que tengas créditos en OpenAI
3. Verifica que la variable OPENAI_API_KEY esté configurada
```

## 📊 Monitoreo

### 4. Configurar Alertas
```bash
1. Ve a Vercel > Settings > Integrations
2. Configura notificaciones para deploys fallidos
3. Configura Supabase logs para monitorear errores
```

### 5. Analíticas
```bash
1. Vercel automáticamente proporciona analíticas
2. Ve a Analytics en tu dashboard
3. Monitorea performance y uso
```

## 🔄 Actualizaciones

### Despliegue Automático
```bash
Cada push a la rama master automáticamente:
1. Inicia un nuevo build en Vercel
2. Ejecuta tests (si están configurados)
3. Despliega si el build es exitoso
```

### Rollback
```bash
Si hay problemas:
1. Ve a Vercel > Deployments
2. Encuentra un deployment anterior estable
3. Clic en "..." > "Promote to Production"
```

## ⚡ Optimizaciones

### Performance
```bash
1. Imágenes optimizadas automáticamente por Vercel
2. Edge Functions para respuestas rápidas
3. CDN global incluido
```

### Seguridad
```bash
1. Variables de entorno encriptadas en Vercel
2. RLS habilitado en Supabase
3. HTTPS automático
```

## 📞 Soporte

Si encuentras problemas:
1. Revisa los logs en Vercel > Functions
2. Revisa los logs en Supabase > Logs
3. Verifica que todas las variables de entorno estén configuradas
4. Asegúrate de que tu API key de OpenAI tenga créditos

---

🎉 **¡Felicitaciones! Tu aplicación ParetVision está ahora funcionando en producción.**
