'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

export default function EBASCredit() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Tu Score Crediticio</h1>
        
        <div className="bg-slate-800/50 rounded-3xl p-12 text-center mb-8">
          <div className="text-8xl font-bold text-green-400 mb-4">750</div>
          <p className="text-2xl text-white mb-8">Excelente Score</p>
          <p className="text-gray-300 text-lg mb-8">
            Basado en tus ingresos consistentes, eres elegible para un préstamo de hasta:
          </p>
          <div className="text-6xl font-bold text-purple-400 mb-8">$500 USD</div>
          
          <button
            onClick={() => router.push('/ebas-success')}
            className="flex items-center gap-2 px-8 py-4 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold mx-auto"
          >
            Solicitar Préstamo
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
