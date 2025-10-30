#![no_std]
use soroban_sdk::{
    auth::{Context, CustomAccountInterface},
    contract, contracterror, contractimpl, contracttype,
    crypto::Hash,
    symbol_short, Bytes, BytesN, Env, Symbol, Vec,
};

mod base64_url;

#[contract]
pub struct WebAuthnAccount;

#[contracterror]
#[derive(Copy, Clone, Eq, PartialEq, Debug)]
pub enum Error {
    NotInited = 1,
    AlreadyInited = 2,
    ClientDataJsonChallengeIncorrect = 3,
    Secp256r1PublicKeyParse = 4,
    Secp256r1SignatureParse = 5,
    Secp256r1VerifyFailed = 6,
    JsonParseError = 7,
}

const STORAGE_KEY_PK: Symbol = symbol_short!("pk");

#[contractimpl]
impl WebAuthnAccount {
    /// Extiende el TTL del contrato
    pub fn extend_ttl(env: Env) {
        let max_ttl = env.storage().max_ttl();
        let contract_address = env.current_contract_address();

        env.storage().instance().extend_ttl(max_ttl, max_ttl);
        env.deployer()
            .extend_ttl(contract_address.clone(), max_ttl, max_ttl);
        env.deployer()
            .extend_ttl_for_code(contract_address.clone(), max_ttl, max_ttl);
        env.deployer()
            .extend_ttl_for_contract_instance(contract_address.clone(), max_ttl, max_ttl);
    }

    /// Inicializa el contrato con una clave pública secp256r1
    pub fn init(env: Env, pk: BytesN<65>) -> Result<(), Error> {
        if env.storage().instance().has(&STORAGE_KEY_PK) {
            return Err(Error::AlreadyInited);
        }

        env.storage().instance().set(&STORAGE_KEY_PK, &pk);

        Self::extend_ttl(env);

        Ok(())
    }

    /// Obtiene la clave pública almacenada
    pub fn get_public_key(env: Env) -> Result<BytesN<65>, Error> {
        env.storage()
            .instance()
            .get(&STORAGE_KEY_PK)
            .ok_or(Error::NotInited)
    }
}

/// Estructura de la firma WebAuthn
#[contracttype]
pub struct Signature {
    pub authenticator_data: Bytes,
    pub client_data_json: Bytes,
    pub signature: BytesN<64>,
}

/// Estructura para parsear client_data_json
#[derive(serde::Deserialize)]
struct ClientDataJson<'a> {
    challenge: &'a str,
}

#[contractimpl]
impl CustomAccountInterface for WebAuthnAccount {
    type Error = Error;
    type Signature = Signature;

    #[allow(non_snake_case)]
    fn __check_auth(
        env: Env,
        signature_payload: Hash<32>,
        signature: Signature,
        _auth_contexts: Vec<Context>,
    ) -> Result<(), Error> {
        // Obtener la clave pública almacenada
        let pk = env
            .storage()
            .instance()
            .get(&STORAGE_KEY_PK)
            .ok_or(Error::NotInited)?;

        // Construir el payload para verificación
        let mut payload = Bytes::new(&env);
        payload.append(&signature.authenticator_data);
        payload.extend_from_array(&env.crypto().sha256(&signature.client_data_json).to_array());
        let payload_hash = env.crypto().sha256(&payload);

        // Verificar la firma secp256r1
        // Implementación real usando secp256r1_verify
        let is_valid = env.crypto().secp256r1_verify(&pk, &payload_hash, &signature.signature);
        if !is_valid {
            return Err(Error::Secp256r1SignatureParse);
        }

        // Parsear el client_data_json para extraer el challenge
        let client_data_json_bytes = signature.client_data_json.to_buffer::<1024>();
        let client_data_json_str = 
            core::str::from_utf8(&client_data_json_bytes).map_err(|_| Error::JsonParseError)?;

        // Verificar que el challenge coincide con el signature_payload
        // Decodificar el challenge de client_data_json
        let challenge_marker = "\"challenge\":\"";
        let challenge_start = client_data_json_str.find(challenge_marker).ok_or(Error::ClientDataJsonChallengeIncorrect)? + challenge_marker.len();
        let challenge_end = client_data_json_str[challenge_start..].find('"').ok_or(Error::ClientDataJsonChallengeIncorrect)? + challenge_start;
        let challenge_b64 = &client_data_json_str[challenge_start..challenge_end];
        // Decodificar base64url
        let challenge_bytes = base64::decode_config(challenge_b64, base64::URL_SAFE_NO_PAD).map_err(|_| Error::ClientDataJsonChallengeIncorrect)?;
        // Comparar con signature_payload
        if challenge_bytes != signature_payload.to_array() {
            return Err(Error::ClientDataJsonChallengeIncorrect);
        }

        // Validación de longitud de firma
        if signature.signature.len() != 64 {
            return Err(Error::Secp256r1SignatureParse);
        }

        // Por ahora, validación básica
        if !client_data_json_str.contains("challenge") {
            return Err(Error::ClientDataJsonChallengeIncorrect);
        }

        Ok(())
    }
}