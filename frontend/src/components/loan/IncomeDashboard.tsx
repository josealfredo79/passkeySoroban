/**
 * Income Dashboard Component
 * Main dashboard for viewing income history
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLoan } from '@/hooks/useLoan';
import { IncomeHistory } from '@/types/loan';
import IncomeCard from './IncomeCard';
import PlatformBadge from './PlatformBadge';

interface IncomeDashboardProps {
  walletAddress: string;
  onIncomeLoaded?: (incomeData: IncomeHistory) => void;
}

export default function IncomeDashboard({ walletAddress, onIncomeLoaded }: IncomeDashboardProps) {
  const router = useRouter();
  const { isLoading, incomeData, fetchIncomeData, error } = useLoan();
  const [hasLoadedData, setHasLoadedData] = useState(false);

  const handleConnectApps = async () => {
    try {
      const data = await fetchIncomeData(walletAddress);
      setHasLoadedData(true);
      
      // Auto-redirect to credit profile after loading
      setTimeout(() => {
        if (onIncomeLoaded) {
          onIncomeLoaded(data);
        }
        router.push('/credit-profile');
      }, 2000);
    } catch (err) {
      console.error('Error fetching income data:', err);
    }
  };

  // Group records by week
  const weeklyRecords = incomeData?.records.reduce((acc, record) => {
    if (!acc[record.week]) {
      acc[record.week] = [];
    }
    acc[record.week].push(record);
    return acc;
  }, {} as Record<number, typeof incomeData.records>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A]">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">💳</span>
            </div>
            <span className="text-white font-bold text-xl">CreditFlow</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2">
              <span className="text-gray-400 text-xs">Wallet</span>
              <p className="text-white text-sm font-mono">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {!hasLoadedData && !incomeData ? (
          /* Initial State - Connect Apps */
          <div className="text-center space-y-8">
            <div className="inline-block">
              <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl flex items-center justify-center text-5xl mx-auto mb-6">
                📊
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Genera tu Historial de Ingresos
            </h1>

            <p className="text-gray-300 text-xl max-w-2xl mx-auto">
              Conecta tus apps de gig economy para generar tu historial y obtener tu credit score
            </p>

            <button
              onClick={handleConnectApps}
              disabled={isLoading}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:scale-105 transition-transform shadow-lg shadow-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Conectando...
                </span>
              ) : (
                'Conecta tus Apps y Genera tu Historial'
              )}
            </button>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-red-400">{error}</p>
              </div>
            )}

            <div className="mt-12 grid grid-cols-3 gap-4 max-w-md mx-auto">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <span className="text-4xl block mb-2">🚗</span>
                <span className="text-white text-sm font-semibold">Uber</span>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <span className="text-4xl block mb-2">🛵</span>
                <span className="text-white text-sm font-semibold">Rappi</span>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <span className="text-4xl block mb-2">🚕</span>
                <span className="text-white text-sm font-semibold">DiDi</span>
              </div>
            </div>
          </div>
        ) : incomeData && (
          /* Income Data Loaded */
          <div className="space-y-8">
            {isLoading && (
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-6">
                <div className="flex items-center gap-3">
                  <svg className="animate-spin h-6 w-6 text-indigo-400" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <div>
                    <p className="text-white font-semibold">Cargando historial...</p>
                    <p className="text-gray-400 text-sm">Analizando tus ingresos de las últimas 4 semanas</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-white font-bold text-2xl mb-2">Historial de Ingresos</h2>
                  <p className="text-gray-400">Últimas 4 semanas</p>
                </div>
                <div className="flex gap-2">
                  {incomeData.platforms.map(platform => (
                    <PlatformBadge
                      key={platform}
                      platform={platform as 'Uber' | 'Rappi' | 'DiDi'}
                      size="sm"
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-gray-400 text-sm mb-1">Ingreso Total</p>
                  <p className="text-white font-bold text-3xl">
                    ${incomeData.totalIncome.toFixed(0)}
                  </p>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-gray-400 text-sm mb-1">Promedio Semanal</p>
                  <p className="text-white font-bold text-3xl">
                    ${incomeData.weeklyAverage.toFixed(0)}
                  </p>
                </div>
              </div>
            </div>

            {weeklyRecords && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(weeklyRecords)
                  .sort(([a], [b]) => Number(b) - Number(a))
                  .map(([week, records]) => (
                    <IncomeCard
                      key={week}
                      week={Number(week)}
                      records={records}
                    />
                  ))}
              </div>
            )}

            {hasLoadedData && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-white font-semibold text-lg mb-2">¡Historial Generado!</p>
                <p className="text-gray-400">Redirigiendo a tu perfil crediticio...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
