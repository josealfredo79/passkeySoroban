import { NextRequest, NextResponse } from 'next/server';

// This endpoint resets demo data for testing purposes
export async function POST(request: NextRequest) {
  try {
    // Send request to reset loan history
    const loanResetResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/request-loan`, {
      method: 'DELETE'
    });

    if (!loanResetResponse.ok) {
      throw new Error('Failed to reset loan data');
    }

    const loanResult = await loanResetResponse.json();

    return NextResponse.json({
      success: true,
      message: 'Demo data has been reset successfully',
      details: {
        loan_pool_reset: loanResult.success,
        pool_balance: loanResult.pool_balance
      }
    });

  } catch (error) {
    console.error('Error resetting demo data:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to reset demo data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Demo Reset Endpoint',
    description: 'Use POST to reset all demo data (loan history, pool balance)',
    usage: 'POST /api/reset-demo',
    note: 'This endpoint is for development and demo purposes only'
  });
}