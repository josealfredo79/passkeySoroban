//! Loan Contract for Instant Loans with Credit Scoring
//! 
//! This contract manages instant loan disbursement based on credit scores.
//! Features:
//! - Automatic approval for credit scores >= 700
//! - Loan amounts between 100-1000 USDC
//! - Integration with Stellar token contracts
//! - Loan history tracking

#![allow(unused)]
use soroban_sdk::{
    contract, contracterror, contractimpl, token, Address, Env, Vec,
};

use crate::loan_types::{LoanDataKey, LoanRecord, LoanStatus, TransferResult};

/// The loan contract
#[contract]
pub struct LoanContract;

/// Error codes for the loan contract
#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum LoanError {
    /// Contract already initialized
    AlreadyInitialized = 1,
    /// Contract not initialized
    NotInitialized = 2,
    /// Unauthorized access
    Unauthorized = 3,
    /// Credit score too low
    InsufficientCreditScore = 4,
    /// Invalid loan amount
    InvalidAmount = 5,
    /// Insufficient pool balance
    InsufficientPoolBalance = 6,
    /// Transfer failed
    TransferFailed = 7,
}

const MIN_CREDIT_SCORE: u32 = 700;
const MIN_LOAN_AMOUNT: i128 = 100_0000000; // 100 USDC (7 decimals)
const MAX_LOAN_AMOUNT: i128 = 1000_0000000; // 1000 USDC (7 decimals)

#[contractimpl]
impl LoanContract {
    /// Initialize the loan contract
    /// 
    /// # Arguments
    /// * `admin` - Admin address with special privileges
    /// * `token_address` - Address of the USDC token contract
    /// * `pool_address` - Address holding the loan pool funds
    pub fn initialize(
        env: Env,
        admin: Address,
        token_address: Address,
        pool_address: Address,
    ) -> Result<(), LoanError> {
        // Check if already initialized
        if env.storage().instance().has(&LoanDataKey::Initialized) {
            return Err(LoanError::AlreadyInitialized);
        }

        // Require admin authentication
        admin.require_auth();

        // Store configuration
        env.storage().instance().set(&LoanDataKey::Admin, &admin);
        env.storage().instance().set(&LoanDataKey::TokenAddress, &token_address);
        env.storage().instance().set(&LoanDataKey::PoolAddress, &pool_address);
        env.storage().instance().set(&LoanDataKey::Initialized, &true);
        env.storage().instance().set(&LoanDataKey::TotalLoans, &0u32);

        Ok(())
    }

    /// Transfer a loan to a recipient
    /// 
    /// # Arguments
    /// * `recipient` - Address to receive the loan
    /// * `amount` - Loan amount in stroops (7 decimals)
    /// * `credit_score` - Credit score of the recipient (must be >= 700)
    pub fn transfer_loan(
        env: Env,
        recipient: Address,
        amount: i128,
        credit_score: u32,
    ) -> Result<TransferResult, LoanError> {
        // Check initialization
        if !env.storage().instance().has(&LoanDataKey::Initialized) {
            return Err(LoanError::NotInitialized);
        }

        // Validate credit score
        if credit_score < MIN_CREDIT_SCORE {
            return Err(LoanError::InsufficientCreditScore);
        }

        // Validate amount
        if amount < MIN_LOAN_AMOUNT || amount > MAX_LOAN_AMOUNT {
            return Err(LoanError::InvalidAmount);
        }

        // Get contract configuration
        let token_address: Address = env
            .storage()
            .instance()
            .get(&LoanDataKey::TokenAddress)
            .unwrap();
        
        let pool_address: Address = env
            .storage()
            .instance()
            .get(&LoanDataKey::PoolAddress)
            .unwrap();

        // Get token client
        let token = token::Client::new(&env, &token_address);

        // Check pool balance
        let pool_balance = token.balance(&pool_address);
        if pool_balance < amount {
            return Err(LoanError::InsufficientPoolBalance);
        }

        // Require pool authentication for transfer
        pool_address.require_auth();

        // Transfer tokens from pool to recipient
        token.transfer(&pool_address, &recipient, &amount);

        // Create loan record
        let loan_record = LoanRecord {
            recipient: recipient.clone(),
            amount,
            credit_score,
            timestamp: env.ledger().timestamp(),
            status: LoanStatus::Active,
        };

        // Store loan record
        let history_key = LoanDataKey::LoanHistory(recipient.clone());
        let mut history: Vec<LoanRecord> = env
            .storage()
            .persistent()
            .get(&history_key)
            .unwrap_or(Vec::new(&env));
        
        history.push_back(loan_record);
        env.storage().persistent().set(&history_key, &history);

        // Increment total loans counter
        let total_loans: u32 = env
            .storage()
            .instance()
            .get(&LoanDataKey::TotalLoans)
            .unwrap_or(0);
        env.storage().instance().set(&LoanDataKey::TotalLoans, &(total_loans + 1));

        Ok(TransferResult {
            success: true,
            amount,
            recipient,
        })
    }

    /// Get loan history for a user
    /// 
    /// # Arguments
    /// * `user` - Address to query loan history for
    pub fn get_loan_history(env: Env, user: Address) -> Vec<LoanRecord> {
        let history_key = LoanDataKey::LoanHistory(user);
        env.storage()
            .persistent()
            .get(&history_key)
            .unwrap_or(Vec::new(&env))
    }

    /// Deposit funds to the lending pool (admin only)
    /// 
    /// # Arguments
    /// * `admin` - Admin address (must match stored admin)
    /// * `amount` - Amount to deposit
    pub fn deposit_to_pool(
        env: Env,
        admin: Address,
        amount: i128,
    ) -> Result<(), LoanError> {
        // Check initialization
        if !env.storage().instance().has(&LoanDataKey::Initialized) {
            return Err(LoanError::NotInitialized);
        }

        // Verify admin
        let stored_admin: Address = env
            .storage()
            .instance()
            .get(&LoanDataKey::Admin)
            .unwrap();
        
        if admin != stored_admin {
            return Err(LoanError::Unauthorized);
        }

        admin.require_auth();

        // Get contract configuration
        let token_address: Address = env
            .storage()
            .instance()
            .get(&LoanDataKey::TokenAddress)
            .unwrap();
        
        let pool_address: Address = env
            .storage()
            .instance()
            .get(&LoanDataKey::PoolAddress)
            .unwrap();

        // Transfer tokens from admin to pool
        let token = token::Client::new(&env, &token_address);
        token.transfer(&admin, &pool_address, &amount);

        Ok(())
    }

    /// Get pool balance
    pub fn get_pool_balance(env: Env) -> Result<i128, LoanError> {
        // Check initialization
        if !env.storage().instance().has(&LoanDataKey::Initialized) {
            return Err(LoanError::NotInitialized);
        }

        let token_address: Address = env
            .storage()
            .instance()
            .get(&LoanDataKey::TokenAddress)
            .unwrap();
        
        let pool_address: Address = env
            .storage()
            .instance()
            .get(&LoanDataKey::PoolAddress)
            .unwrap();

        let token = token::Client::new(&env, &token_address);
        Ok(token.balance(&pool_address))
    }

    /// Get total loans count
    pub fn get_total_loans(env: Env) -> u32 {
        env.storage()
            .instance()
            .get(&LoanDataKey::TotalLoans)
            .unwrap_or(0)
    }
}
