'use client';

import React, { useState } from 'react';

interface PasskeyData {
  credentialId: string;
  publicKey: string;
  accountAddress?: string;
  deviceInfo?: string;
  username?: string;
}

interface DashboardProps {
  passkeyData: PasskeyData;
  onLogout: () => void;
  onAuthenticate?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ passkeyData, onLogout, onAuthenticate }) => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const shortenString = (str: string, length: number = 20) => {
    if (str.length <= length) return str;
    return `${str.slice(0, length / 2)}...${str.slice(-length / 2)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <nav className="relative z-10 px-6 pt-6">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">🔐</span>
            </div>
            <span className="text-white font-bold text-xl">Dashboard</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-2 backdrop-blur-sm border border-white/20">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white text-sm font-medium">Conectado</span>
            </div>
            
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 rounded-lg backdrop-blur-sm border border-red-500/30 transition-all duration-200 flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 px-6 pt-8">
        <div className="mx-auto max-w-6xl">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              ¡Bienvenido, <span className="text-purple-400">{passkeyData.username || 'Usuario'}!</span>
            </h1>
            <p className="text-gray-300 text-lg">
              Tu cuenta está protegida con autenticación biométrica segura
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Estado</h3>
                  <p className="text-green-400 text-sm">Autenticado</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Seguridad</h3>
                  <p className="text-blue-400 text-sm">Biométrica</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Red</h3>
                  <p className="text-purple-400 text-sm">Stellar</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Passkey Information */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 12H9l-4 4H2l1.5-1.5A6 6 0 017.257 9.243L9 7h3l4-4h3l-1.5 1.5z" />
                </svg>
                <span>Información del Passkey</span>
              </h2>

              <div className="space-y-6">
                {/* Credential ID */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">ID de Credencial</label>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-black/20 rounded-lg p-3 border border-white/10">
                      <code className="text-green-400 text-sm break-all">
                        {shortenString(passkeyData.credentialId)}
                      </code>
                    </div>
                    <button
                      onClick={() => copyToClipboard(passkeyData.credentialId, 'credential')}
                      className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg border border-purple-500/30 transition-colors"
                    >
                      {copied === 'credential' ? (
                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Public Key */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Clave Pública</label>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-black/20 rounded-lg p-3 border border-white/10">
                      <code className="text-blue-400 text-sm break-all">
                        {shortenString(passkeyData.publicKey)}
                      </code>
                    </div>
                    <button
                      onClick={() => copyToClipboard(passkeyData.publicKey, 'publicKey')}
                      className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg border border-blue-500/30 transition-colors"
                    >
                      {copied === 'publicKey' ? (
                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Account Address */}
                {passkeyData.accountAddress && (
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Dirección de Cuenta</label>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-black/20 rounded-lg p-3 border border-white/10">
                        <code className="text-yellow-400 text-sm break-all">
                          {shortenString(passkeyData.accountAddress)}
                        </code>
                      </div>
                      <button
                        onClick={() => copyToClipboard(passkeyData.accountAddress!, 'address')}
                        className="p-2 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg border border-yellow-500/30 transition-colors"
                      >
                        {copied === 'address' ? (
                          <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions Panel */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Acciones</span>
              </h2>

              <div className="space-y-4">
                {/* Authenticate Button */}
                {onAuthenticate && (
                  <button
                    onClick={onAuthenticate}
                    className="w-full group relative px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-3"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Probar Autenticación</span>
                  </button>
                )}

                {/* Info Cards */}
                <div className="grid grid-cols-1 gap-4 mt-6">
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <h4 className="text-blue-300 font-medium text-sm">Información de Seguridad</h4>
                        <p className="text-gray-300 text-sm mt-1">
                          Tu passkey está protegido por biometría y nunca sale de tu dispositivo.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-green-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <h4 className="text-green-300 font-medium text-sm">Sesión Activa</h4>
                        <p className="text-gray-300 text-sm mt-1">
                          Tu sesión se mantendrá activa mientras permanezcas en esta pestaña.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>
    </div>
  );
};

export default Dashboard;