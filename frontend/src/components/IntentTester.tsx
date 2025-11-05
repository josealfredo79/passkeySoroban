"use client";
import React, { useState } from "react";
import { detectIntent } from "../lib/intent-detection";
import { buildResponse } from "../lib/response-builder";

export default function IntentTester() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<any>(null);

  const handleTest = () => {
    if (!input.trim()) return;
    
    // Detectar intención
    const intent = detectIntent(input);
    
    // Construir respuesta
    const response = buildResponse(intent, false, "/");
    
    setResult({ intent, response });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-purple-600">🧪 Probador de Intenciones</h2>
      
      <div className="mb-4">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleTest()}
          placeholder="Escribe algo... ej: 'quiero registrarme'"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600"
        />
        <button
          onClick={handleTest}
          className="mt-2 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
        >
          🔍 Analizar
        </button>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <h3 className="font-bold text-blue-800 dark:text-blue-200 mb-2">📊 Intención Detectada:</h3>
            <div className="space-y-1 text-sm">
              <div><strong>Tipo:</strong> <span className="text-blue-600 dark:text-blue-300">{result.intent.type}</span></div>
              <div><strong>Confianza:</strong> <span className={`font-bold ${
                result.intent.confidence === 'high' ? 'text-green-600' : 
                result.intent.confidence === 'medium' ? 'text-yellow-600' : 'text-red-600'
              }`}>{result.intent.confidence}</span></div>
              {Object.keys(result.intent.entities).length > 0 && (
                <div><strong>Entidades:</strong> {JSON.stringify(result.intent.entities)}</div>
              )}
              <div><strong>Patrones:</strong> {result.intent.matchedPatterns.slice(0, 3).join(", ")}</div>
            </div>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900 rounded-lg">
            <h3 className="font-bold text-green-800 dark:text-green-200 mb-2">💬 Respuesta Generada:</h3>
            <div className="mb-3 p-3 bg-white dark:bg-gray-800 rounded whitespace-pre-line">
              {result.response.text}
            </div>
            
            {result.response.quickReplies && result.response.quickReplies.length > 0 && (
              <div className="mb-3">
                <div className="text-sm font-semibold mb-2">Botones de respuesta rápida:</div>
                <div className="flex flex-wrap gap-2">
                  {result.response.quickReplies.map((reply: any, idx: number) => (
                    <button
                      key={idx}
                      className="bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-sm"
                    >
                      {reply.icon} {reply.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {result.response.action && (
              <div className="text-sm">
                <strong>Acción:</strong> {result.response.action.type}
                {result.response.action.target && ` → ${result.response.action.target}`}
              </div>
            )}

            {result.response.suggestions && result.response.suggestions.length > 0 && (
              <div className="text-sm mt-2">
                <strong>Sugerencias:</strong> {result.response.suggestions.join(", ")}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h3 className="font-bold mb-2">💡 Prueba estas frases:</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "quiero registrarme",
            "iniciar sesión",
            "solicitar préstamo",
            "necesito 1000 XLM",
            "cuánto tengo",
            "ayuda",
            "hola"
          ].map((phrase, idx) => (
            <button
              key={idx}
              onClick={() => { setInput(phrase); setTimeout(handleTest, 100); }}
              className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-1 rounded text-sm"
            >
              {phrase}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
