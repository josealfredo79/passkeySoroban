#![cfg(test)]

use super::loan_contract::{LoanContract, LoanContractClient, LoanError};
use super::loan_types::{LoanStatus, TransferResult};
use soroban_sdk::{
    symbol_short, testutils::Address as _, token, Address, Env, IntoVal,
};

#[test]
fn test_initialize() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, LoanContract);
    let client = LoanContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let token_address = Address::generate(&env);
    let pool_address = Address::generate(&env);

    // Initialize should succeed
    client.initialize(&admin, &token_address, &pool_address);

    // Second initialization should fail
    let result = client.try_initialize(&admin, &token_address, &pool_address);
    assert_eq!(result, Err(Ok(LoanError::AlreadyInitialized)));
}

#[test]
fn test_transfer_loan_not_initialized() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, LoanContract);
    let client = LoanContractClient::new(&env, &contract_id);

    let recipient = Address::generate(&env);
    let amount = 500_0000000; // 500 USDC
    let credit_score = 750;

    // Should fail when not initialized
    let result = client.try_transfer_loan(&recipient, &amount, &credit_score);
    assert_eq!(result, Err(Ok(LoanError::NotInitialized)));
}

#[test]
fn test_transfer_loan_insufficient_credit_score() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, LoanContract);
    let client = LoanContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let token_address = Address::generate(&env);
    let pool_address = Address::generate(&env);
    let recipient = Address::generate(&env);

    // Initialize
    client.initialize(&admin, &token_address, &pool_address);

    let amount = 500_0000000; // 500 USDC
    let credit_score = 650; // Below minimum of 700

    // Should fail with insufficient credit score
    let result = client.try_transfer_loan(&recipient, &amount, &credit_score);
    assert_eq!(result, Err(Ok(LoanError::InsufficientCreditScore)));
}

#[test]
fn test_transfer_loan_invalid_amount() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, LoanContract);
    let client = LoanContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let token_address = Address::generate(&env);
    let pool_address = Address::generate(&env);
    let recipient = Address::generate(&env);

    // Initialize
    client.initialize(&admin, &token_address, &pool_address);

    let credit_score = 750;

    // Test amount too small
    let amount = 50_0000000; // 50 USDC (below minimum)
    let result = client.try_transfer_loan(&recipient, &amount, &credit_score);
    assert_eq!(result, Err(Ok(LoanError::InvalidAmount)));

    // Test amount too large
    let amount = 1500_0000000; // 1500 USDC (above maximum)
    let result = client.try_transfer_loan(&recipient, &amount, &credit_score);
    assert_eq!(result, Err(Ok(LoanError::InvalidAmount)));
}

#[test]
fn test_get_loan_history_empty() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, LoanContract);
    let client = LoanContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let token_address = Address::generate(&env);
    let pool_address = Address::generate(&env);
    let user = Address::generate(&env);

    // Initialize
    client.initialize(&admin, &token_address, &pool_address);

    // Get history for user with no loans
    let history = client.get_loan_history(&user);
    assert_eq!(history.len(), 0);
}

#[test]
fn test_deposit_to_pool_not_initialized() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, LoanContract);
    let client = LoanContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let amount = 1000_0000000;

    // Should fail when not initialized
    let result = client.try_deposit_to_pool(&admin, &amount);
    assert_eq!(result, Err(Ok(LoanError::NotInitialized)));
}

#[test]
fn test_deposit_to_pool_unauthorized() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, LoanContract);
    let client = LoanContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let token_address = Address::generate(&env);
    let pool_address = Address::generate(&env);
    let non_admin = Address::generate(&env);

    // Initialize
    client.initialize(&admin, &token_address, &pool_address);

    let amount = 1000_0000000;

    // Should fail when caller is not admin
    let result = client.try_deposit_to_pool(&non_admin, &amount);
    assert_eq!(result, Err(Ok(LoanError::Unauthorized)));
}

#[test]
fn test_get_total_loans() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, LoanContract);
    let client = LoanContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let token_address = Address::generate(&env);
    let pool_address = Address::generate(&env);

    // Before initialization, total loans should be 0
    let total = client.get_total_loans();
    assert_eq!(total, 0);

    // Initialize
    client.initialize(&admin, &token_address, &pool_address);

    // After initialization, total loans should still be 0
    let total = client.get_total_loans();
    assert_eq!(total, 0);
}

#[test]
fn test_get_pool_balance_not_initialized() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, LoanContract);
    let client = LoanContractClient::new(&env, &contract_id);

    // Should fail when not initialized
    let result = client.try_get_pool_balance();
    assert_eq!(result, Err(Ok(LoanError::NotInitialized)));
}
