/**
 * Loan contract client for Stellar/Soroban integration
 */

import * as StellarSdk from '@stellar/stellar-sdk';
import { TransferResult, LoanRecord } from '@/types/loan';

const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 'https://soroban-testnet.stellar.org';
const LOAN_CONTRACT_ID = process.env.NEXT_PUBLIC_LOAN_CONTRACT_ID || '';

/**
 * Initialize Soroban client
 */
export function initializeSorobanClient() {
  return new StellarSdk.SorobanRpc.Server(RPC_URL);
}

/**
 * Transfer loan to recipient via smart contract
 */
export async function transferLoan(
  recipientAddress: string,
  amount: number, // Amount in USDC (will be converted to stroops)
  creditScore: number,
  sourceKeypair: StellarSdk.Keypair
): Promise<TransferResult> {
  if (!LOAN_CONTRACT_ID) {
    throw new Error('Loan contract ID not configured');
  }

  const server = initializeSorobanClient();
  const account = await server.getAccount(sourceKeypair.publicKey());

  // Convert USDC to stroops (7 decimals)
  const amountInStroops = Math.round(amount * 10_000_000);

  // Build the contract invocation
  const contract = new StellarSdk.Contract(LOAN_CONTRACT_ID);
  
  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: '100000',
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      contract.call(
        'transfer_loan',
        StellarSdk.Address.fromString(recipientAddress).toScVal(),
        StellarSdk.nativeToScVal(amountInStroops, { type: 'i128' }),
        StellarSdk.nativeToScVal(creditScore, { type: 'u32' })
      )
    )
    .setTimeout(30)
    .build();

  tx.sign(sourceKeypair);

  const result = await server.sendTransaction(tx);
  
  // Wait for transaction confirmation
  let response = await server.getTransaction(result.hash);
  while (response.status === 'NOT_FOUND') {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    response = await server.getTransaction(result.hash);
  }

  if (response.status === 'SUCCESS') {
    return {
      success: true,
      amount: amountInStroops,
      recipient: recipientAddress,
    };
  } else {
    throw new Error(`Transaction failed: ${response.status}`);
  }
}

/**
 * Get loan history for a user
 */
export async function getLoanHistory(
  userAddress: string
): Promise<LoanRecord[]> {
  if (!LOAN_CONTRACT_ID) {
    throw new Error('Loan contract ID not configured');
  }

  const server = initializeSorobanClient();
  const contract = new StellarSdk.Contract(LOAN_CONTRACT_ID);

  try {
    // This is a simplified version - in production you'd need proper contract invocation
    // For now, return empty array
    return [];
  } catch (error) {
    console.error('Error fetching loan history:', error);
    return [];
  }
}

/**
 * Get pool balance
 */
export async function getPoolBalance(): Promise<number> {
  if (!LOAN_CONTRACT_ID) {
    throw new Error('Loan contract ID not configured');
  }

  const server = initializeSorobanClient();
  
  try {
    // This would invoke the get_pool_balance function
    // For MVP, return mock value
    return 10000; // 10,000 USDC available
  } catch (error) {
    console.error('Error fetching pool balance:', error);
    return 0;
  }
}

/**
 * Format USDC amount from stroops
 */
export function formatUSDC(stroops: number): string {
  const usdc = stroops / 10_000_000;
  return usdc.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Convert USDC to stroops
 */
export function usdcToStroops(usdc: number): number {
  return Math.round(usdc * 10_000_000);
}
