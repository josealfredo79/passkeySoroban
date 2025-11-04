"use client";

import React from "react";
import SmartAssistant from "@/components/SmartAssistant";

export default function TestAssistantPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Sistema de Asistente Inteligente
          </h1>
          <p className="text-gray-600 mb-6">
            Prueba el nuevo sistema de detección de intenciones con respuestas estructuradas
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
              <h2 className="text-xl font-bold text-purple-900 mb-3 flex items-center gap-2">
                <span>🎯</span>
                <span>Detección de Intenciones</span>
              </h2>
              <ul className="space-y-2 text-sm text-purple-800">
                <li>✅ 9 tipos de intenciones</li>
                <li>✅ 100+ variaciones de frases</li>
                <li>✅ Scoring de confianza</li>
                <li>✅ Extracción de entidades</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
              <h2 className="text-xl font-bold text-blue-900 mb-3 flex items-center gap-2">
                <span>💬</span>
                <span>Respuestas Inteligentes</span>
              </h2>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>✅ Quick replies contextuales</li>
                <li>✅ Sugerencias inteligentes</li>
                <li>✅ Acciones automáticas</li>
                <li>✅ Respuestas adaptativas</li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 p-6 rounded-lg mb-8">
            <h3 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
              <span>🧪</span>
              <span>Prueba estas frases:</span>
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <p className="font-semibold text-amber-800 mb-2">Registro:</p>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>&quot;quiero registrarme&quot;</li>
                  <li>&quot;deseo registrarme&quot;</li>
                  <li>&quot;registrame&quot;</li>
                  <li>&quot;crear cuenta&quot;</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-amber-800 mb-2">Préstamos:</p>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>&quot;necesito un préstamo&quot;</li>
                  <li>&quot;solicitar 500 USDC&quot;</li>
                  <li>&quot;quiero pedir dinero&quot;</li>
                  <li>&quot;préstamo de 1000&quot;</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-amber-800 mb-2">Login:</p>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>&quot;iniciar sesión&quot;</li>
                  <li>&quot;login&quot;</li>
                  <li>&quot;entrar&quot;</li>
                  <li>&quot;autenticar&quot;</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-amber-800 mb-2">Otros:</p>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>&quot;ver mi dashboard&quot;</li>
                  <li>&quot;mi saldo&quot;</li>
                  <li>&quot;ayuda&quot;</li>
                  <li>&quot;hola&quot;</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-6 rounded-lg">
            <h3 className="font-bold text-green-900 mb-2 flex items-center gap-2">
              <span>✨</span>
              <span>Características</span>
            </h3>
            <ul className="text-sm text-green-700 space-y-2">
              <li><strong>Quick Replies:</strong> Botones de respuesta rápida con íconos</li>
              <li><strong>Navegación automática:</strong> Te lleva a la ruta correcta según tu intención</li>
              <li><strong>Autenticación biométrica:</strong> Activa passkeys cuando sea necesario</li>
              <li><strong>Extracción de entidades:</strong> Detecta montos, monedas y nombres de usuario</li>
              <li><strong>Contexto adaptativo:</strong> Respuestas diferentes según autenticación y ruta actual</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Smart Assistant Widget (bottom right) */}
      <SmartAssistant />
    </div>
  );
}
