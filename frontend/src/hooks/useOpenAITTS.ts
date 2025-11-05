import { useState, useCallback } from "react";

interface UseOpenAITTSReturn {
  isSpeaking: boolean;
  error: string | null;
  speak: (text: string, onEnd?: () => void) => Promise<void>;
  stopSpeaking: () => void;
}

export function useOpenAITTS(): UseOpenAITTSReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  const stopSpeaking = useCallback(() => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
    }
    setIsSpeaking(false);
  }, [currentAudio]);

  const speak = useCallback(async (text: string, onEnd?: () => void) => {
    try {
      // Stop any current speech
      stopSpeaking();

      setIsSpeaking(true);
      setError(null);

      // Call our API route
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate speech');
      }

      // Get audio blob
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Create and play audio
      const audio = new Audio(audioUrl);
      setCurrentAudio(audio);

      audio.onended = () => {
        setIsSpeaking(false);
        setCurrentAudio(null);
        URL.revokeObjectURL(audioUrl);
        onEnd?.();
      };

      audio.onerror = (e) => {
        console.error('Audio playback error:', e);
        setError('Error al reproducir audio');
        setIsSpeaking(false);
        setCurrentAudio(null);
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();
    } catch (err: any) {
      console.error('OpenAI TTS error:', err);
      setError(err.message || 'Error al generar voz');
      setIsSpeaking(false);
    }
  }, [stopSpeaking]);

  return {
    isSpeaking,
    error,
    speak,
    stopSpeaking,
  };
}
