import React, { useState } from "react";
import { getClaudeResponse } from "../lib/claude";

// Llamada real a Claude
async function sendToAI(message: string, history: any[]): Promise<any> {
  try {
    const aiMessage = await getClaudeResponse(message);
    return {
      message: aiMessage,
      intent: "respuesta",
      extracted_data: {},
      suggested_action: { type: "none" }
    };
  } catch (err) {
    return {
      message: "Error al conectar con Claude API.",
      intent: "error",
      extracted_data: {},
      suggested_action: { type: "none" }
    };
  }
}

export default function VoiceAssistant({ onAction }: { onAction?: (action: any) => void }) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [response, setResponse] = useState<any>(null);
  const [mode, setMode] = useState<"ai" | "manual">("ai");
  const [micOn, setMicOn] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const aiResponse = await sendToAI(input, history);
    setHistory([...history, { user: input, ai: aiResponse }]);
    setResponse(aiResponse);
    setInput("");
    if (onAction) onAction(aiResponse.suggested_action);
  };

  const handleMicToggle = () => {
    setMicOn(prev => !prev);
  };

  return (
    <div className="rounded-xl border p-4 bg-white dark:bg-gray-900 shadow-md max-w-xl mx-auto">
      <div className="mb-2 flex gap-2">
        <button
          className={`px-3 py-1 rounded ${mode === "ai" ? "bg-purple-600 text-white" : "bg-gray-200"}`}
          onClick={() => setMode("ai")}
        >IA (voz/texto)</button>
        <button
          className={`px-3 py-1 rounded ${mode === "manual" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setMode("manual")}
        >Manual tradicional</button>
      </div>
      {mode === "ai" ? (
        <>
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={handleMicToggle}
              className={`px-3 py-2 rounded-full text-xl shadow transition-all duration-200 ${micOn ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700"}`}
              title={micOn ? "Apagar micrófono" : "Encender micrófono"}
            >
              {micOn ? "🎤" : "🎙️"}
            </button>
            <span className="text-sm text-gray-500">{micOn ? "Micrófono encendido" : "Micrófono apagado"}</span>
          </div>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Habla o escribe tu solicitud..."
            className="w-full px-3 py-2 border rounded mb-2"
          />
          <button
            onClick={handleSend}
            className="bg-purple-600 text-white px-4 py-2 rounded"
          >Enviar</button>
          {response && (
            <div className="mt-4 p-3 bg-gray-50 rounded">
              <strong>Respuesta IA:</strong>
              <div>{response.message}</div>
              {response.suggested_action && response.suggested_action.confirmation_message && (
                <div className="mt-2 text-sm text-purple-700">
                  <em>{response.suggested_action.confirmation_message}</em>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="mt-2 p-3 bg-blue-50 rounded">
          <strong>Modo tradicional:</strong>
          <div>Usa los formularios y botones clásicos de la interfaz para navegar y operar.</div>
        </div>
      )}
    </div>
  );
}
