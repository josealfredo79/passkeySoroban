/**
 * Custom hook for managing loan functionality
 */

import { useState } from 'react';
import { IncomeHistory, CreditScoreResult, LoanResponse } from '@/types/loan';

export function useLoan() {
  const [isLoading, setIsLoading] = useState(false);
  const [incomeData, setIncomeData] = useState<IncomeHistory | null>(null);
  const [scoreData, setScoreData] = useState<CreditScoreResult | null>(null);
  const [loanResult, setLoanResult] = useState<LoanResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch income data for a wallet address
   */
  const fetchIncomeData = async (walletAddress: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/get-loan-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch income data');
      }

      setIncomeData(result.data);
      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Calculate credit score from income history
   */
  const calculateScore = async (incomeHistory: IncomeHistory) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/calculate-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ incomeHistory }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to calculate score');
      }

      setScoreData(result.data);
      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Request a loan
   */
  const requestLoan = async (
    walletAddress: string,
    amount: number,
    creditScore: number
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/request-loan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress,
          amount,
          creditScore,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to request loan');
      }

      setLoanResult(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setLoanResult({
        success: false,
        error: errorMessage,
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Reset all state
   */
  const reset = () => {
    setIncomeData(null);
    setScoreData(null);
    setLoanResult(null);
    setError(null);
  };

  return {
    isLoading,
    incomeData,
    scoreData,
    loanResult,
    error,
    fetchIncomeData,
    calculateScore,
    requestLoan,
    reset,
  };
}
