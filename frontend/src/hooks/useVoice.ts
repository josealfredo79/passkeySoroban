import { useState, useEffect, useRef, useCallback } from "react";

interface VoiceConfig {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
}

interface UseVoiceReturn {
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  error: string | null;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  speak: (text: string, onEnd?: () => void) => void;
  stopSpeaking: () => void;
}

export function useVoice(config: VoiceConfig = {}): UseVoiceReturn {
  const {
    lang = "es-ES",
    continuous = false,
    interimResults = true,
  } = config;

  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check Speech Recognition support
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    // Check Speech Synthesis support
    const speechSynthesis = window.speechSynthesis;

    if (SpeechRecognition && speechSynthesis) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      synthRef.current = speechSynthesis;

      // Wait for voices to load (important for getting all available voices)
      const loadVoices = () => {
        const voices = speechSynthesis.getVoices();
        if (voices.length > 0) {
          console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));
        }
      };

      // Load voices
      if (speechSynthesis.getVoices().length > 0) {
        loadVoices();
      }
      
      // Some browsers need this event
      if (speechSynthesis.addEventListener) {
        speechSynthesis.addEventListener('voiceschanged', loadVoices);
      }

      // Configure recognition - Simple setup like octocat-AR-T
      // Use 'es-MX' for better compatibility with Edge/Brave/Chrome
      recognitionRef.current.lang = 'es-MX';
      recognitionRef.current.continuous = continuous;
      recognitionRef.current.interimResults = interimResults;
      recognitionRef.current.maxAlternatives = 1;

      console.log('🎤 Speech Recognition initialized');
      console.log('📍 Language: es-MX');
      console.log('📍 Browser:', navigator.userAgent.includes('Edg') ? 'Edge' : 
                                   navigator.userAgent.includes('Chrome') ? 'Chrome/Brave' : 
                                   navigator.userAgent.includes('Firefox') ? 'Firefox' : 
                                   navigator.userAgent.includes('Safari') ? 'Safari' : 'Unknown');

      // Event handlers
      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setError(null);
        console.log('🎤 Recording started...');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        console.log('🎤 Recognition ended');
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error, event);
        
        // Provide user-friendly error messages
        let errorMessage = "Error en reconocimiento de voz";
        switch (event.error) {
          case 'not-allowed':
          case 'permission-denied':
            errorMessage = "Permiso de micrófono denegado. Por favor, permite el acceso al micrófono en tu navegador.";
            break;
          case 'no-speech':
            errorMessage = "No se detectó ninguna voz. Intenta hablar más cerca del micrófono.";
            break;
          case 'audio-capture':
            errorMessage = "No se pudo capturar audio. Verifica que tu micrófono esté conectado y funcionando.";
            break;
          case 'network':
            // Según MDN: Chrome/Edge necesitan internet para el reconocimiento en la nube
            // o usar processLocally=true con paquetes de idioma instalados
            errorMessage = "❌ Sin conexión a internet. Chrome/Edge necesitan internet para reconocimiento de voz. Soluciones: 1) Verifica tu conexión WiFi/Ethernet, 2) Recarga la página, 3) Usa el modo escritura mientras tanto.";
            break;
          case 'aborted':
            errorMessage = "Reconocimiento de voz cancelado.";
            break;
          case 'language-not-supported':
            errorMessage = "Idioma no soportado. Verifica que Edge tenga español configurado en edge://settings/languages o prueba recargar la página.";
            break;
          default:
            errorMessage = `Error: ${event.error}`;
        }
        
        setError(errorMessage);
        setIsListening(false);
      };

      recognitionRef.current.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcriptResult = event.results[current][0].transcript;
        setTranscript(transcriptResult);
      };
    } else {
      setIsSupported(false);
      setError("Speech API no soportada en este navegador");
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [lang, continuous, interimResults]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListening) return;

    setTranscript("");
    setError(null);

    try {
      // Simple approach like octocat-AR-T repo
      recognitionRef.current.start();
      console.log('🎤 Listo para escuchar...');
    } catch (err: any) {
      // Handle case where recognition is already started
      if (err.name === 'InvalidStateError') {
        console.log('Recognition already started, stopping and restarting...');
        try {
          recognitionRef.current.stop();
          setTimeout(() => {
            try {
              recognitionRef.current.start();
            } catch (e) {
              console.error("Error restarting recognition:", e);
            }
          }, 100);
        } catch (e) {
          console.error("Error stopping recognition:", e);
        }
      } else {
        console.error("Error starting recognition:", err);
        setError("Error al iniciar reconocimiento de voz: " + err.message);
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current || !isListening) return;

    try {
      recognitionRef.current.stop();
    } catch (err) {
      console.error("Error stopping recognition:", err);
    }
  }, [isListening]);

  const speak = useCallback((text: string, onEnd?: () => void) => {
    if (!synthRef.current) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.95; // Slightly slower for better clarity
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Select the best Spanish voice available
    const voices = synthRef.current.getVoices();
    
    // Priority list of high-quality Spanish voices
    const preferredVoices = [
      'Google español',
      'Google español de España',
      'Google español de Estados Unidos',
      'Microsoft Helena - Spanish (Spain)',
      'Microsoft Sabina - Spanish (Mexico)',
      'Mónica',
      'Paulina',
      'Diego',
      'Jorge',
      'Google US English', // fallback
    ];

    // Find the best available voice
    let selectedVoice = null;
    
    // First try to find preferred voices
    for (const preferredName of preferredVoices) {
      selectedVoice = voices.find(voice => 
        voice.name.includes(preferredName) || 
        voice.name === preferredName
      );
      if (selectedVoice) break;
    }

    // If no preferred voice, find any Spanish voice (prefer non-local for better quality)
    if (!selectedVoice) {
      selectedVoice = voices.find(voice => 
        voice.lang.startsWith('es') && !voice.localService
      ) || voices.find(voice => voice.lang.startsWith('es'));
    }

    // Apply the selected voice
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      console.log('Using voice:', selectedVoice.name, selectedVoice.lang);
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      onEnd?.();
    };

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event);
      setIsSpeaking(false);
      setError("Error al sintetizar voz");
    };

    // For longer texts, chunk them to avoid browser timeout
    if (text.length > 200) {
      const chunks = text.match(/[^.!?]+[.!?]+/g) || [text];
      let currentChunk = 0;

      const speakChunk = () => {
        if (currentChunk < chunks.length) {
          const chunkUtterance = new SpeechSynthesisUtterance(chunks[currentChunk]);
          chunkUtterance.lang = lang;
          chunkUtterance.rate = 0.95;
          chunkUtterance.pitch = 1.0;
          chunkUtterance.volume = 1.0;
          if (selectedVoice) chunkUtterance.voice = selectedVoice;

          chunkUtterance.onend = () => {
            currentChunk++;
            if (currentChunk < chunks.length) {
              speakChunk();
            } else {
              setIsSpeaking(false);
              onEnd?.();
            }
          };

          chunkUtterance.onerror = (event) => {
            console.error("Speech synthesis error:", event);
            setIsSpeaking(false);
            setError("Error al sintetizar voz");
          };

          synthRef.current?.speak(chunkUtterance);
        }
      };

      setIsSpeaking(true);
      speakChunk();
    } else {
      synthRef.current.speak(utterance);
    }
  }, [lang]);

  const stopSpeaking = useCallback(() => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    setIsSpeaking(false);
  }, []);

  return {
    isListening,
    isSpeaking,
    transcript,
    error,
    isSupported,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
  };
}
