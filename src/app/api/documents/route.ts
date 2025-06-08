import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();

    if (!supabase) {
      return NextResponse.json({
        success: true,
        data: [] // Return empty array when Supabase is not configured
      });
    }

    const { data: documents, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching documents:', error);
      return NextResponse.json(
        { success: false, error: 'Error al obtener documentos' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: documents
    });

  } catch (error) {
    console.error('Documents API error:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
