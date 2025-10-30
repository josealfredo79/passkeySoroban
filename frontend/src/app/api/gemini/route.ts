
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { prompt } = await req.json();
  // Permitir usar la API key directamente en desarrollo para pruebas rápidas
  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ text: "CLAUDE_API_KEY no configurada" }, { status: 500 });
  }
  if (!apiKey) {
    return NextResponse.json({ text: "CLAUDE_API_KEY no configurada" }, { status: 500 });
  }
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 1024,
        messages: [
          { "role": "user", "content": prompt }
        ]
      })
    });
    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ text: "Error al conectar con Claude: " + err }, { status: 500 });
    }
    const data = await response.json();
    // Claude responde en data.content[0].text
    const text = data.content?.[0]?.text || "Sin respuesta de Claude.";
  // Incluir el nombre de la API key para trazabilidad (sin exponer la clave)
  return NextResponse.json({ text, apiKeyName: "ApiEbas" });
  } catch (err: any) {
    return NextResponse.json({ text: "Error al conectar con Claude: " + err.message }, { status: 500 });
  }
}
