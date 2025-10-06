/**
 * Loan Success Page
 * Shows success message after loan approval
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LoanSuccessNotification from '@/components/loan/LoanSuccessNotification';

function LoanSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [loanData, setLoanData] = useState<{
    amount: number;
    transactionHash: string;
    walletAddress: string;
  } | null>(null);

  useEffect(() => {
    // Get data from URL params or session storage
    const amount = searchParams.get('amount');
    const txHash = searchParams.get('txHash');
    const address = searchParams.get('address');

    if (amount && txHash && address) {
      setLoanData({
        amount: parseFloat(amount),
        transactionHash: txHash,
        walletAddress: address,
      });
    } else {
      // Try to get from session storage (fallback)
      if (typeof window !== 'undefined') {
        const storedAddress = sessionStorage.getItem('walletAddress');
        const storedLoanResult = sessionStorage.getItem('loanResult');
        
        if (storedAddress && storedLoanResult) {
          const result = JSON.parse(storedLoanResult);
          setLoanData({
            amount: result.amount || 500,
            transactionHash: result.transactionHash || 'mock_tx_hash',
            walletAddress: storedAddress,
          });
        } else {
          // No data available, redirect
          router.push('/dashboard');
        }
      }
    }
  }, [searchParams, router]);

  if (!loanData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-indigo-400 mx-auto mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-white text-lg">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <LoanSuccessNotification
      amount={loanData.amount}
      transactionHash={loanData.transactionHash}
      walletAddress={loanData.walletAddress}
    />
  );
}

export default function LoanSuccessPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-indigo-400 mx-auto mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-white text-lg">Cargando...</p>
        </div>
      </div>
    }>
      <LoanSuccessContent />
    </React.Suspense>
  );
}
