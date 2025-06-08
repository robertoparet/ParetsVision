import { NextRequest, NextResponse } from 'next/server';
import { processDocument } from '@/utils/document-processor';
import { generateEmbedding } from '@/lib/openai';
import { createServerSupabaseClient } from '@/lib/supabase';
import { chunkText } from '@/utils';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Archivo requerido' },
        { status: 400 }
      );
    }

    // Verificar tamaño del archivo (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'El archivo es demasiado grande (máximo 10MB)' },
        { status: 400 }
      );
    }

    // Procesar el documento
    const buffer = Buffer.from(await file.arrayBuffer());
    const document = await processDocument(buffer, file.name);

    // Generar embeddings para el contenido
    const chunks = chunkText(document.content, 1000, 200);
    const embeddings = await Promise.all(
      chunks.map(chunk => generateEmbedding(chunk))
    );    // Guardar en Supabase
    const supabase = createServerSupabaseClient();

    if (!supabase) {
      return NextResponse.json(
        { success: false, error: 'Database not configured' },
        { status: 503 }
      );
    }

    // Guardar el documento principal
    const { data: savedDocument, error: docError } = await supabase
      .from('documents')
      .insert({
        id: document.id,
        title: document.title,
        content: document.content,
        type: document.type,
        metadata: document.metadata,
        created_at: document.createdAt.toISOString(),
        updated_at: document.updatedAt.toISOString(),
        embedding: embeddings[0], // Embedding del primer chunk como principal
      })
      .select()
      .single();

    if (docError) {
      console.error('Error saving document:', docError);
      return NextResponse.json(
        { success: false, error: 'Error al guardar el documento' },
        { status: 500 }
      );
    }

    // Guardar los chunks con embeddings
    const chunkData = chunks.map((chunk, index) => ({
      id: `${document.id}_chunk_${index}`,
      document_id: document.id,
      content: chunk,
      embedding: embeddings[index],
      chunk_index: index,
    }));

    const { error: chunksError } = await supabase
      .from('document_chunks')
      .insert(chunkData);

    if (chunksError) {
      console.error('Error saving chunks:', chunksError);
      // No retornar error aquí, el documento principal ya se guardó
    }

    return NextResponse.json({
      success: true,
      data: { document: savedDocument }
    });

  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      { success: false, error: 'Error al procesar el archivo' },
      { status: 500 }
    );
  }
}
