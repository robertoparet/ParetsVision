import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import { v4 as uuidv4 } from 'uuid';
import { Document, DocumentMetadata } from '@/types';

export async function processPdf(buffer: Buffer, filename: string): Promise<Document> {
  try {
    const data = await pdf(buffer);
    
    const metadata: DocumentMetadata = {
      pages: data.numpages,
      size: buffer.length,
      mimeType: 'application/pdf',
    };

    return {
      id: uuidv4(),
      title: filename.replace(/\.pdf$/i, ''),
      content: data.text,
      type: 'pdf',
      metadata,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error('Error processing PDF:', error);
    throw new Error('Failed to process PDF file');
  }
}

export async function processDocx(buffer: Buffer, filename: string): Promise<Document> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    
    const metadata: DocumentMetadata = {
      size: buffer.length,
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    };

    return {
      id: uuidv4(),
      title: filename.replace(/\.docx$/i, ''),
      content: result.value,
      type: 'docx',
      metadata,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error('Error processing DOCX:', error);
    throw new Error('Failed to process DOCX file');
  }
}

export async function processTextFile(buffer: Buffer, filename: string): Promise<Document> {
  try {
    const content = buffer.toString('utf-8');
    
    const metadata: DocumentMetadata = {
      size: buffer.length,
      mimeType: 'text/plain',
    };

    return {
      id: uuidv4(),
      title: filename.replace(/\.txt$/i, ''),
      content,
      type: 'txt',
      metadata,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error('Error processing text file:', error);
    throw new Error('Failed to process text file');
  }
}

export async function processImage(buffer: Buffer, filename: string): Promise<Document> {
  try {
    const metadata: DocumentMetadata = {
      size: buffer.length,
      mimeType: filename.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg',
    };

    return {
      id: uuidv4(),
      title: filename.replace(/\.(png|jpg|jpeg)$/i, ''),
      content: `Image file: ${filename}`,
      type: 'image',
      metadata,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error('Error processing image:', error);
    throw new Error('Failed to process image file');
  }
}

export function getFileType(filename: string): 'pdf' | 'docx' | 'txt' | 'image' | null {
  const extension = filename.toLowerCase().split('.').pop();
  
  switch (extension) {
    case 'pdf':
      return 'pdf';
    case 'docx':
      return 'docx';
    case 'txt':
      return 'txt';
    case 'png':
    case 'jpg':
    case 'jpeg':
      return 'image';
    default:
      return null;
  }
}

export async function processDocument(
  buffer: Buffer,
  filename: string
): Promise<Document> {
  const fileType = getFileType(filename);
  
  if (!fileType) {
    throw new Error('Unsupported file type');
  }

  switch (fileType) {
    case 'pdf':
      return processPdf(buffer, filename);
    case 'docx':
      return processDocx(buffer, filename);
    case 'txt':
      return processTextFile(buffer, filename);
    case 'image':
      return processImage(buffer, filename);
    default:
      throw new Error('Unsupported file type');
  }
}
