use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, Vec};

// Import types directly in this module
use crate::loan_types::{LoanConfig, LoanError, LoanRecord, TransferResult};

#[contract]
pub struct LoanContract;

#[contractimpl]
impl LoanContract {
    /// Initialize the loan contract with admin, token, and pool addresses
    /// 
    /// # Arguments
    /// * `admin` - Address of the contract administrator
    /// * `token_address` - Address of the USDC token contract
    /// * `pool_address` - Address holding the loan pool funds
    /// * `min_credit_score` - Minimum credit score required (default: 700)
    /// 
    /// # Returns
    /// Result indicating success or error
    pub fn initialize(
        env: Env,
        admin: Address,
        token_address: Address,
        pool_address: Address,
        min_credit_score: u32,
    ) -> Result<(), LoanError> {
        // Implementation will be completed in Day 2
        todo!("Initialize contract - to be implemented")
    }

    /// Transfer a loan to a recipient based on their credit score
    /// 
    /// # Arguments
    /// * `recipient` - Address to receive the loan
    /// * `amount` - Amount in stroops (with 7 decimals)
    /// * `credit_score` - Credit score of the recipient (500-850)
    /// 
    /// # Returns
    /// TransferResult with details of the disbursement
    /// 
    /// # Errors
    /// * InsufficientCreditScore - if score < min_credit_score
    /// * InsufficientPoolFunds - if pool doesn't have enough balance
    /// * DuplicateLoan - if user already has an active loan
    /// * InvalidAmount - if amount is <= 0 or too large
    pub fn transfer_loan(
        env: Env,
        recipient: Address,
        amount: i128,
        credit_score: u32,
    ) -> Result<TransferResult, LoanError> {
        // Implementation will be completed in Day 2
        todo!("Transfer loan - to be implemented")
    }

    /// Get loan history for a specific user
    /// 
    /// # Arguments
    /// * `user` - Address to query loan history for
    /// 
    /// # Returns
    /// Vector of LoanRecord entries
    pub fn get_loan_history(env: Env, user: Address) -> Vec<LoanRecord> {
        // Implementation will be completed in Day 2
        todo!("Get loan history - to be implemented")
    }

    /// Deposit funds into the loan pool
    /// 
    /// # Arguments
    /// * `admin` - Admin address (must match configured admin)
    /// * `amount` - Amount to deposit
    /// 
    /// # Returns
    /// Result indicating success
    /// 
    /// # Errors
    /// * Unauthorized - if caller is not admin
    /// * InvalidAmount - if amount <= 0
    pub fn deposit_to_pool(
        env: Env,
        admin: Address,
        amount: i128,
    ) -> Result<i128, LoanError> {
        // Implementation will be completed in Day 2
        todo!("Deposit to pool - to be implemented")
    }

    /// Get current pool balance
    /// 
    /// # Returns
    /// Current balance in the pool
    pub fn get_pool_balance(env: Env) -> i128 {
        // Implementation will be completed in Day 2
        todo!("Get pool balance - to be implemented")
    }

    /// Check if a user is eligible for a loan
    /// 
    /// # Arguments
    /// * `user` - Address to check eligibility
    /// * `amount` - Requested loan amount
    /// * `credit_score` - User's credit score
    /// 
    /// # Returns
    /// true if eligible, false otherwise
    pub fn check_eligibility(
        env: Env,
        user: Address,
        amount: i128,
        credit_score: u32,
    ) -> bool {
        // Implementation will be completed in Day 2
        todo!("Check eligibility - to be implemented")
    }
}

// Helper functions
impl LoanContract {
    /// Validate that the contract is initialized
    fn require_initialized(env: &Env) -> Result<LoanConfig, LoanError> {
        todo!("Require initialized helper")
    }

    /// Validate that the caller is the admin
    fn require_admin(env: &Env, caller: &Address) -> Result<(), LoanError> {
        todo!("Require admin helper")
    }

    /// Check if user has an active loan (within last 24 hours)
    fn has_active_loan(env: &Env, user: &Address) -> bool {
        todo!("Check active loan helper")
    }

    /// Record a loan in the history
    fn record_loan(env: &Env, loan: LoanRecord) {
        todo!("Record loan helper")
    }
}

#[cfg(test)]
pub mod loan_test;
