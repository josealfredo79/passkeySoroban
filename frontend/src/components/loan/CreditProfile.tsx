/**
 * Credit Profile Component
 * Displays credit score and loan eligibility
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLoan } from '@/hooks/useLoan';
import { IncomeHistory, CreditScoreResult } from '@/types/loan';
import { getEligibilityMessage, getScoreColorClass, getScoreBadgeClass } from '@/lib/scoring';
import IncomeChart from './IncomeChart';
import PlatformBadge from './PlatformBadge';

interface CreditProfileProps {
  walletAddress: string;
  incomeData: IncomeHistory;
}

export default function CreditProfile({ walletAddress, incomeData }: CreditProfileProps) {
  const router = useRouter();
  const { isLoading, scoreData, requestLoan, calculateScore } = useLoan();
  const [localScoreData, setLocalScoreData] = useState<CreditScoreResult | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    // Calculate score on mount
    const loadScore = async () => {
      try {
        const result = await calculateScore(incomeData);
        setLocalScoreData(result);
      } catch (err) {
        console.error('Error calculating score:', err);
      }
    };

    loadScore();
  }, [incomeData]);

  const score = localScoreData || scoreData;

  const handleRequestLoan = async () => {
    if (!score || !score.eligible) return;

    setIsRequesting(true);
    try {
      const result = await requestLoan(walletAddress, score.maxLoanAmount, score.score);
      
      // Store result in session storage
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('loanResult', JSON.stringify(result));
      }
      
      router.push('/loan-success');
    } catch (err) {
      console.error('Error requesting loan:', err);
    } finally {
      setIsRequesting(false);
    }
  };

  if (!score) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-indigo-400 mx-auto mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-white text-lg">Calculando tu credit score...</p>
        </div>
      </div>
    );
  }

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
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
        {/* Credit Score Card */}
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border border-indigo-500/20 rounded-3xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Score Display */}
            <div className="text-center md:text-left">
              <p className="text-gray-400 mb-2">Tu Credit Score</p>
              <div className={`text-7xl font-bold ${getScoreColorClass(score.score)}`}>
                {score.score}
              </div>
              <p className="text-gray-400 text-sm mt-2">de 850</p>
            </div>

            {/* Eligibility Badge */}
            <div className="text-center">
              <div className={`inline-block px-6 py-3 rounded-full border ${getScoreBadgeClass(score.score)}`}>
                {score.eligible ? (
                  <div className="flex items-center gap-2">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold">Elegible</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold">No Elegible</span>
                  </div>
                )}
              </div>
              <p className="text-gray-300 mt-4 text-sm max-w-xs mx-auto">
                {getEligibilityMessage(score)}
              </p>
            </div>

            {/* Loan Amount */}
            {score.eligible && (
              <div className="text-center md:text-right">
                <p className="text-gray-400 mb-2">Monto Pre-aprobado</p>
                <div className="text-5xl font-bold text-green-400">
                  ${score.maxLoanAmount}
                </div>
                <p className="text-gray-400 text-sm mt-2">USDC</p>
              </div>
            )}
          </div>

          {/* CTA Button */}
          {score.eligible && (
            <div className="mt-8 text-center">
              <button
                onClick={handleRequestLoan}
                disabled={isRequesting}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-10 py-4 rounded-xl font-semibold text-lg hover:scale-105 transition-transform shadow-lg shadow-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isRequesting ? (
                  <span className="flex items-center gap-2 justify-center">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Procesando...
                  </span>
                ) : (
                  `Solicitar Préstamo de $${score.maxLoanAmount} USDC`
                )}
              </button>
            </div>
          )}
        </div>

        {/* Score Breakdown */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h3 className="text-white font-bold text-xl mb-6">Desglose del Score</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Score Base</span>
              <span className="text-white font-semibold">{score.breakdown.baseScore} pts</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Bonus por Ingresos</span>
              <span className="text-green-400 font-semibold">+{score.breakdown.incomeBonus} pts</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Bonus por Consistencia</span>
              <span className="text-green-400 font-semibold">+{score.breakdown.consistencyBonus} pts</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Bonus por Estabilidad</span>
              <span className="text-green-400 font-semibold">+{score.breakdown.stabilityBonus} pts</span>
            </div>
            <div className="border-t border-white/10 pt-4 flex items-center justify-between">
              <span className="text-white font-bold text-lg">Total</span>
              <span className={`font-bold text-xl ${getScoreColorClass(score.score)}`}>
                {score.score} pts
              </span>
            </div>
          </div>
        </div>

        {/* Income Chart */}
        <IncomeChart incomeHistory={incomeData} />

        {/* Connected Platforms */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h3 className="text-white font-bold text-xl mb-4">Plataformas Conectadas</h3>
          <div className="flex gap-3">
            {incomeData.platforms.map(platform => (
              <PlatformBadge
                key={platform}
                platform={platform as 'Uber' | 'Rappi' | 'DiDi'}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
