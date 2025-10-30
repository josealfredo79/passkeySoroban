import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { message, history } = await req.json();

  // Llama a OpenAI API
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY no configurada");

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          ...history.map((h: any) => ({ role: "user", content: h.user })),
          { role: "user", content: message }
        ],
        max_tokens: 150
      })
    });
    const data = await openaiRes.json();
    if (!openaiRes.ok) {
      // Log detallado del error recibido de OpenAI
      console.error("OpenAI API error:", data);
      throw new Error(data.error?.message || "Error en OpenAI");
    }
    const aiMessage = data.choices?.[0]?.message?.content || "Sin respuesta de IA.";

    // Puedes parsear intents y acciones aquí si lo deseas
    return NextResponse.json({
      message: aiMessage,
      intent: "openai_response",
      extracted_data: {},
      suggested_action: { type: "none" }
    });
  } catch (err: any) {
    console.error("Error en /api/ai/chat:", err);
    return NextResponse.json({
      message: "Error al conectar con OpenAI: " + err.message,
      intent: "error",
      extracted_data: {},
      suggested_action: { type: "none" }
    });
  }
}
