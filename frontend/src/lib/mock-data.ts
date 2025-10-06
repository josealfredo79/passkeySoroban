/**
 * Mock data generator for gig economy income history
 * Uses wallet address as seed for consistent data generation
 */

import { IncomeHistory, IncomeRecord } from '@/types/loan';

const PLATFORMS = ['Uber', 'Rappi', 'DiDi'] as const;

/**
 * Simple hash function to generate a seed from wallet address
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Seeded pseudo-random number generator
 */
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  nextInRange(min: number, max: number): number {
    return min + this.next() * (max - min);
  }
}

/**
 * Generate mock income data for a wallet address
 * Data is consistent for the same wallet address
 */
export function generateMockIncomeData(walletAddress: string): IncomeHistory {
  const seed = hashString(walletAddress);
  const rng = new SeededRandom(seed);

  // Determine income profile based on seed
  const profileType = seed % 3;
  
  let baseIncome: number;
  let variance: number;
  
  // High score profile (800+)
  if (profileType === 0) {
    baseIncome = 500;
    variance = 50;
  }
  // Medium score profile (720)
  else if (profileType === 1) {
    baseIncome = 370;
    variance = 70;
  }
  // Low score profile (620)
  else {
    baseIncome = 140;
    variance = 40;
  }

  const records: IncomeRecord[] = [];
  const today = new Date();

  // Generate 4 weeks of data, each week with 3 platform entries
  for (let week = 0; week < 4; week++) {
    for (const platform of PLATFORMS) {
      const weekDate = new Date(today);
      weekDate.setDate(today.getDate() - (week * 7));

      // Add some variation to income
      const amount = Math.round(
        baseIncome / 3 + rng.nextInRange(-variance / 3, variance / 3)
      );

      records.push({
        week: 4 - week, // Week 1 is most recent
        platform,
        amount: Math.max(0, amount),
        date: weekDate.toISOString().split('T')[0],
      });
    }
  }

  // Sort by week (most recent first)
  records.sort((a, b) => b.week - a.week);

  const totalIncome = records.reduce((sum, record) => sum + record.amount, 0);
  const weeklyAverage = totalIncome / 4;

  return {
    walletAddress,
    records,
    totalIncome,
    weeklyAverage,
    platforms: Array.from(new Set(records.map(r => r.platform))),
  };
}

/**
 * Get profile description based on income data
 */
export function getProfileDescription(weeklyAverage: number): string {
  if (weeklyAverage >= 450) return 'Alto Ingreso';
  if (weeklyAverage >= 320) return 'Ingreso Medio';
  return 'Ingreso Bajo';
}
