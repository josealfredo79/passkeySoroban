'use client';

import React from 'react';

interface LandingPageProps {
  onStartSession: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartSession }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation Header */}
      <nav className="relative z-10 px-6 pt-6">
        <div className="mx-auto max-w-7xl flex items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">🔐</span>
            </div>
            <span className="text-white font-bold text-xl">Soroban Passkey</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 px-6 pt-20 pb-16">
        <div className="mx-auto max-w-4xl text-center">
          {/* Main Headline */}
          <div className="mb-8">
            <div className="text-6xl mb-4">💰</div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Préstamos Instantáneos
              <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Para Trabajadores Gig
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Conecta tus apps de ingresos (Uber, Rappi, DiDi, Deliveroo) y obtén un préstamo 
              al instante basado en tu historial real. Credit scoring inteligente + Stellar Blockchain.
            </p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-6 mb-12 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-1">≤5 min</div>
              <div className="text-sm text-gray-400">Aprobación</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-1">6-25%</div>
              <div className="text-sm text-gray-400">Tasa APR</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-1">$50-2K</div>
              <div className="text-sm text-gray-400">Límite USDC</div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mb-16">
            <button
              onClick={onStartSession}
              className="group relative px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white text-lg font-semibold rounded-xl shadow-2xl hover:shadow-green-500/25 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
            >
              <span className="relative z-10 flex items-center space-x-2">
                <span>Solicitar Préstamo</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
            </button>
            <p className="text-sm text-gray-400 mt-3">✓ Sin consulta crediticia tradicional ✓ Basado en ingresos reales</p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 px-6 pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Credit Scoring Inteligente</h3>
              <p className="text-gray-300 leading-relaxed">
                Algoritmo avanzado que analiza tus ingresos de múltiples plataformas, 
                estabilidad laboral y comportamiento financiero para calcular tu score real.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Desembolso Instantáneo</h3>
              <p className="text-gray-300 leading-relaxed">
                Préstamos procesados en segundos usando smart contracts en Stellar. 
                Recibe USDC directamente en tu wallet sin intermediarios.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Autenticación Biométrica</h3>
              <p className="text-gray-300 leading-relaxed">
                Seguridad máxima con Windows Hello, TouchID o llaves físicas. 
                Tu clave privada nunca sale de tu dispositivo.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="relative z-10 px-6 pb-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
            ¿Cómo Funciona? <span className="text-green-400">Solo 3 Pasos</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative text-center">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Conecta tus Apps</h3>
              <p className="text-gray-300 leading-relaxed">
                Conecta Uber, Rappi, DiDi, Deliveroo y otras apps de trabajo. 
                Analizamos tus ingresos de los últimos 6 meses de forma segura.
              </p>
              <div className="absolute -right-4 top-8 hidden md:block">
                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative text-center">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Obtén tu Score</h3>
              <p className="text-gray-300 leading-relaxed">
                Nuestro algoritmo calcula tu credit score en tiempo real basado en 
                estabilidad de ingresos, diversidad de plataformas y experiencia.
              </p>
              <div className="absolute -right-4 top-8 hidden md:block">
                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Recibe tu USDC</h3>
              <p className="text-gray-300 leading-relaxed">
                Si calificas (score ≥700), recibe el préstamo instantáneamente en tu wallet. 
                Tasas desde 6% APR según tu perfil crediticio.
              </p>
            </div>
          </div>
          
          {/* Supported Platforms */}
          <div className="mt-16 text-center">
            <h3 className="text-lg font-semibold text-gray-300 mb-8">Plataformas Soportadas</h3>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="bg-white/10 px-4 py-2 rounded-lg">
                <span className="text-white font-medium">🚗 Uber</span>
              </div>
              <div className="bg-white/10 px-4 py-2 rounded-lg">
                <span className="text-white font-medium">🍕 Rappi</span>
              </div>
              <div className="bg-white/10 px-4 py-2 rounded-lg">
                <span className="text-white font-medium">🚙 DiDi</span>
              </div>
              <div className="bg-white/10 px-4 py-2 rounded-lg">
                <span className="text-white font-medium">🛵 Deliveroo</span>
              </div>
              <div className="bg-white/10 px-4 py-2 rounded-lg">
                <span className="text-white font-medium">💼 Freelancer</span>
              </div>
              <div className="bg-white/10 px-4 py-2 rounded-lg">
                <span className="text-white font-medium">🎨 Fiverr</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technology Section */}
      <div className="relative z-10 px-6 pb-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">
            Powered by <span className="text-purple-400">Cutting-Edge Technology</span>
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Tech Icons */}
            <div className="flex flex-col items-center space-y-3 group">
              <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-all">
                <span className="text-2xl">🌐</span>
              </div>
              <span className="text-gray-300 font-medium">WebAuthn</span>
            </div>
            
            <div className="flex flex-col items-center space-y-3 group">
              <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-all">
                <span className="text-2xl">⭐</span>
              </div>
              <span className="text-gray-300 font-medium">Stellar</span>
            </div>
            
            <div className="flex flex-col items-center space-y-3 group">
              <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-all">
                <span className="text-2xl">🚀</span>
              </div>
              <span className="text-gray-300 font-medium">Soroban</span>
            </div>
            
            <div className="flex flex-col items-center space-y-3 group">
              <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-all">
                <span className="text-2xl">🔒</span>
              </div>
              <span className="text-gray-300 font-medium">Biometric</span>
            </div>
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
};

export default LandingPage;