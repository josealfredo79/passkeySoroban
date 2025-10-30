// Llama a la API interna que accede a Gemini de forma segura
export async function getGeminiResponse(prompt: string): Promise<string> {
  const res = await fetch("/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.text || "Error en la API interna de Claude");
  }
  const data = await res.json();
  return data.text;
}
