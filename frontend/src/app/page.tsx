"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8 text-center">
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Soroban PassKey Demo
          </h1>
          <p className="text-gray-300 text-xl">
            Choose a demo to explore
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Passkey Authentication Demo */}
          <button
            onClick={() => router.push('/passkey-demo')}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all text-left group"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
              🔐
            </div>
            <h2 className="text-white font-bold text-2xl mb-2">
              Passkey Authentication
            </h2>
            <p className="text-gray-400 mb-4">
              WebAuthn/Passkey authentication with biometric security on Soroban
            </p>
            <div className="flex items-center text-indigo-400 font-semibold">
              Explore Demo
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          {/* Credit System Demo */}
          <button
            onClick={() => router.push('/credit')}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all text-left group"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
              💳
            </div>
            <h2 className="text-white font-bold text-2xl mb-2">
              Instant Loans
            </h2>
            <p className="text-gray-400 mb-4">
              Get instant loans based on gig economy income with automated credit scoring
            </p>
            <div className="flex items-center text-indigo-400 font-semibold">
              Explore Demo
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
