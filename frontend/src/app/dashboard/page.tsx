/**
 * Dashboard Page
 * Shows income dashboard for connected wallet
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import IncomeDashboard from '@/components/loan/IncomeDashboard';
import { IncomeHistory } from '@/types/loan';

export default function DashboardPage() {
  const router = useRouter();
  
  // For MVP, use a mock wallet address
  // In production, this would come from wallet connection
  const mockWalletAddress = 'GABC123XYZ456DEF789GHI012JKL345MNO678PQR901STU234VWX567YZA';

  const handleIncomeLoaded = (incomeData: IncomeHistory) => {
    // Store income data in session storage for the credit profile page
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('incomeData', JSON.stringify(incomeData));
      sessionStorage.setItem('walletAddress', mockWalletAddress);
    }
  };

  return (
    <IncomeDashboard
      walletAddress={mockWalletAddress}
      onIncomeLoaded={handleIncomeLoaded}
    />
  );
}
