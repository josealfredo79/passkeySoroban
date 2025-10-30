// Script MCP para validar conectividad Gemini API
// Script MCP para validar conectividad Gemini API
// Usa fetch global (Node 18+) en lugar de node-fetch para evitar dependencias
// Script MCP para validar conectividad Gemini API
// Usa fetch global (Node 18+) en lugar de node-fetch para evitar dependencias

async function testGeminiAPI() {
  const apiKey = process.env.GEMINI_API_KEY;
  const endpoint = process.env.GEMINI_API_URL || `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY no está definida en el entorno');
    process.exit(1);
  }
  try {
    if (typeof fetch === 'undefined') {
      throw new Error('fetch no está disponible en este entorno de Node. Use Node 18+ o instale node-fetch');
    }
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: 'ping' }] }] })
    });
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseErr) {
      console.error('❌ Respuesta no JSON de Gemini:', text);
      process.exit(2);
    }
    if (!res.ok) {
      console.error('❌ Error HTTP:', res.status, data);
      process.exit(2);
    }
    if (data.candidates && data.candidates.length > 0) {
      console.log('✅ Gemini API responde correctamente:', data.candidates[0].content.parts[0].text);
      process.exit(0);
    } else {
      console.error('❌ Respuesta inesperada de Gemini:', JSON.stringify(data));
      process.exit(3);
    }
  } catch (e) {
    console.error('❌ Error de red o clave:', e && e.message ? e.message : e);
    process.exit(4);
  }
}

testGeminiAPI();
