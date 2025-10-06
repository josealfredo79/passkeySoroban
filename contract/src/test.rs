#![cfg(test)]
extern crate std;

use super::*;
use soroban_sdk::{testutils::BytesN as _, Env};

#[test]
fn test_init_success() {
    let env = Env::default();
    let contract_id = env.register_contract(None, PasskeyAccount);
    let client = PasskeyAccountClient::new(&env, &contract_id);

    // Generate a random 64-byte public key (simulating a secp256r1 public key)
    let public_key = BytesN::random(&env);
    let credential_id = Bytes::from_slice(&env, b"test-credential-id");

    // Initialize the contract
    client.init(&public_key, &Some(credential_id.clone()));

    // Verify the owner was set
    let owner = client.get_owner();
    assert_eq!(owner, public_key);

    // Verify credential ID was set
    let stored_cred_id = client.get_credential_id();
    assert_eq!(stored_cred_id, Some(credential_id));
}

#[test]
#[should_panic(expected = "Error(Contract, #1)")]
fn test_init_already_initialized() {
    let env = Env::default();
    let contract_id = env.register_contract(None, PasskeyAccount);
    let client = PasskeyAccountClient::new(&env, &contract_id);

    let public_key = BytesN::random(&env);

    // Initialize once
    client.init(&public_key, &None);

    // Try to initialize again - should panic
    client.init(&public_key, &None);
}

#[test]
#[should_panic(expected = "Error(Contract, #2)")]
fn test_get_owner_not_initialized() {
    let env = Env::default();
    let contract_id = env.register_contract(None, PasskeyAccount);
    let client = PasskeyAccountClient::new(&env, &contract_id);

    // Try to get owner before initialization - should panic
    let _result = client.get_owner();
}

#[test]
fn test_get_credential_id_none() {
    let env = Env::default();
    let contract_id = env.register_contract(None, PasskeyAccount);
    let client = PasskeyAccountClient::new(&env, &contract_id);

    let public_key = BytesN::random(&env);

    // Initialize without credential ID
    client.init(&public_key, &None);

    // Verify credential ID is None
    let cred_id = client.get_credential_id();
    assert_eq!(cred_id, None);
}

#[test]
fn test_multiple_keys() {
    let env = Env::default();
    let contract_id = env.register_contract(None, PasskeyAccount);
    let client = PasskeyAccountClient::new(&env, &contract_id);

    // Test with different public keys
    let public_key1 = BytesN::random(&env);
    let public_key2 = BytesN::random(&env);

    // Initialize with first key
    client.init(&public_key1, &None);

    // Verify first key is stored
    assert_eq!(client.get_owner(), public_key1);
    
    // Ensure second key is different
    assert_ne!(public_key1, public_key2);
}

// Note: Testing __check_auth requires more complex setup with actual signature generation
// This would require secp256r1 signature creation which is typically done off-chain
