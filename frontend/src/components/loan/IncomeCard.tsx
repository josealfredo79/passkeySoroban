/**
 * Income Card Component
 * Displays income information for a specific week
 */

import React from 'react';
import { IncomeRecord } from '@/types/loan';
import PlatformBadge from './PlatformBadge';

interface IncomeCardProps {
  records: IncomeRecord[];
  week: number;
}

export default function IncomeCard({ records, week }: IncomeCardProps) {
  const weekTotal = records.reduce((sum, record) => sum + record.amount, 0);
  const weekDate = records[0]?.date || '';

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-white font-semibold text-lg">Semana {week}</h3>
          <p className="text-gray-400 text-sm">{weekDate}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-400">
            ${weekTotal.toFixed(0)}
          </div>
          <p className="text-gray-400 text-xs">USD</p>
        </div>
      </div>

      <div className="space-y-2">
        {records.map((record, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-2 border-t border-white/5"
          >
            <PlatformBadge platform={record.platform} size="sm" />
            <span className="text-white font-medium">${record.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
