#!/usr/bin/env node

/**
 * Script de configuración para ParetVision
 * Ayuda a configurar las variables de entorno y verificar la conexión
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function main() {
  console.log('🚀 Configuración de ParetVision\n');
  
  // Leer configuración actual
  const envPath = path.join(__dirname, '.env.local');
  let currentConfig = {};
  
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      if (line.includes('=') && !line.startsWith('#')) {
        const [key, value] = line.split('=');
        currentConfig[key] = value;
      }
    });
  }

  console.log('📋 Configuración actual:');
  console.log('- Supabase URL:', currentConfig['NEXT_PUBLIC_SUPABASE_URL'] || 'No configurado');
  console.log('- Supabase Anon Key:', currentConfig['NEXT_PUBLIC_SUPABASE_ANON_KEY'] ? '✓ Configurado' : '❌ No configurado');
  console.log('- Supabase Service Key:', currentConfig['SUPABASE_SERVICE_ROLE_KEY'] ? '✓ Configurado' : '❌ No configurado');
  console.log('- OpenAI API Key:', currentConfig['OPENAI_API_KEY'] ? '✓ Configurado' : '❌ No configurado');
  console.log();

  const updateConfig = await question('¿Deseas actualizar la configuración? (y/n): ');
  
  if (updateConfig.toLowerCase() === 'y') {
    console.log('\n📝 Ingresa tus credenciales:\n');
    
    const supabaseUrl = await question('Supabase URL (https://tu-proyecto.supabase.co): ');
    const supabaseAnonKey = await question('Supabase Anon Key: ');
    const supabaseServiceKey = await question('Supabase Service Role Key: ');
    const openaiKey = await question('OpenAI API Key (sk-...): ');
    
    const newEnvContent = `# Configuración de Supabase
NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl || currentConfig['NEXT_PUBLIC_SUPABASE_URL'] || 'https://your-project.supabase.co'}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseAnonKey || currentConfig['NEXT_PUBLIC_SUPABASE_ANON_KEY'] || 'your_supabase_anon_key_here'}
SUPABASE_SERVICE_ROLE_KEY=${supabaseServiceKey || currentConfig['SUPABASE_SERVICE_ROLE_KEY'] || 'your_supabase_service_role_key_here'}

# Configuración de OpenAI
OPENAI_API_KEY=${openaiKey || currentConfig['OPENAI_API_KEY'] || 'sk-your_openai_api_key_here'}

# Configuración de la aplicación
NEXT_PUBLIC_APP_URL=http://localhost:3000
`;
    
    fs.writeFileSync(envPath, newEnvContent);
    console.log('\n✅ Configuración guardada en .env.local');
  }

  console.log('\n📋 Próximos pasos:');
  console.log('1. Configura tu base de datos Supabase usando el SQL del README.md');
  console.log('2. Ejecuta: npm run dev');
  console.log('3. Ve a http://localhost:3000');
  console.log('\n🎉 ¡Tu aplicación estará lista!');
  
  rl.close();
}

main().catch(console.error);
