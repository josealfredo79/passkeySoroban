import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { prompt } = await req.json();
  // Prompt de sistema amigable para préstamos, biometría y seguridad
  const systemPrompt = `Eres un asistente financiero virtual muy amigable. Tu tarea es guiar al usuario paso a paso para solicitar un préstamo (pidiendo solo la información necesaria en cada paso: monto, plazo, ingresos, etc.), explicar y ayudar con el inicio de sesión biométrico (passkey, huella, rostro, etc.), y responder dudas sobre seguridad y privacidad de la biometría en la app, siempre de forma clara, breve, positiva y sencilla. Además de responder en lenguaje natural, cuando detectes que el usuario quiere realizar una acción en la app (como solicitar un préstamo, autenticarse, ver historial, etc.), responde también con un bloque JSON con la acción sugerida y los parámetros necesarios. Ejemplo: {"action": "start_loan_flow", "params": { "amount": 10000, "term": 12 }}. Si la información es insuficiente, pide los datos faltantes y no incluyas la acción hasta que todo esté listo.`;
  const fullPrompt = `${systemPrompt}\nUsuario: ${prompt}`;
  // Permitir usar la API key directamente en desarrollo para pruebas rápidas
    // Usar solo variable de entorno para la API key (seguro para GitHub)
    const apiKey = process.env.CLAUDE_API_KEY;
    console.log("[DEBUG] Claude API Key usada:", apiKey, "Longitud:", apiKey ? apiKey.length : 0);
    if (!apiKey) {
      return NextResponse.json({ text: "CLAUDE_API_KEY no configurada" }, { status: 500 });
    }
  console.log("[DEBUG] Claude API Key usada:", apiKey, "Longitud:", apiKey.length);
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
          { "role": "user", "content": fullPrompt }
        ]
      })
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => "(no body)");
      console.error("Anthropic API returned error", { status: response.status, body: errText });
      return NextResponse.json({ text: "Error al conectar con Claude: " + errText }, { status: 500 });
    }

    const data = await response.json().catch(() => null);

    // Intentar distintos formatos comunes de respuesta y proporcionar información de depuración en dev
    let text =
      data?.content?.[0]?.text ||
      data?.completion?.[0]?.text ||
      data?.message?.content ||
      data?.output?.[0]?.content?.[0]?.text ||
      undefined;

    if (!text) {
      // Log completo para ayudar a diagnosticar problemas de formato/response
      console.error("Anthropic response sin texto esperado", { data });
      if (process.env.NODE_ENV !== "production") {
        return NextResponse.json({ text: "Sin respuesta de Claude.", raw: data }, { status: 200 });
      }
      return NextResponse.json({ text: "Sin respuesta de Claude." }, { status: 500 });
    }

  // Incluir el nombre de la API key para trazabilidad (sin exponer la clave)
  return NextResponse.json({ text, apiKeyName: "ApiEbas" });
  } catch (err: any) {
    console.error("Error en la ruta /api/claude:", err);
    return NextResponse.json({ text: "Error al conectar con Claude: " + err.message }, { status: 500 });
  }
}
