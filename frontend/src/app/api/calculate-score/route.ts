/**
 * API Route: POST /api/calculate-score
 * 
 * Calculates credit score based on income history
 */

import { NextRequest, NextResponse } from 'next/server';
import { calculateCreditScore } from '@/lib/scoring';
import { IncomeHistory } from '@/types/loan';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { incomeHistory } = body;

    // Validate input
    if (!incomeHistory || !incomeHistory.records || !Array.isArray(incomeHistory.records)) {
      return NextResponse.json(
        { error: 'Invalid income history data' },
        { status: 400 }
      );
    }

    // Calculate credit score
    const scoreResult = calculateCreditScore(incomeHistory as IncomeHistory);

    return NextResponse.json({
      success: true,
      data: scoreResult,
    });
  } catch (error) {
    console.error('Error calculating score:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
