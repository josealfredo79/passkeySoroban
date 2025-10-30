// Llama a la API interna que accede a Claude de forma segura
export async function getClaudeResponse(prompt: string): Promise<string> {
  const res = await fetch("/api/claude", {
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
