/**
 * Credit scoring logic for gig economy workers
 */

import { IncomeHistory, CreditScoreResult } from '@/types/loan';

const MIN_CREDIT_SCORE = 700;
const BASE_SCORE = 500;
const MAX_INCOME_BONUS = 200;
const MAX_CONSISTENCY_BONUS = 50;
const MAX_STABILITY_BONUS = 50;

/**
 * Calculate standard deviation of weekly incomes
 */
function calculateStandardDeviation(values: number[]): number {
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  return Math.sqrt(variance);
}

/**
 * Calculate weekly totals from income records
 */
function calculateWeeklyTotals(incomeHistory: IncomeHistory): number[] {
  const weeklyTotals: { [key: number]: number } = {};
  
  incomeHistory.records.forEach(record => {
    if (!weeklyTotals[record.week]) {
      weeklyTotals[record.week] = 0;
    }
    weeklyTotals[record.week] += record.amount;
  });

  return Object.values(weeklyTotals);
}

/**
 * Calculate credit score based on income history
 */
export function calculateCreditScore(incomeHistory: IncomeHistory): CreditScoreResult {
  const weeklyTotals = calculateWeeklyTotals(incomeHistory);
  const weeklyAverage = incomeHistory.weeklyAverage;

  // Calculate income bonus (0-200 points)
  // Based on weekly average: $0-$1000+ maps to 0-200 points
  const incomeBonus = Math.min(
    MAX_INCOME_BONUS,
    Math.round((weeklyAverage / 1000) * MAX_INCOME_BONUS)
  );

  // Calculate consistency bonus (0-50 points)
  // Lower standard deviation = higher consistency
  const stdDev = calculateStandardDeviation(weeklyTotals);
  const coefficientOfVariation = stdDev / weeklyAverage;
  const consistencyBonus = Math.round(
    MAX_CONSISTENCY_BONUS * Math.max(0, 1 - coefficientOfVariation)
  );

  // Calculate stability bonus (0-50 points)
  // Check if income is growing or stable (not declining)
  const isStable = weeklyTotals.length >= 2 && 
    weeklyTotals[weeklyTotals.length - 1] >= weeklyTotals[0] * 0.8;
  const stabilityBonus = isStable ? MAX_STABILITY_BONUS : Math.round(MAX_STABILITY_BONUS * 0.5);

  // Calculate final score
  const score = BASE_SCORE + incomeBonus + consistencyBonus + stabilityBonus;

  // Determine eligibility and loan amount
  const eligible = score >= MIN_CREDIT_SCORE;
  let maxLoanAmount = 0;

  if (score >= MIN_CREDIT_SCORE) {
    maxLoanAmount = 500; // $500 USDC for score >= 700
  } else if (score >= 650) {
    maxLoanAmount = 300; // $300 USDC for score 650-699
  }

  return {
    score: Math.round(score),
    eligible,
    maxLoanAmount,
    breakdown: {
      baseScore: BASE_SCORE,
      incomeBonus,
      consistencyBonus,
      stabilityBonus,
    },
    weeklyAverage: Math.round(weeklyAverage),
    consistency: Math.round((1 - Math.min(1, coefficientOfVariation)) * 100),
  };
}

/**
 * Get eligibility message
 */
export function getEligibilityMessage(scoreResult: CreditScoreResult): string {
  if (scoreResult.eligible) {
    return `¡Felicitaciones! Eres elegible para un préstamo de hasta $${scoreResult.maxLoanAmount} USDC`;
  } else if (scoreResult.score >= 650) {
    return `Casi ahí. Podrías calificar para $${scoreResult.maxLoanAmount} USDC. Mejora tu score a ${MIN_CREDIT_SCORE} para obtener $500 USDC.`;
  } else {
    return `Tu score actual no alcanza el mínimo requerido (${MIN_CREDIT_SCORE}). Continúa trabajando para mejorar tu historial.`;
  }
}

/**
 * Format score color class
 */
export function getScoreColorClass(score: number): string {
  if (score >= MIN_CREDIT_SCORE) return 'text-green-400';
  if (score >= 650) return 'text-yellow-400';
  return 'text-red-400';
}

/**
 * Format score badge style
 */
export function getScoreBadgeClass(score: number): string {
  if (score >= MIN_CREDIT_SCORE) return 'bg-green-500/20 border-green-500/30 text-green-400';
  if (score >= 650) return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400';
  return 'bg-red-500/20 border-red-500/30 text-red-400';
}
