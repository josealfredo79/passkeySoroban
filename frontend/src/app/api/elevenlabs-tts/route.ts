import { NextRequest, NextResponse } from 'next/server';
import { ElevenLabsClient } from 'elevenlabs';

// Inicializar ElevenLabs
const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY || '',
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

    if (!process.env.ELEVENLABS_API_KEY) {
      return NextResponse.json(
        { error: 'ElevenLabs API key not configured' },
        { status: 500 }
      );
    }

    // Generar audio con ElevenLabs
    // Voice IDs populares en español:
    // - "pNInz6obpgDQGcFmaJgB" - Adam (masculina, versátil)
    // - "EXAVITQu4vr4xnSDxMaL" - Sarah (femenina, cálida)
    // - "VR6AewLTigWG4xSOukaG" - Arnold (masculina, profunda)
    // - "ThT5KcBeYPX3keUQqHPh" - Dorothy (femenina, amigable)
    const audioStream = await elevenlabs.textToSpeech.convert('EXAVITQu4vr4xnSDxMaL', {
      text,
      model_id: 'eleven_multilingual_v2', // Soporta español
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.0,
        use_speaker_boost: true,
      },
    });

    // Convertir stream a buffer
    const chunks: Uint8Array[] = [];
    for await (const chunk of audioStream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Retornar audio
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error('ElevenLabs TTS error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate speech' },
      { status: 500 }
    );
  }
}
