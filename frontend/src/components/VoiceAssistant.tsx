import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { startAuthentication } from "../lib/webauthn";
import { getClaudeResponse } from "../lib/claude";


// Extrae el primer bloque JSON de un texto
function extractActionFromText(text: string): any | null {
  const match = text.match(/{[\s\S]*}/);
  if (!match) return null;
  try {
    const actionObj = JSON.parse(match[0]);
    if (actionObj.action) return actionObj;
  } catch (e) {}

  return null;
}

// Llamada real a Claude
async function sendToAI(message: string, history: any[]): Promise<any> {
  try {
    const aiMessage = await getClaudeResponse(message);
    const actionObj = extractActionFromText(aiMessage);
    return {
      message: aiMessage,
      actionObj
    };
  } catch (err) {
    return {
      message: "Error al conectar con Claude API.",
      actionObj: null
    };
  }
}

export default function VoiceAssistant() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [response, setResponse] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasTriedAuth, setHasTriedAuth] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  // Mensaje de bienvenida al montar
  useEffect(() => {
    setHistory([
      { user: null, ai: { message: "👋 ¡Bienvenido! Soy tu agente virtual. Para registrarte solo necesitas escribir tu usuario y pulsar 'Crear Passkey'. No se requieren más datos personales. ¿Tienes cuenta? Escribe 'iniciar sesión' o 'registrar' para continuar." } }
    ]);
    setResponse({ message: "👋 ¡Bienvenido! Soy tu agente virtual. Para registrarte solo necesitas escribir tu usuario y pulsar 'Crear Passkey'. No se requieren más datos personales. ¿Tienes cuenta? Escribe 'iniciar sesión' o 'registrar' para continuar." });
  }, []);


  // Login biométrico real usando WebAuthn
  async function runBiometricLogin() {
    try {
      const result = await startAuthentication();
      return result;
    } catch (e) {
      return { success: false, error: (e as any).message };
    }
  }

  const handleSend = async () => {
    if (!input.trim()) return;
    const lower = input.trim().toLowerCase();
    if (!isAuthenticated) {
      // Siempre consultar primero a la IA
      let aiResponse = await sendToAI(input, history);
      // Filtrar respuesta si la IA pide datos personales innecesarios
      const needsOnlyUser = /nombre completo|tel[eé]fono|correo|fecha de nacimiento|direcci[oó]n|residencial|compartir datos|informaci[oó]n personal|más datos|más información|proporciona/i;
      if (aiResponse.message && needsOnlyUser.test(aiResponse.message)) {
        aiResponse = {
          ...aiResponse,
          message: "Para registrarte en la dapp solo necesitas escribir tu usuario y pulsar 'Crear Passkey'. No se requieren más datos personales."
        };
      }
      setHistory([...history, { user: input, ai: aiResponse }]);
      setResponse(aiResponse);
      setInput("");

      // Si la IA no da acción clara, aplicar lógica de comandos
      const aiText = aiResponse.message?.toLowerCase() || "";
      const noAction = !aiResponse.actionObj;
      if (noAction) {
        if (lower.includes("registrar") || lower.includes("registro") || lower.includes("crear passkey") || lower.includes("autenticar")) {
          if (pathname !== "/register") {
            setHistory(h => [...h, { user: null, ai: { message: "Te llevo a la pantalla de registro para que puedas crear tu Passkey o autenticarte. Solo necesitas escribir tu usuario y pulsar 'Crear Passkey'." } }]);
            setResponse({ message: "Te llevo a la pantalla de registro para que puedas crear tu Passkey o autenticarte. Solo necesitas escribir tu usuario y pulsar 'Crear Passkey'." });
            setTimeout(() => {
              router.push("/register");
            }, 1200);
          } else {
            setHistory(h => [...h, { user: null, ai: { message: "Escribe tu usuario y pulsa 'Crear Passkey'. Si ya tienes Passkey, pulsa 'Autenticar'." } }]);
            setResponse({ message: "Escribe tu usuario y pulsa 'Crear Passkey'. Si ya tienes Passkey, pulsa 'Autenticar'." });
          }
          setInput("");
          return;
        }
        if (lower.includes("iniciar sesión") || lower.includes("login") || lower.includes("acceder")) {
          if (pathname === "/register") {
            setHistory(h => [...h, { user: null, ai: { message: "Si ya tienes Passkey, pulsa 'Autenticar'. Si no, primero crea tu Passkey." } }]);
            setResponse({ message: "Si ya tienes Passkey, pulsa 'Autenticar'. Si no, primero crea tu Passkey." });
            setInput("");
          } else if (pathname === "/login") {
            setTimeout(() => {}, 1);
          } else {
            setHistory(h => [...h, { user: null, ai: { message: "Procesando autenticación biométrica..." } }]);
            setResponse({ message: "Procesando autenticación biométrica..." });
            setHasTriedAuth(true);
            const result = await runBiometricLogin();
            if (result.success) {
              setIsAuthenticated(true);
              setHistory(h => [...h, { user: null, ai: { message: "¡Autenticación biométrica exitosa! Bienvenido/a. Ahora puedes solicitar un préstamo o consultar tu información." } }]);
              setResponse({ message: "¡Autenticación biométrica exitosa! Bienvenido/a. Ahora puedes solicitar un préstamo o consultar tu información." });
              setTimeout(() => {
                router.push("/dashboard");
              }, 1200);
            } else {
              const errMsg = result.error ? result.error.toLowerCase() : "";
              if (
                errMsg.includes("not allowed") ||
                errMsg.includes("not allowed error") ||
                errMsg.includes("no credential") ||
                errMsg.includes("no authenticator") ||
                errMsg.includes("not registered")
              ) {
                setHistory(h => [...h, { user: null, ai: { message: "No tienes un passkey registrado. Te llevo a registro para crear uno nuevo." } }]);
                setResponse({ message: "No tienes un passkey registrado. Te llevo a registro para crear uno nuevo." });
                setTimeout(() => {
                  router.push("/register");
                }, 1800);
              } else {
                setHistory(h => [...h, { user: null, ai: { message: `Error en autenticación biométrica: ${result.error || 'Intenta de nuevo.'}` } }]);
                setResponse({ message: `Error en autenticación biométrica: ${result.error || 'Intenta de nuevo.'}` });
              }
            }
          }
          return;
        }
      }
      return;
    }
    // Si ya está autenticado, responde normalmente
    const aiResponse = await sendToAI(input, history);
    setHistory([...history, { user: input, ai: aiResponse }]);
    setResponse(aiResponse);
    setInput("");
  };



  return (
    <div className="rounded-xl border p-4 bg-white dark:bg-gray-900 shadow-md max-w-xl mx-auto">
      {/* Solo texto, sin micrófono */}
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Escribe aquí para iniciar sesión con biometría (huella o passkey)"
        className="w-full px-3 py-2 border rounded mb-2"
        autoFocus
      />
      <button
        onClick={handleSend}
        className="bg-purple-600 text-white px-4 py-2 rounded"
      >Enviar</button>
      {response && (
        <div className="mt-4 p-3 bg-gray-50 rounded">
          <strong>Respuesta IA:</strong>
          <div>
            {/* Muestra solo el texto sin el JSON si existe */}
            {(() => {
              const match = response.message.match(/{[\s\S]*}/);
              if (match) {
                return response.message.replace(match[0], '').trim();
              }
              return response.message;
            })()}
          </div>
          {/* Si hay acción JSON, la muestra visualmente */}
          {response.actionObj && (
            <div className="mt-2 text-sm text-purple-700">
              <em>Acción detectada: {response.actionObj.action} {response.actionObj.params ? JSON.stringify(response.actionObj.params) : ''}</em>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
