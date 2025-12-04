import { useState, useCallback, useRef } from "react";

/**
 * Hook para Text-to-Speech con múltiples proveedores
 * 
 * Orden de prioridad:
 * 1. ElevenLabs (mejor calidad, 10k chars gratis/mes)
 * 2. Speechify (buena calidad, 50k chars gratis)
 * 3. Web Speech API (fallback gratuito ilimitado)
 */

type TTSProvider = 'elevenlabs' | 'speechify' | 'browser';

interface UseTTSReturn {
  isSpeaking: boolean;
  error: string | null;
  currentProvider: TTSProvider | null;
  speak: (text: string, onEnd?: () => void) => Promise<void>;
  stopSpeaking: () => void;
}

interface UseTTSConfig {
  preferredProvider?: TTSProvider;
  fallbackEnabled?: boolean;
}

export function useTTS(config: UseTTSConfig = {}): UseTTSReturn {
  const { 
    preferredProvider = 'elevenlabs',
    fallbackEnabled = true 
  } = config;

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentProvider, setCurrentProvider] = useState<TTSProvider | null>(null);
  
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(
    typeof window !== 'undefined' ? window.speechSynthesis : null
  );

  const stopSpeaking = useCallback(() => {
    // Detener audio de API
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }
    
    // Detener Web Speech API
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    
    setIsSpeaking(false);
    setCurrentProvider(null);
  }, []);

  // Hablar usando ElevenLabs
  const speakWithElevenLabs = async (text: string, onEnd?: () => void): Promise<boolean> => {
    try {
      const response = await fetch('/api/elevenlabs-tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs error: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      currentAudioRef.current = audio;
      setCurrentProvider('elevenlabs');

      audio.onended = () => {
        setIsSpeaking(false);
        setCurrentProvider(null);
        URL.revokeObjectURL(audioUrl);
        onEnd?.();
      };

      audio.onerror = () => {
        URL.revokeObjectURL(audioUrl);
        throw new Error('Error reproduciendo audio');
      };

      await audio.play();
      return true;
    } catch (err) {
      console.warn('ElevenLabs falló:', err);
      return false;
    }
  };

  // Hablar usando Speechify
  const speakWithSpeechify = async (text: string, onEnd?: () => void): Promise<boolean> => {
    try {
      const response = await fetch('/api/speechify-tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language: 'es-ES' }),
      });

      if (!response.ok) {
        throw new Error(`Speechify error: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      currentAudioRef.current = audio;
      setCurrentProvider('speechify');

      audio.onended = () => {
        setIsSpeaking(false);
        setCurrentProvider(null);
        URL.revokeObjectURL(audioUrl);
        onEnd?.();
      };

      audio.onerror = () => {
        URL.revokeObjectURL(audioUrl);
        throw new Error('Error reproduciendo audio');
      };

      await audio.play();
      return true;
    } catch (err) {
      console.warn('Speechify falló:', err);
      return false;
    }
  };

  // Hablar usando Web Speech API (fallback gratuito)
  const speakWithBrowser = async (text: string, onEnd?: () => void): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!synthRef.current) {
        resolve(false);
        return;
      }

      try {
        synthRef.current.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        // Buscar voz en español
        const voices = synthRef.current.getVoices();
        const spanishVoice = voices.find(v => 
          v.lang.startsWith('es') && (v.name.includes('Google') || v.name.includes('Microsoft'))
        ) || voices.find(v => v.lang.startsWith('es'));
        
        if (spanishVoice) {
          utterance.voice = spanishVoice;
        }

        setCurrentProvider('browser');

        utterance.onend = () => {
          setIsSpeaking(false);
          setCurrentProvider(null);
          onEnd?.();
          resolve(true);
        };

        utterance.onerror = () => {
          resolve(false);
        };

        synthRef.current.speak(utterance);
        resolve(true);
      } catch (err) {
        console.warn('Web Speech API falló:', err);
        resolve(false);
      }
    });
  };

  const speak = useCallback(async (text: string, onEnd?: () => void) => {
    // Detener cualquier audio en curso
    stopSpeaking();
    
    setIsSpeaking(true);
    setError(null);

    // Orden de proveedores según preferencia
    const providers: Array<{
      name: TTSProvider;
      fn: (text: string, onEnd?: () => void) => Promise<boolean>;
    }> = [];

    // Agregar proveedores en orden de preferencia
    if (preferredProvider === 'elevenlabs') {
      providers.push({ name: 'elevenlabs', fn: speakWithElevenLabs });
      if (fallbackEnabled) {
        providers.push({ name: 'speechify', fn: speakWithSpeechify });
        providers.push({ name: 'browser', fn: speakWithBrowser });
      }
    } else if (preferredProvider === 'speechify') {
      providers.push({ name: 'speechify', fn: speakWithSpeechify });
      if (fallbackEnabled) {
        providers.push({ name: 'elevenlabs', fn: speakWithElevenLabs });
        providers.push({ name: 'browser', fn: speakWithBrowser });
      }
    } else {
      providers.push({ name: 'browser', fn: speakWithBrowser });
    }

    // Intentar cada proveedor en orden
    for (const provider of providers) {
      console.log(`🔊 Intentando TTS con: ${provider.name}`);
      const success = await provider.fn(text, onEnd);
      if (success) {
        console.log(`✅ TTS exitoso con: ${provider.name}`);
        return;
      }
    }

    // Si todos fallaron
    setIsSpeaking(false);
    setError('No se pudo generar voz con ningún proveedor');
    console.error('❌ Todos los proveedores de TTS fallaron');
  }, [stopSpeaking, preferredProvider, fallbackEnabled]);

  return {
    isSpeaking,
    error,
    currentProvider,
    speak,
    stopSpeaking,
  };
}
