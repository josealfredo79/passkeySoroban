"use client";

import { useEffect, useRef, useState } from 'react';

export default function TestMicPage() {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError('Tu navegador no soporta reconocimiento de voz');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-MX';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setError('');
      console.log('🎤 Listo para escuchar...');
    };

    recognition.onend = () => {
      setIsListening(false);
      console.log('🎤 Reconocimiento terminado');
    };

    recognition.onresult = (event: any) => {
      const result = event.results[0][0].transcript;
      setTranscript(result);
      console.log('Dijiste:', result);
      console.log('Confidence:', event.results[0][0].confidence);
    };

    recognition.onerror = (event: any) => {
      console.error('Error:', event.error);
      setError(`Error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onspeechend = () => {
      recognition.stop();
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  const startMic = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (e: any) {
        setError(`Error al iniciar: ${e.message}`);
      }
    }
  };

  const stopMic = () => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (e: any) {
        setError(`Error al detener: ${e.message}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          🎤 Test de Micrófono
        </h1>
        
        <div className="mb-6">
          <div className="text-sm text-gray-600 mb-2">
            <strong>Navegador:</strong> {navigator.userAgent.includes('Edg') ? 'Edge' : 'Otro'}
          </div>
          <div className="text-sm text-gray-600 mb-2">
            <strong>Idioma configurado:</strong> es-MX
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        {transcript && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-300 rounded">
            <div className="text-xs text-blue-600 mb-1">Transcripción:</div>
            <div className="text-lg font-semibold text-blue-900">{transcript}</div>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={startMic}
            disabled={isListening}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
              isListening
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isListening ? '🎤 Escuchando...' : '🎤 Iniciar Micrófono'}
          </button>

          {isListening && (
            <button
              onClick={stopMic}
              className="w-full py-3 px-4 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all animate-pulse"
            >
              ⏹️ Detener
            </button>
          )}
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-xs text-gray-600">
          <div className="font-semibold mb-2">Instrucciones:</div>
          <ol className="list-decimal list-inside space-y-1">
            <li>Haz clic en "Iniciar Micrófono"</li>
            <li>Otorga permisos cuando Edge lo solicite</li>
            <li>Di algo en español (ej: "Hola", "Registrarme")</li>
            <li>Espera a que termine de escuchar</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
