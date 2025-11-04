"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { detectIntent } from "../lib/intent-detection";
import { buildResponse, AssistantResponse } from "../lib/response-builder";
import { startAuthentication } from "@simplewebauthn/browser";

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

  useEffect(() => {
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
  }, [pathname]);

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

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);

    // Detect intent
    const intent = detectIntent(input);
    const aiResponse = buildResponse(intent, isAuthenticated, pathname || "/");

    const assistantMessage: Message = {
      role: "assistant",
      content: aiResponse.text,
      response: aiResponse,
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setInput("");

    // Execute action if auto-execute is enabled
    if (aiResponse.action && !aiResponse.needsConfirmation) {
      executeAction(aiResponse);
    }
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
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Escribe tu mensaje..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Enviar
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Prueba: &quot;quiero registrarme&quot; o &quot;necesito un préstamo&quot;
        </p>
      </div>
    </div>
  );
};

export default SmartAssistant;
