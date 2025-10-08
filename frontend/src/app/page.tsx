"use client";

import React, { useState } from "react";
import SorobanPasskeyApp from "@/components/SorobanPasskeyApp";
import CreditScoringFlow from "@/components/CreditScoringFlow";

type AppMode = 'home' | 'passkey' | 'credit';

export default function Home() {
  const [currentMode, setCurrentMode] = useState<AppMode>('home');

  if (currentMode === 'passkey') {
    return <SorobanPasskeyApp />;
  }

  if (currentMode === 'credit') {
    return <CreditScoringFlow />;
  }

  // Home selector
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation Header */}
      <nav className="relative z-10 px-6 pt-6">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">🔐</span>
            </div>
            <span className="text-white font-bold text-xl">Soroban MVP Demo</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 px-6 pt-20 pb-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Elige tu <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Demo</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-12">
            Explora dos implementaciones completas en Stellar/Soroban
          </p>

          {/* Demo Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Credit Scoring MVP */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 group cursor-pointer"
                 onClick={() => setCurrentMode('credit')}>
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform mx-auto">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Credit Scoring MVP</h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                Sistema completo de préstamos instantáneos para trabajadores gig. 
                Conecta apps de ingresos, calcula credit score y obtén USDC al instante.
              </p>
              <div className="space-y-2 text-sm text-gray-400 mb-6">
                <div>✅ 3 APIs backend funcionando</div>
                <div>✅ Credit scoring avanzado</div>
                <div>✅ Smart contract desplegado</div>
                <div>✅ UI completa: Landing → Income → Score → Loan</div>
              </div>
              <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105">
                Explorar MVP 🚀
              </button>
            </div>

            {/* Original Passkey Demo */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 group cursor-pointer"
                 onClick={() => setCurrentMode('passkey')}>
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform mx-auto">
                <span className="text-3xl">🔐</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Soroban Passkey</h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                Demo original de autenticación WebAuthn con Stellar. 
                Crea cuentas usando biometría y gestiona transacciones de forma segura.
              </p>
              <div className="space-y-2 text-sm text-gray-400 mb-6">
                <div>✅ WebAuthn/Passkey auth</div>
                <div>✅ Stellar account creation</div>
                <div>✅ Biometric security</div>
                <div>✅ Transaction signing</div>
              </div>
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105">
                Ver Demo Original
              </button>
            </div>
          </div>

          {/* Info Banner */}
          <div className="mt-12 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-6">
            <p className="text-purple-200 text-lg">
              <span className="font-bold">Credit Scoring MVP</span> es la implementación principal - 
              un sistema completo de préstamos que demuestra todo el potencial de Stellar/Soroban 
              para aplicaciones DeFi reales.
            </p>
          </div>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>
    </div>
  );
}
