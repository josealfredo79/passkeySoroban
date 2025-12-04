import { NextRequest, NextResponse } from 'next/server';

/**
 * Speechify Text-to-Speech API Route
 * 
 * Endpoint: POST /api/speechify-tts
 * Body: { text: string, voice_id?: string, language?: string }
 * 
 * Speechify ofrece:
 * - 50,000 caracteres gratis
 * - 100 minutos de TTS
 * - 1,000+ voces
 * - 50+ idiomas (incluye español)
 * - Latencia ~250ms
 */

// Voces recomendadas para español
const SPANISH_VOICES = {
  // Voces femeninas
  female_warm: 'kristy', // Voz cálida y amigable
  female_professional: 'carly', // Voz profesional
  // Voces masculinas
  male_friendly: 'henry', // Voz amigable
  male_professional: 'george', // Voz profesional
  // Default
  default: 'kristy',
};

export async function POST(request: NextRequest) {
  try {
    const { text, voice_id, language = 'es-ES' } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.SPEECHIFY_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Speechify API key not configured' },
        { status: 500 }
      );
    }

    // Usar voz especificada o default para español
    const selectedVoice = voice_id || SPANISH_VOICES.default;

    // Llamar a la API de Speechify
    const response = await fetch('https://api.sws.speechify.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: text,
        voice_id: selectedVoice,
        audio_format: 'mp3',
        language: language,
        model: 'simba-multilingual', // Soporta español y otros idiomas
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Speechify API error:', response.status, errorText);
      
      // Proporcionar mensajes de error específicos
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'API key inválida o sin permisos' },
          { status: 401 }
        );
      }
      if (response.status === 402) {
        return NextResponse.json(
          { error: 'Cuota de caracteres agotada' },
          { status: 402 }
        );
      }
      
      return NextResponse.json(
        { error: `Speechify error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Speechify retorna audio en Base64
    if (!data.audio_data) {
      return NextResponse.json(
        { error: 'No audio data received' },
        { status: 500 }
      );
    }

    // Convertir Base64 a Buffer
    const audioBuffer = Buffer.from(data.audio_data, 'base64');

    // Log de uso (para monitoreo de cuota)
    console.log(`Speechify TTS: ${data.billable_characters_count || text.length} caracteres procesados`);

    // Retornar audio como MP3
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length.toString(),
      },
    });

  } catch (error: any) {
    console.error('Speechify TTS error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate speech' },
      { status: 500 }
    );
  }
}

// GET endpoint para verificar estado de la API
export async function GET() {
  const apiKey = process.env.SPEECHIFY_API_KEY;
  
  return NextResponse.json({
    status: apiKey ? 'configured' : 'not_configured',
    provider: 'Speechify',
    features: [
      '50,000 caracteres gratis/mes',
      '1,000+ voces',
      '50+ idiomas',
      'Soporte SSML',
      'Latencia ~250ms',
    ],
  });
}
