/**
 * Login Page
 * Authenticate with existing Passkey
 */

'use client';

import { PasskeyAuth } from '@/components/PasskeyAuth';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-blue-100 rounded-2xl mb-4">
            <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
  <h1 className="text-3xl font-bold text-gray-800 mb-2">Iniciar sesión</h1>
  <p className="text-gray-600">Accede con tu Passkey biométrico</p>
        </div>

  {/* Componente de autenticación */}
  <PasskeyAuth />

        {/* Enlaces de pie de página */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm mb-3">
            ¿No tienes cuenta?
          </p>
          <Link
            href="/register"
            className="inline-block px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            Crear cuenta nueva
          </Link>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-gray-500 hover:text-gray-700 text-sm font-medium"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
