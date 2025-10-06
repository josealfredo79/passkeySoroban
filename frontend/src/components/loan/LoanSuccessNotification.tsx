/**
 * Loan Success Notification Component
 * Displays success message with confetti animation
 */

'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';

interface LoanSuccessNotificationProps {
  amount: number;
  transactionHash: string;
  walletAddress: string;
}

export default function LoanSuccessNotification({
  amount,
  transactionHash,
  walletAddress,
}: LoanSuccessNotificationProps) {
  const router = useRouter();

  useEffect(() => {
    // Trigger confetti animation
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#4F46E5', '#7C3AED', '#10B981'],
      });

      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#4F46E5', '#7C3AED', '#10B981'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  const stellarExplorerUrl = `https://stellar.expert/explorer/testnet/tx/${transactionHash}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        {/* Success Icon */}
        <div className="text-center">
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <svg className="w-12 h-12 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            ¡Préstamo Aprobado! 🎉
          </h1>

          <p className="text-gray-300 text-xl">
            Tu préstamo ha sido procesado exitosamente
          </p>
        </div>

        {/* Loan Details Card */}
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border border-indigo-500/20 rounded-3xl p-8">
          <div className="text-center mb-8">
            <p className="text-gray-400 mb-2">Monto Desembolsado</p>
            <div className="text-6xl font-bold text-green-400">
              ${amount}
            </div>
            <p className="text-gray-400 text-lg mt-2">USDC</p>
          </div>

          <div className="space-y-4 border-t border-white/10 pt-6">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Destinatario</span>
              <span className="text-white font-mono text-sm">
                {walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}
              </span>
            </div>

            <div className="flex items-start justify-between">
              <span className="text-gray-400">Transaction Hash</span>
              <div className="text-right">
                <p className="text-white font-mono text-xs break-all max-w-xs">
                  {transactionHash}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-400">Estado</span>
              <span className="flex items-center gap-2 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Confirmado
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-400">Red</span>
              <span className="text-white">Stellar Testnet</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href={stellarExplorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-4 rounded-xl font-semibold text-center hover:bg-white/20 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            Ver en Stellar Explorer
          </a>

          <button
            onClick={() => router.push('/dashboard')}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-4 rounded-xl font-semibold hover:scale-105 transition-transform shadow-lg shadow-indigo-500/50"
          >
            Volver al Dashboard
          </button>
        </div>

        {/* Info Box */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h3 className="text-white font-semibold mb-2">Información Importante</h3>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• Los fondos han sido transferidos a tu wallet</li>
                <li>• Puedes verificar la transacción en Stellar Explorer</li>
                <li>• El préstamo debe ser pagado en los próximos 30 días</li>
                <li>• Mantén un buen historial para futuros préstamos</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
