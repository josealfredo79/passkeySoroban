/**
 * Register Page
 * Create new account with Passkey
 */

'use client';

import { PasskeyAuth } from '@/components/PasskeyAuth';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative flex items-center justify-center p-4">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-4">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">Únete a EBAS</h1>
          <p className="text-purple-200">Crea tu cuenta con Passkey</p>
        </div>

        {/* Info Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6 border border-white/20 shadow-lg">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            ¿Qué obtienes?
          </h3>
          <ul className="space-y-2 text-base text-purple-100">
            <li className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              Billetera Stellar automática
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              Acceso a préstamos rápidos
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              Autenticación biométrica segura
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              Sin contraseñas, solo Passkeys
            </li>
          </ul>
        </div>

        {/* Auth Component */}
        <PasskeyAuth />

        {/* Footer Links */}
        <div className="mt-6 text-center">
          <p className="text-purple-200 text-sm mb-3">
            ¿Ya tienes cuenta?
          </p>
          <Link
            href="/login"
            className="inline-block px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg"
          >
            Iniciar sesión
          </Link>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-purple-300 hover:text-white text-sm font-medium"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
