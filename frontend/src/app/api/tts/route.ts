import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Inicializar OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Generar audio con OpenAI TTS
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1', // o 'tts-1-hd' para mejor calidad
      voice: 'nova', // Voces: alloy, echo, fable, onyx, nova, shimmer
      input: text,
      speed: 1.0, // Velocidad: 0.25 a 4.0
    });

    // Convertir a buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());

    // Retornar audio
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error('OpenAI TTS error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate speech' },
      { status: 500 }
    );
  }
}
