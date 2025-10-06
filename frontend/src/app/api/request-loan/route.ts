/**
 * API Route: POST /api/request-loan
 * 
 * Processes loan request and invokes smart contract
 */

import { NextRequest, NextResponse } from 'next/server';
import { LoanRequest } from '@/types/loan';

const MIN_CREDIT_SCORE = 700;
const MIN_LOAN_AMOUNT = 100;
const MAX_LOAN_AMOUNT = 1000;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, amount, creditScore } = body as LoanRequest;

    // Validate input
    if (!walletAddress || typeof walletAddress !== 'string') {
      return NextResponse.json(
        { error: 'Invalid wallet address' },
        { status: 400 }
      );
    }

    if (typeof amount !== 'number' || amount < MIN_LOAN_AMOUNT || amount > MAX_LOAN_AMOUNT) {
      return NextResponse.json(
        { error: `Loan amount must be between $${MIN_LOAN_AMOUNT} and $${MAX_LOAN_AMOUNT}` },
        { status: 400 }
      );
    }

    if (typeof creditScore !== 'number' || creditScore < MIN_CREDIT_SCORE) {
      return NextResponse.json(
        { error: `Credit score must be at least ${MIN_CREDIT_SCORE}` },
        { status: 400 }
      );
    }

    // In production, this would:
    // 1. Verify the credit score
    // 2. Build and sign the Stellar transaction
    // 3. Invoke the loan contract's transfer_loan function
    // 4. Wait for confirmation
    // 5. Return transaction hash

    // For MVP with mock data, return simulated success
    // In a real implementation, you'd use the loan-contract.ts transferLoan function
    
    // Simulate transaction hash
    const mockTxHash = `mock_tx_${Date.now()}_${walletAddress.slice(0, 8)}`;

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    return NextResponse.json({
      success: true,
      transactionHash: mockTxHash,
      amount,
      message: 'Loan approved and disbursed successfully',
    });
  } catch (error) {
    console.error('Error processing loan request:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to process loan request. Please try again.' 
      },
      { status: 500 }
    );
  }
}
