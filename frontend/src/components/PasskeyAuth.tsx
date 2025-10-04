"use client";

import { useState } from "react";
import { usePasskey } from "@/hooks/usePasskey";

export function PasskeyAuth() {
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState<string>("");
  const { isSupported, createPasskey, authenticate, isLoading, error } =
    usePasskey();

  const handleRegister = async () => {
    if (!username.trim()) {
      setStatus("Please enter a username");
      return;
    }

    setStatus("Creating passkey...");
    const result = await createPasskey(username);

    if (result.success) {
      setStatus(
        `✅ Passkey created successfully! Credential ID: ${result.credentialId?.slice(0, 20)}...`
      );
    } else {
      setStatus(`❌ Failed: ${result.error}`);
    }
  };

  const handleAuthenticate = async () => {
    setStatus("Authenticating...");
    const result = await authenticate();

    if (result.success) {
      setStatus(`✅ Authenticated successfully! User: ${result.userHandle}`);
    } else {
      setStatus(`❌ Failed: ${result.error}`);
    }
  };

  if (!isSupported) {
    return (
      <div className="glass rounded-2xl p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
            Passkeys Not Supported
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Your browser doesn't support WebAuthn/Passkeys. Please use a modern
            browser like Chrome, Safari, or Edge.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Also ensure you're using HTTPS in production.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-8 space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">
          Try It Out
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Create or authenticate with a passkey
        </p>
      </div>

      {/* Username Input */}
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
        >
          Username
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          disabled={isLoading}
        />
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={handleRegister}
          disabled={isLoading || !username.trim()}
          className="px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Spinner />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>Create Passkey</span>
            </>
          )}
        </button>

        <button
          onClick={handleAuthenticate}
          disabled={isLoading}
          className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Spinner />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
              <span>Authenticate</span>
            </>
          )}
        </button>
      </div>

      {/* Status Display */}
      {(status || error) && (
        <div
          className={`p-4 rounded-lg ${
            error
              ? "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800"
              : status.includes("✅")
              ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800"
              : "bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800"
          }`}
        >
          <p className="text-sm font-medium break-words">{error || status}</p>
        </div>
      )}

      {/* Browser Info */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          🔒 Your biometric data never leaves your device
        </p>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}
