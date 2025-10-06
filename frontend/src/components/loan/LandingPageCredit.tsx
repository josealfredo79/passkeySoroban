/**
 * Landing Page for Credit System
 * Hero section with CTA to connect wallet
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function LandingPageCredit() {
  const router = useRouter();

  const features = [
    {
      icon: '⚡',
      title: 'Préstamos Instantáneos',
      description: 'Aprobación automática en segundos basada en tu historial',
    },
    {
      icon: '🔒',
      title: 'Sin Papeleos',
      description: 'Todo el proceso es digital y seguro en blockchain',
    },
    {
      icon: '💰',
      title: 'Hasta $500 USDC',
      description: 'Obtén hasta $500 USDC con un buen credit score',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A]">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">💳</span>
            </div>
            <span className="text-white font-bold text-xl">CreditFlow</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center space-y-6">
          <div className="inline-block">
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-2 mb-6">
              <span className="text-indigo-400 text-sm font-semibold">
                🚀 Préstamos Instantáneos en Blockchain
              </span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
            Préstamos Sin
            <br />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Papeleos
            </span>
          </h1>

          <p className="text-gray-300 text-xl md:text-2xl max-w-2xl mx-auto">
            Conecta tu historial de Uber, Rappi o DiDi y obtén un préstamo instantáneo
            basado en tus ingresos reales
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:scale-105 transition-transform shadow-lg shadow-indigo-500/50"
            >
              Conectar Wallet →
            </button>
            <button
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all"
            >
              Ver Demo
            </button>
          </div>

          <div className="flex items-center justify-center gap-6 mt-8 text-gray-400 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>100% Seguro</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Sin Papeleos</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Aprobación Instantánea</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all hover:scale-105"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl flex items-center justify-center text-4xl mb-4">
                {feature.icon}
              </div>
              <h3 className="text-white font-bold text-xl mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-white font-bold text-4xl text-center mb-12">
          ¿Cómo Funciona?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: '1', title: 'Conecta Wallet', desc: 'Autentícate con tu wallet' },
            { step: '2', title: 'Vincula Apps', desc: 'Conecta Uber, Rappi o DiDi' },
            { step: '3', title: 'Obtén Score', desc: 'Calculamos tu credit score' },
            { step: '4', title: 'Recibe Fondos', desc: 'Préstamo instantáneo en USDC' },
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                {item.step}
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-3xl p-12 text-center">
          <h2 className="text-white font-bold text-4xl mb-4">
            ¿Listo para tu Préstamo?
          </h2>
          <p className="text-gray-300 text-xl mb-8">
            Conecta tu wallet y obtén una respuesta en segundos
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-10 py-4 rounded-xl font-semibold text-lg hover:scale-105 transition-transform shadow-lg shadow-indigo-500/50"
          >
            Comenzar Ahora →
          </button>
        </div>
      </section>
    </div>
  );
}
