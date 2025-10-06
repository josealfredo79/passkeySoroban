/**
 * Type definitions for the loan system
 */

export interface IncomeRecord {
  week: number;
  platform: 'Uber' | 'Rappi' | 'DiDi';
  amount: number;
  date: string;
}

export interface IncomeHistory {
  walletAddress: string;
  records: IncomeRecord[];
  totalIncome: number;
  weeklyAverage: number;
  platforms: string[];
}

export interface CreditScoreResult {
  score: number;
  eligible: boolean;
  maxLoanAmount: number;
  breakdown: {
    baseScore: number;
    incomeBonus: number;
    consistencyBonus: number;
    stabilityBonus: number;
  };
  weeklyAverage: number;
  consistency: number;
}

export interface LoanRequest {
  walletAddress: string;
  amount: number;
  creditScore: number;
}

export interface LoanResponse {
  success: boolean;
  transactionHash?: string;
  amount?: number;
  error?: string;
}

export interface TransferResult {
  success: boolean;
  amount: number;
  recipient: string;
}

export interface LoanRecord {
  recipient: string;
  amount: number;
  creditScore: number;
  timestamp: number;
  status: 'Active' | 'Repaid' | 'Defaulted';
}

export enum LoanStatus {
  Active = 'Active',
  Repaid = 'Repaid',
  Defaulted = 'Defaulted',
}

export interface LoanHistoryResponse {
  loans: LoanRecord[];
  totalLoans: number;
}
