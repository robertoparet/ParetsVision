import { NextRequest, NextResponse } from 'next/server';
import { generateChatResponse, analyzeImage } from '@/lib/openai';
import { createServerSupabaseClient } from '@/lib/supabase';
import { generateEmbedding } from '@/lib/openai';
import { cosineSimilarity } from '@/utils';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const message = formData.get('message') as string;
    const imageFile = formData.get('image') as File | null;

    if (!message && !imageFile) {
      return NextResponse.json(
        { success: false, error: 'Mensaje o imagen requeridos' },
        { status: 400 }
      );
    }

    let response: string;
    let context: string = '';

    // Si hay una imagen, analizarla primero
    if (imageFile) {
      const imageBuffer = await imageFile.arrayBuffer();
      const base64Image = Buffer.from(imageBuffer).toString('base64');
      const imageUrl = `data:${imageFile.type};base64,${base64Image}`;
      
      const imageAnalysis = await analyzeImage(imageUrl, message || 'Analiza esta imagen técnica');
      
      if (message) {
        // Combinar análisis de imagen con mensaje del usuario
        response = await generateChatResponse([
          { role: 'user', content: `${message}\n\nAnálisis de imagen: ${imageAnalysis}` }
        ]);
      } else {
        response = imageAnalysis;
      }
    } else {
      // Solo mensaje de texto - buscar contexto relevante
      try {
        const supabase = createServerSupabaseClient();
        const queryEmbedding = await generateEmbedding(message);

        // Buscar documentos similares
        const { data: documents, error } = await supabase
          .from('documents')
          .select('id, title, content, embedding')
          .limit(5);

        if (!error && documents) {
          // Calcular similitudes y obtener los más relevantes
          const similarities = documents
            .filter(doc => doc.embedding)
            .map(doc => ({
              ...doc,
              similarity: cosineSimilarity(queryEmbedding, doc.embedding)
            }))
            .filter(doc => doc.similarity > 0.3) // Umbral de relevancia
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, 3);

          if (similarities.length > 0) {
            context = similarities
              .map(doc => `Documento: ${doc.title}\nContenido: ${doc.content.substring(0, 1000)}`)
              .join('\n\n');
          }
        }
      } catch (error) {
        console.error('Error searching for context:', error);
        // Continuar sin contexto si hay error en la búsqueda
      }

      response = await generateChatResponse([
        { role: 'user', content: message }
      ], context);
    }

    return NextResponse.json({
      success: true,
      data: { message: response }
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
