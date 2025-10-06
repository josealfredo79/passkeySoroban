/**
 * Credit Profile Page
 * Shows credit score and loan eligibility
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CreditProfile from '@/components/loan/CreditProfile';
import { IncomeHistory } from '@/types/loan';

export default function CreditProfilePage() {
  const router = useRouter();
  const [incomeData, setIncomeData] = useState<IncomeHistory | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load data from session storage
    if (typeof window !== 'undefined') {
      const storedData = sessionStorage.getItem('incomeData');
      const storedAddress = sessionStorage.getItem('walletAddress');

      if (storedData && storedAddress) {
        setIncomeData(JSON.parse(storedData));
        setWalletAddress(storedAddress);
      } else {
        // Redirect to dashboard if no data
        router.push('/dashboard');
      }
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-indigo-400 mx-auto mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-white text-lg">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!incomeData || !walletAddress) {
    return null;
  }

  return <CreditProfile walletAddress={walletAddress} incomeData={incomeData} />;
}
