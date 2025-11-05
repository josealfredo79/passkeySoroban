"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { detectIntent } from "../lib/intent-detection";
import { buildResponse, AssistantResponse } from "../lib/response-builder";
import { startAuthentication } from "@simplewebauthn/browser";
import { useVoice } from "../hooks/useVoice";
import { useElevenLabsTTS } from "../hooks/useElevenLabsTTS";

interface Message {
  role: "user" | "assistant";
  content: string;
  response?: AssistantResponse;
}

const SmartAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const lastTranscriptRef = React.useRef<string>("");
  const hasInitialized = React.useRef(false);

  // Voice functionality - Speech Recognition (es-MX for better Edge compatibility)
  const {
    isListening,
    transcript,
    error: voiceError,
    isSupported: isVoiceSupported,
    startListening,
    stopListening,
  } = useVoice({ lang: "es-MX", continuous: false, interimResults: true });

  // Voice functionality - Text to Speech (ElevenLabs)
  const {
    isSpeaking,
    speak,
    stopSpeaking,
    error: ttsError,
  } = useElevenLabsTTS();

  useEffect(() => {
    // Only initialize once to prevent duplicate welcome messages
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // Check authentication
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token);

    // Welcome message
    const welcomeIntent = detectIntent("hola");
    const welcomeResponse = buildResponse(welcomeIntent, !!token, pathname || "/");
    setMessages([
      {
        role: "assistant",
        content: welcomeResponse.text,
        response: welcomeResponse,
      },
    ]);

    // Speak welcome message if voice is supported (with a small delay)
    if (isVoiceSupported) {
      setTimeout(() => {
        speak(welcomeResponse.text);
      }, 500);
    }
  }, []);

  // Handle voice transcript - Prevent duplicate processing
  useEffect(() => {
    if (transcript && transcript.trim() && transcript !== lastTranscriptRef.current) {
      lastTranscriptRef.current = transcript;
      setInput(transcript);
      
      // Auto-send after receiving transcript (only once)
      const timer = setTimeout(() => {
        handleSendWithText(transcript);
        setInput(""); // Clear input after sending
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [transcript]);

  const executeAction = async (response: AssistantResponse) => {
    if (!response.action) return;

    const { type, target, params } = response.action;

    switch (type) {
      case "navigate":
        if (target) {
          router.push(target);
        }
        break;

      case "biometric_auth":
        try {
          const response = await fetch("/api/user-wallet", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: params?.username || "demo_user" }),
          });

          if (response.ok) {
            const { options } = await response.json();
            const authResult = await startAuthentication(options);

            const verifyResponse = await fetch("/api/user-wallet", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(authResult),
            });

            if (verifyResponse.ok) {
              const { token } = await verifyResponse.json();
              localStorage.setItem("authToken", token);
              setIsAuthenticated(true);

              // Add success message
              setMessages((prev) => [
                ...prev,
                {
                  role: "assistant",
                  content: "✅ Autenticación exitosa! Redirigiendo al dashboard...",
                },
              ]);

              setTimeout(() => router.push("/dashboard"), 1500);
            }
          }
        } catch (error) {
          console.error("Biometric auth error:", error);
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content:
                "❌ Error en la autenticación biométrica. Por favor intenta de nuevo.",
            },
          ]);
        }
        break;

      case "execute":
        if (target) {
          // Execute specific command
          console.log("Execute:", target, params);
        }
        break;
    }
  };

  const handleSendWithText = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);

    // Detect intent
    const intent = detectIntent(text);
    const aiResponse = buildResponse(intent, isAuthenticated, pathname || "/");

    const assistantMessage: Message = {
      role: "assistant",
      content: aiResponse.text,
      response: aiResponse,
    };

    setMessages((prev) => [...prev, assistantMessage]);

    // Speak the response (stop any previous speech first)
    if (isVoiceSupported) {
      stopSpeaking(); // Stop any previous audio
      speak(aiResponse.text);
    }

    // Execute action if auto-execute is enabled
    if (aiResponse.action && !aiResponse.needsConfirmation) {
      executeAction(aiResponse);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    handleSendWithText(input);
    setInput("");
  };

  const handleQuickReply = (value: string) => {
    setInput(value);
    setTimeout(() => {
      const intent = detectIntent(value);
      const aiResponse = buildResponse(intent, isAuthenticated, pathname || "/");

      const assistantMessage: Message = {
        role: "assistant",
        content: aiResponse.text,
        response: aiResponse,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (aiResponse.action) {
        executeAction(aiResponse);
      }
    }, 100);
  };

  return (
    <div className="w-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col max-h-[600px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-t-lg">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <h3 className="font-semibold">Asistente Inteligente</h3>
          {isAuthenticated && (
            <span className="ml-auto text-xs bg-white/20 px-2 py-1 rounded">
              Autenticado
            </span>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx}>
            <div
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <p className="text-sm whitespace-pre-line">{msg.content}</p>
              </div>
            </div>

            {/* Quick Replies */}
            {msg.response?.quickReplies && msg.response.quickReplies.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2 ml-2">
                {msg.response.quickReplies.map((reply, replyIdx) => (
                  <button
                    key={replyIdx}
                    onClick={() => handleQuickReply(reply.value)}
                    className="px-3 py-1.5 bg-white border border-gray-300 rounded-full text-xs hover:bg-gray-50 transition-colors flex items-center gap-1"
                  >
                    {reply.icon && <span>{reply.icon}</span>}
                    <span>{reply.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Suggestions */}
            {msg.response?.suggestions && msg.response.suggestions.length > 0 && (
              <div className="mt-2 ml-2 text-xs text-gray-500">
                <p className="font-semibold mb-1">Sugerencias:</p>
                <ul className="list-disc list-inside">
                  {msg.response.suggestions.map((suggestion, sugIdx) => (
                    <li key={sugIdx}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Confidence indicator */}
            {msg.response?.confidence && (
              <div className="ml-2 mt-1">
                <span
                  className={`text-xs px-2 py-0.5 rounded ${
                    msg.response.confidence === "high"
                      ? "bg-green-100 text-green-700"
                      : msg.response.confidence === "medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  Confianza: {msg.response.confidence}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        {/* Voice status indicator */}
        {(voiceError || ttsError) && (
          <div className="mb-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
            <div className="font-semibold mb-1">⚠️ Error de Voz</div>
            <div className="mb-2">{voiceError || ttsError}</div>
            
            {/* Error de conexión a internet */}
            {voiceError?.includes('Sin conexión') && (
              <div className="mt-2 pt-2 border-t border-red-300 bg-blue-50 p-2 rounded">
                <div className="font-semibold mb-1">🌐 Verifica tu Conexión:</div>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  <li>Asegúrate de estar conectado a WiFi o Ethernet</li>
                  <li>Prueba abrir otra página web para verificar</li>
                  <li>Recarga esta página (F5 o Ctrl+R)</li>
                  <li>Mientras tanto, puedes <strong>escribir</strong> tus mensajes</li>
                </ol>
                <div className="mt-2 text-xs bg-green-100 p-2 rounded">
                  💡 <strong>Nota:</strong> Chrome/Edge necesitan internet la primera vez para descargar el modelo de voz español. Después funcionará offline.
                </div>
              </div>
            )}
            
            {voiceError?.includes('Edge necesita configuración') && (
              <div className="mt-2 pt-2 border-t border-red-300 bg-yellow-50 p-2 rounded">
                <div className="font-semibold mb-1">🔧 Configuración de Edge:</div>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  <li>Presiona <kbd className="px-1 py-0.5 bg-gray-200 rounded">Alt+F</kbd> → Settings</li>
                  <li>Busca "Languages" en la barra de búsqueda</li>
                  <li>Click en "Add languages" y agrega "Español"</li>
                  <li>Marca la opción "Offer to translate..."</li>
                  <li>Reinicia Edge</li>
                </ol>
                <div className="mt-2 text-xs bg-green-100 p-2 rounded">
                  💡 <strong>Atajo rápido:</strong> Copia y pega en Edge: <code className="bg-white px-1 py-0.5 rounded">edge://settings/languages</code>
                </div>
              </div>
            )}
            {(voiceError?.includes('no soporta') && !voiceError?.includes('Edge')) && (
              <div className="mt-2 pt-2 border-t border-red-300">
                <div className="font-semibold mb-1">✅ Navegadores Recomendados:</div>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li><strong>Google Chrome</strong> - Funciona sin configuración</li>
                  <li><strong>Microsoft Edge</strong> - Reconocimiento local</li>
                  <li><strong>Safari</strong> (macOS/iOS) - Funciona offline</li>
                </ul>
                <div className="mt-2 text-xs bg-red-100 p-2 rounded">
                  ❌ <strong>Firefox</strong> tiene soporte limitado de voz en español
                </div>
              </div>
            )}
          </div>
        )}
        
        {isListening && (
          <div className="mb-2 px-3 py-2 bg-purple-50 border border-purple-200 rounded-lg text-xs text-purple-700 flex items-center gap-2">
            <span className="animate-pulse">🎤</span>
            <span>Escuchando... habla ahora</span>
          </div>
        )}

        {isSpeaking && (
          <div className="mb-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700 flex items-center gap-2">
            <span className="animate-pulse">🔊</span>
            <span>Hablando...</span>
          </div>
        )}

        <div className="flex gap-2">
          {/* Voice button */}
          {isVoiceSupported && (
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={isSpeaking}
              className={`px-3 py-2 rounded-lg transition-all text-sm font-medium ${
                isListening
                  ? "bg-red-600 text-white hover:bg-red-700 animate-pulse"
                  : isSpeaking
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-purple-600 text-white hover:bg-purple-700"
              }`}
              title={isListening ? "Detener grabación" : "Hablar"}
            >
              {isListening ? "⏹️" : "🎤"}
            </button>
          )}

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !isListening && handleSend()}
            placeholder={isListening ? "Escuchando..." : "Escribe o habla..."}
            disabled={isListening}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-100 disabled:text-gray-500 text-gray-900 placeholder:text-gray-400"
          />
          
          {/* Stop speaking button */}
          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
              title="Detener voz"
            >
              🔇
            </button>
          )}

          <button
            onClick={handleSend}
            disabled={isListening || !input.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Enviar
          </button>
        </div>
        
        <p className="text-xs text-gray-500 mt-2 text-center flex items-center justify-center gap-2">
          {isVoiceSupported ? (
            <>
              <span>💬 Escribe</span>
              <span>•</span>
              <span>🎤 Habla</span>
              <span>•</span>
              <span>🔊 El asistente responde con voz</span>
            </>
          ) : (
            <span>Escribe tu mensaje (voz no disponible en este navegador)</span>
          )}
        </p>
      </div>
    </div>
  );
};

export default SmartAssistant;
