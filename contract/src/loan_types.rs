//! Type definitions for the loan contract

#![allow(unused)]
use soroban_sdk::{contracttype, Address, Env, String, Vec};

/// Status of a loan
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum LoanStatus {
    Active,
    Repaid,
    Defaulted,
}

/// Record of a loan
#[contracttype]
#[derive(Clone, Debug)]
pub struct LoanRecord {
    pub recipient: Address,
    pub amount: i128,
    pub credit_score: u32,
    pub timestamp: u64,
    pub status: LoanStatus,
}

/// Result of a transfer operation
#[contracttype]
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct TransferResult {
    pub success: bool,
    pub amount: i128,
    pub recipient: Address,
}

/// Storage keys for the loan contract
#[contracttype]
#[derive(Clone)]
pub enum LoanDataKey {
    /// Admin address
    Admin,
    /// Token contract address (USDC)
    TokenAddress,
    /// Pool address for funds
    PoolAddress,
    /// Is initialized
    Initialized,
    /// Loan history for a user
    LoanHistory(Address),
    /// Total loans counter
    TotalLoans,
}
