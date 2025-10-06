/**
 * Income Chart Component
 * Displays a bar chart of weekly income
 */

'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { IncomeHistory } from '@/types/loan';

interface IncomeChartProps {
  incomeHistory: IncomeHistory;
}

export default function IncomeChart({ incomeHistory }: IncomeChartProps) {
  // Group records by week and calculate totals
  const weeklyData = incomeHistory.records.reduce((acc, record) => {
    const weekLabel = `Semana ${record.week}`;
    const existing = acc.find(item => item.week === weekLabel);
    if (existing) {
      existing.amount += record.amount;
    } else {
      acc.push({
        week: weekLabel,
        amount: record.amount,
      });
    }
    return acc;
  }, [] as Array<{ week: string; amount: number }>);

  // Sort by week number (extract from "Semana X")
  weeklyData.sort((a, b) => {
    const weekA = parseInt(a.week.split(' ')[1]);
    const weekB = parseInt(b.week.split(' ')[1]);
    return weekB - weekA; // Most recent first
  });

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
      <h3 className="text-white font-semibold text-lg mb-4">Historial de Ingresos</h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={weeklyData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="week" 
            stroke="rgba(255,255,255,0.5)"
            tick={{ fill: 'rgba(255,255,255,0.7)' }}
          />
          <YAxis 
            stroke="rgba(255,255,255,0.5)"
            tick={{ fill: 'rgba(255,255,255,0.7)' }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(30, 41, 59, 0.95)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#fff',
            }}
            formatter={(value: number) => [`$${value.toFixed(0)}`, 'Ingreso']}
          />
          <Bar 
            dataKey="amount" 
            fill="#10b981" 
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-white/5 rounded-lg p-3">
          <p className="text-gray-400 text-sm">Promedio Semanal</p>
          <p className="text-white font-bold text-xl">
            ${incomeHistory.weeklyAverage.toFixed(0)}
          </p>
        </div>
        <div className="bg-white/5 rounded-lg p-3">
          <p className="text-gray-400 text-sm">Total 4 Semanas</p>
          <p className="text-white font-bold text-xl">
            ${incomeHistory.totalIncome.toFixed(0)}
          </p>
        </div>
      </div>
    </div>
  );
}
