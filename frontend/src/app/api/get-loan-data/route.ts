/**
 * API Route: GET /api/get-loan-data
 * 
 * Generates mock income data for a wallet address
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateMockIncomeData } from '@/lib/mock-data';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress } = body;

    // Validate input
    if (!walletAddress || typeof walletAddress !== 'string') {
      return NextResponse.json(
        { error: 'Invalid wallet address' },
        { status: 400 }
      );
    }

    // Generate mock income data
    const incomeData = generateMockIncomeData(walletAddress);

    return NextResponse.json({
      success: true,
      data: incomeData,
    });
  } catch (error) {
    console.error('Error generating loan data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Allow GET requests for testing
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const walletAddress = searchParams.get('walletAddress');

  if (!walletAddress) {
    return NextResponse.json(
      { error: 'Wallet address required' },
      { status: 400 }
    );
  }

  const incomeData = generateMockIncomeData(walletAddress);

  return NextResponse.json({
    success: true,
    data: incomeData,
  });
}
